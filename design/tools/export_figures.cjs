// Writes the logo and helper figure SVGs from components/bundle.js, the single source of the shapes.
// Run from the repo root: node design/tools/export_figures.cjs
const fs = require('fs'), path = require('path');
global.window = {};
require(path.join(__dirname, '../components/bundle.js'));
const Po = window.Posteando, A = path.join(__dirname, '../assets');
const w = (p, s) => fs.writeFileSync(path.join(A, p), s + '\n');
w('logos/sello.svg', Po.figureSvg('sello', { literal: true }));
w('logos/sello-chico.svg', Po.figureSvg('sello', { literal: true, small: true }));
w('logos/sello-una-tinta-cherry.svg', Po.figureSvg('sello', { oneInk: Po.shapes.sello.hex }));
w('logos/sello-una-tinta-noir.svg', Po.figureSvg('sello', { oneInk: '#1B1717' }));
for (const s of ['globo', 'nota', 'barras', 'domo']) {
  w(`figures/${s}.svg`, Po.figureSvg(s, { literal: true }));
  w(`figures/${s}-chico.svg`, Po.figureSvg(s, { literal: true, small: true }));
}
console.log('figures written');
