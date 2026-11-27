import json,itertools,math,sys
T={t['name']:t['value'] for t in json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__),'../tokens/tokens.json')))['color']['tokens']}
def res(n):
    v=T[n]
    while v.startswith('{'): v=T[v[1:-1]]
    return v
def rgb(h): h=h.lstrip('#'); return [int(h[i:i+2],16) for i in (0,2,4)]
def lin(c): c/=255; return c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
def lum(h): r,g,b=[lin(x) for x in rgb(h)]; return .2126*r+.7152*g+.0722*b
def cr(a,b): la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+.05)/(lb+.05)
def lab(h):
    r,g,b=[lin(x) for x in rgb(h)]
    x=(.4124*r+.3576*g+.1805*b)/.95047; y=.2126*r+.7152*g+.0722*b; z=(.0193*r+.1192*g+.9505*b)/1.08883
    f=lambda t: t**(1/3) if t>.008856 else 7.787*t+16/116
    return (116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z)))
def dE(a,b): return math.dist(lab(a),lab(b))
def deut(h): # rough deuteranopia simulation
    r,g,b=[lin(x) for x in rgb(h)]
    R=.367*r+.861*g-.228*b; G=.280*r+.673*g+.047*b; B=-.012*r+.043*g+.969*b
    enc=lambda c: round(255*(12.92*c if c<=.0031308 else 1.055*max(c,0)**(1/2.4)-.055))
    return '#%02X%02X%02X'%tuple(min(255,max(0,enc(c))) for c in (R,G,B))
if __name__=='__main__':
    print('TEXT CONTRAST (need 4.5)')
    fills=['surface-desk','surface-page','surface-raised','surface-input','stage-borrador','stage-revision','stage-cliente','stage-cambios','stage-programado','surface-danger','highlight']
    for fg in ['content','content-muted','content-brand','content-danger']:
        print(' ',fg,' '.join('%s=%.1f'%(f.split('-')[-1][:6],cr(res(fg),res(f))) for f in fills))
    for fg,bg in [('content-inverse','surface-inverse'),('on-action-primary','action-primary'),('on-action-primary','action-primary-top'),('on-action-danger','action-danger'),('content-inverse','brand'),('content-inverse','helper-copy'),('content-inverse','helper-numeros'),('figure-eye-dark','helper-revision'),('figure-eye','helper-asistente'),('content-inverse','brand-deep')]:
        print('  %s on %s %.1f'%(fg,bg,cr(res(fg),res(bg))))
    print('LINES / MARKS (need 3)')
    for fg,bg in [('line-danger','surface-danger'),('line-danger','surface-raised'),('line-danger','surface-page'),('line-danger','surface-input'),('brand','surface-page'),('helper-revision','surface-page'),('helper-revision','surface-desk'),('helper-revision','surface-raised'),('focus-ring','surface-desk'),('focus-ring','surface-inverse'),('focus-ring','action-primary')]:
        print('  %s on %s %.2f'%(fg,bg,cr(res(fg),res(bg))))
    print('HOW ALIKE (deltaE: under ~8 hard to tell apart, 8-15 close), normal / red-green blind')
    g=['stage-borrador','stage-revision','stage-cliente','stage-cambios','stage-programado','stage-publicado','stage-fallo']
    for a,b in itertools.combinations(g,2):
        d=dE(res(a),res(b)); d2=dE(deut(res(a)),deut(res(b)))
        if d<16 or d2<10: print('  %s vs %s  %.1f / %.1f'%(a,b,d,d2))
    for a,b in [('surface-desk','surface-page'),('surface-page','surface-raised'),('surface-raised','surface-input'),('brand','content-danger'),('brand','brand-deep'),('brand','line-danger'),('action-primary','on-action-danger'),('helper-revision','stage-borrador'),('helper-copy','helper-numeros'),('helper-asistente','helper-numeros')]:
        print('  %s vs %s  %.1f / %.1f'%(a,b,dE(res(a),res(b)),dE(deut(res(a)),deut(res(b)))))
