"""Generate design/tokens/tokens.css from design/tokens/tokens.json.

tokens.json is the source of truth. Run from the repo root:  python3 design/tools/build_tokens.py
Output: CSS custom properties on :root (semantic colours point at primitives with var()),
@font-face rules for the self-hosted fonts, and one class per type style.
The build may replace this script with a TypeScript one; the output contract stays the same.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(ROOT, 'tokens', 'tokens.json')))

def val(v):
    m = re.fullmatch(r'\{([a-z0-9-]+)\}', str(v))
    return 'var(--%s)' % m.group(1) if m else v

out = ['/* GENERATED from tokens.json by design/tools/build_tokens.py. Do not edit by hand. */', '']
for f in T['type']['fonts']:
    out.append('@font-face{font-family:"%s";src:url("../fonts/%s") format("woff2");font-weight:%s;font-style:%s;font-display:swap}'
               % (f['family'], os.path.basename(f['file']), f['weight'], f['style']))
out += ['', ':root{']
out.append('  /* colour: primitives first, then semantic roles. Code uses roles only. */')
for t in T['color']['tokens']:
    out.append('  --%s:%s;' % (t['name'], val(t['value'])))
for k, v in T['type']['families'].items():
    out.append('  --font-%s:%s;' % (k, v))
for group in ['spacing', 'radius', 'shadow', 'border', 'size', 'breakpoint', 'timing']:
    out.append('  /* %s */' % group)
    for t in T[group]['tokens']:
        out.append('  --%s:%s;' % (t['name'], val(t['value'])))
out += ['}', '', '/* type styles */']
fluid = {'display': 'clamp(41px, 6.1vw, 75px)', 'headline': 'clamp(31px, 4.2vw, 50px)'}
for g in T['type']['groups']:
    fam = 'var(--font-%s)' % g.get('family', 'sans')
    for s in g['styles']:
        size = fluid.get(s['name'], s['fontSize'])
        decl = ['font-family:%s' % s.get('family', fam) if s.get('family') else 'font-family:%s' % fam,
                'font-size:%s' % size, 'line-height:%s' % s['lineHeight'], 'font-weight:%s' % s['fontWeight']]
        if s.get('letterSpacing'): decl.append('letter-spacing:%s' % s['letterSpacing'])
        out.append('.%s{%s}' % (s['name'], ';'.join(decl)))
open(os.path.join(ROOT, 'tokens', 'tokens.css'), 'w').write('\n'.join(out) + '\n')
print('wrote design/tokens/tokens.css')
