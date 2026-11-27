/* Posteando: figures and icons as SVG strings. No framework, no network. */
(function () {
  'use strict';
  /* Sello's outline: n lobes on a 100 grid. Eight is the settled count. */
  function lobed(n) {
    var h = Math.PI / n, R = 36, r = R * Math.sin(h) * 1.06,
      out = R * Math.cos(h) + r - Math.sqrt(r * r - Math.pow(R * Math.sin(h), 2)), f = 43.5 / out;
    R *= f; r *= f;
    var d = '';
    for (var i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI * 2 - Math.PI / 2 + h,
        x = (50 + R * Math.cos(a)).toFixed(2), y = (50 + R * Math.sin(a)).toFixed(2);
      d += i ? 'A' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 0 1 ' + x + ' ' + y : 'M' + x + ' ' + y;
    }
    return d + 'Z';
  }
  /* d = body, y = eye line, c = eye centre (default 50), ink = colour token, dark = dark eyes on a light body */
  var shapes = {
    sello: { d: lobed(8), y: 49, ink: 'brand', hex: '#810100', role: 'Posteando (marca)' },
    globo: { d: 'M28 12H72A22 22 0 0 1 94 34V50A22 22 0 0 1 72 72H55C47 78 39 86 32 92C29 94.5 25.6 93 26 89.5L28 72A22 22 0 0 1 6 50V34A22 22 0 0 1 28 12Z', y: 42, ink: 'helper-copy', hex: '#27407A', role: 'Copy' },
    nota: { d: 'M22 8H61L92 39V78A14 14 0 0 1 78 92H22A14 14 0 0 1 8 78V22A14 14 0 0 1 22 8Z', y: 60, fold: 'M61 8V29A10 10 0 0 0 71 39H92Z', ink: 'helper-revision', hex: '#E8B62C', dark: 1, role: 'Revisión' },
    barras: { d: 'M17 56H36V43A9 9 0 0 1 45 34H64V21A9 9 0 0 1 73 12H83A9 9 0 0 1 92 21V81A9 9 0 0 1 83 90H17A9 9 0 0 1 8 81V65A9 9 0 0 1 17 56Z', y: 61, c: 61, ink: 'helper-numeros', hex: '#2C5B4C', role: 'Números' },
    domo: { d: 'M5 78A45 45 0 0 1 95 78A10 10 0 0 1 85 88H15A10 10 0 0 1 5 78Z', y: 59, ink: 'helper-asistente', hex: '#1B1717', role: 'Asistente' }
  };
  var moods = ['atento', 'pensando', 'contento', 'guino', 'dormido', 'alerta'];
  function ell(cx, cy, rx, ry) { return 'M' + (cx - rx) + ' ' + cy + 'a' + rx + ' ' + ry + ' 0 1 0 ' + (2 * rx) + ' 0a' + rx + ' ' + ry + ' 0 1 0 ' + (-2 * rx) + ' 0Z'; }
  /* figureSvg(shape, {mood, small, literal, oneInk})
     small: the cut for 24px and below (bigger dot eyes, no fold, no moods).
     literal: write hex colours instead of var(--token), for files that live outside the stylesheet.
     oneInk: a colour string; one flat shape with the eyes cut out (stamps, favicons, single-colour print). */
  function figureSvg(shape, o) {
    o = o || {};
    var s = shapes[shape], mood = o.mood || 'atento', small = !!o.small;
    var W = s.dark ? (o.literal ? '#1B1717' : 'var(--figure-eye-dark)') : (o.literal ? '#FFFDF7' : 'var(--figure-eye)');
    var body = o.literal ? s.hex : 'var(--' + s.ink + ')';
    var c = s.c || 50, y = s.y, g = small ? 11 : 9, e = '';
    var rr = small ? [7.4, 9.6] : mood === 'alerta' ? [6.2, 7.4] : [4.6, 6.2];
    if (o.oneInk) {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill-rule="evenodd" fill="' + o.oneInk + '" d="' + s.d + ell(c - g, y, rr[0], rr[1]) + ell(c + g, y, rr[0], rr[1]) + '"/></svg>';
    }
    var arc = function (x, up) { return '<path d="M' + (x - 6) + ' ' + (y + (up ? 3 : 0)) + 'Q' + x + ' ' + (y + (up ? -9 : 6)) + ' ' + (x + 6) + ' ' + (y + (up ? 3 : 0)) + '" style="fill:none;stroke:' + W + ';stroke-width:4.2;stroke-linecap:round"/>'; };
    var dot = function (x, dx, dy) { return '<g class="eye"><ellipse cx="' + (x + (dx || 0)) + '" cy="' + (y + (dy || 0)) + '" rx="' + rr[0] + '" ry="' + rr[1] + '" style="fill:' + W + '"/></g>'; };
    if (small || mood === 'atento' || mood === 'alerta') e = dot(c - g) + dot(c + g);
    else if (mood === 'pensando') e = dot(c - g, 2.6, -3.4) + dot(c + g, 2.6, -3.4);
    else if (mood === 'contento') e = arc(c - 9.5, 1) + arc(c + 9.5, 1);
    else if (mood === 'dormido') e = arc(c - 9.5, 0) + arc(c + 9.5, 0);
    else if (mood === 'guino') e = dot(c - g) + arc(c + g, 1);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="' + s.d + '" style="fill:' + body + '"/>' +
      (s.fold && !small ? '<path d="' + s.fold + '" style="fill:' + W + ';opacity:.26"/>' : '') + e + '</svg>';
  }
  /* figure(): the same drawing wrapped in the .fig box the stylesheet sizes. size in px; 24 and below takes the small cut. */
  function figure(shape, o) {
    o = o || {};
    var size = o.size || 40, small = o.small != null ? o.small : size <= 24;
    return '<span class="fig' + (o.className ? ' ' + o.className : '') + '" style="width:' + size + 'px" aria-hidden="true">' +
      figureSvg(shape, { mood: o.mood, small: small, literal: o.literal }) + '</span>';
  }
  /* Blink: one figure at a time, at uneven intervals. Call once per page. */
  function blink(root) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    (function tick() {
      setTimeout(function () {
        var all = (root || document).querySelectorAll('.fig'), f = all[Math.floor(Math.random() * all.length)];
        if (f) { f.classList.add('is-blink'); setTimeout(function () { f.classList.remove('is-blink'); }, 130); }
        tick();
      }, 2200 + Math.random() * 3600);
    })();
  }
  /* App icons: 16 grid, 1.6 stroke, round caps, currentColor. */
  var S = ' fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  var icons = {
    inicio: '<path d="M3 8l5-5 5 5v5H3z"' + S + '/>',
    calendario: '<rect x="2.5" y="3.5" width="11" height="10" rx="2"' + S + '/><path d="M2.5 7h11M5.5 2v3M10.5 2v3"' + S + '/>',
    posts: '<path d="M2.5 4h11M2.5 8h11M2.5 12h11"' + S + '/>',
    biblioteca: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"' + S + '/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"' + S + '/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"' + S + '/><rect x="9" y="9" width="4.5" height="4.5" rx="1"' + S + '/>',
    numeros: '<path d="M3 13V9M8 13V3M13 13V6"' + S + '/>',
    marcas: '<path d="M2.5 3.5h5l6 6-4.5 4.5-6-6z"' + S + '/><circle cx="5.6" cy="6.6" r="1" fill="currentColor"/>',
    chat: '<path d="M3 3.5h10v7H7.5L4.5 13v-2.5H3z"' + S + '/>',
    buscar: '<circle cx="7" cy="7" r="4.5"' + S + '/><path d="M10.5 10.5L14 14"' + S + '/>'
  };
  /* Stage marks: 12 grid, 1.5 stroke. A second cue beside the stage colour on calendar slips. */
  var M = ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  var stageMarks = {
    idea: '<circle cx="6" cy="6" r="4" stroke-dasharray="1.6 2.2"' + M + '/>',
    borrador: '<circle cx="6" cy="6" r="4"' + M + '/><path d="M6 2a4 4 0 0 1 0 8z" fill="currentColor"/>',
    revision: '<circle cx="6" cy="6" r="4"' + M + '/><circle cx="6" cy="6" r="1.4" fill="currentColor"/>',
    cliente: '<path d="M2 6h8M7 3l3 3-3 3"' + M + '/>',
    cambios: '<path d="M10 9V7a2 2 0 0 0-2-2H2M4.5 2.5L2 5l2.5 2.5"' + M + '/>',
    programado: '<circle cx="6" cy="6" r="4"' + M + '/><path d="M6 3.8V6l1.6 1"' + M + '/>',
    publicado: '<path d="M2.5 6.5l2.5 2.5 4.5-5.5"' + M + '/>',
    fallo: '<path d="M6 2.5v4.5"' + M + '/><circle cx="6" cy="9.6" r=".9" fill="currentColor"/>'
  };
  function stageMark(stage) { return '<svg class="stage-mark" viewBox="0 0 12 12" aria-hidden="true">' + stageMarks[stage] + '</svg>'; }
  function icon(name) { return '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true">' + icons[name] + '</svg>'; }
  window.Posteando = { shapes: shapes, moods: moods, lobed: lobed, figureSvg: figureSvg, figure: figure, blink: blink, icons: icons, icon: icon, stageMarks: stageMarks, stageMark: stageMark };
})();
