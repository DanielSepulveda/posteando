# Posteando design system

> Status: v1, agreed by Daniel on 2026-11-27 ("all of it looks fine to me"). One open item: the "Sin confirmar" pill for the outcome unknown publish state is proposed, not agreed (settle in release 1). Helper nicknames are working names. Network glyphs in previews are stand-ins.

Folder map: `tokens/` (values and the generated CSS), `components/` (21 components as plain HTML and CSS, plus `bundle.css` and `bundle.js`), `fonts/`, `assets/logos/` (Sello), `assets/figures/` (helper figures, full and small cut), `reference/` (mocks), `tools/` (token build, figure export, contrast audit). The principles behind all of this are in [principles-and-voice.md](principles-and-voice.md); app-specific rules are in [app-ui.md](app-ui.md).

Posteando is where an agency plans the month, the client says yes from a link, and everything publishes itself. The interface is **a desk, not a dashboard**: a papelería desk with paper, ink, highlighters, a rubber stamp and a few small figures who work there. Before adding anything, ask whether it would exist on that desk.

Product copy is Mexican Spanish with tú. Everything below is a rule for building with this system; names in `code` are tokens, type styles or classes.

## Two surfaces, one brand

The website and the app share every token, the fonts, the buttons and the figures. They differ in dose.

| | Website (Astro) | App | Client portal | Email, WhatsApp, MCP |
| --- | --- | --- | --- | --- |
| Dose | Full | Low | Lowest | Voice only |
| Ground | `surface-desk`, cuadrícula `paper` | `surface-page` work area, `surface-desk` sidebar | `surface-desk` | n/a |
| Type | `display`, `headline`, `title`, `lede`, `body-site` | `view-title`, `sheet-title`, `heading`, `body`, `small`, `caption` | app styles at 16px | plain text |
| Cards | `radius-xl`, `shadow-desk`, may tilt 1 to 3 degrees | `radius-md`, no shadow, never tilted | `radius-2xl`, `shadow-pop` | n/a |
| Figures | Freely, at the edges of objects | One per view outside chats | One moment (after approving) | A static image at most |
| Serif accent, hand-drawn marks, tape | Yes, one of each per view | No | First screen only | No |
| Buttons | `.site` sizes | app sizes | app `lg` | n/a |

Wrap website pages in `.site` to get website sizes from the same component classes. Errors and billing carry no figures, no jokes and no ornament on any surface.

## Voice

- Speak like the sharp colleague at the next desk: short, warm, a little dry. "Lunes sin pastor no es lunes." "¿Qué, posteamos?" "Pagas por marca activa. Punto."
- Use tú. Never usted, never vosotros. Mexican words are welcome when an agency would say them ("ni de chiste", "se vale"); do not force slang.
- Say what the product does, never what it does not. No comparisons that name a limit ("no es un editor"), no "para agencias chiquitas": the promise is that a team of three works like a team of ten.
- Buttons are a verb first, sentence case: "Programar", "Enviar al cliente", "Pedir cambio", "Empieza gratis".
- Confirmations say what happened and may smile: "Aprobado. Queda anotado que lo aprobaste tú." "Ese día ya pasó. Ni nosotros podemos con eso."
- Errors are plain and say how to fix it: "TikTok rechazó el audio. Cámbialo y reintenta." No humour, no blame.
- Empty states are one line and one action: "Nada por aquí." with "Quitar filtros".
- Sentence case everywhere. Uppercase only in the mono `label` style and on the stamp.
- No emoji in the interface. Numbers use Mexican format (12,480; 1:30 pm; 26 nov).
- "Tu mes" leads; "parrilla" is an insider word used sparingly.
- Helpers are named for what they do (Copy, Revisión, Números). Their nicknames (Lety, Checo, Conta, Compa) are working names: keep them out of anything hard to change.

## Colour

Ink on paper. Noir ink draws and writes everything; cotton, cream and card are the paper; cherry is the brand's ink; the five pastels are highlighters.

Tokens come in two layers, and the layer you use is a rule:

- **Primitives** are raw values with no meaning, named for what they are: `paper-*`, `ink-*`, `marker-*`, `signal-*`, `alpha-*`. `ink-cherry` is #810100 and says nothing about where it goes. Never use a primitive in a component, a page or a style.
- **Semantic tokens** are roles that point at a primitive, and they are the only colours code may use: `surface-*` (what things are made of), `content-*` (text and icons), `line-*` (the ink line and hairlines), `action-*` with `on-action-*` (button faces and their labels), `brand`, `focus-ring`, `stage-*`, `helper-*`.
- If no role fits, add a role first. Do not reach down to a primitive, and never write a hex value.
- Pick by role, not by look. `brand`, `content-brand`, `action-primary` and `focus-ring` are all cherry today; they are separate so each can change alone.

How the roles are used:

- Surfaces, from the desk up: `surface-desk`, `surface-page`, `surface-raised`, and `surface-input` only where you type. `surface-inverse` is the dark fill, with `content-inverse` on it.
- Text is `content`; secondary text is `content-muted`. Both pass on every paper surface and every stage fill.
- `brand` is ink, not paint: Sello, today, unread dots, a checked box, hand-drawn marks. `action-primary` is the one primary button in a view. Neither is ever a large fill or a background.
- In the app, colour means state and nothing else. The highlighters belong to stages (`stage-borrador`, `stage-revision`, `stage-cliente`, `stage-cambios`, `stage-programado`); brands and people are never colour-coded.
- Hover and selection are neutral: `surface-hover`, `surface-raised-hover`, or `surface-selected` with a `line` outline. A highlighter or yellow hover reads as a warning and is wrong.
- Colour is never the only cue. Every stage fill comes with its word, a legend, or an accessible name, because blush and sage, and lavender and sky, look alike to people with red-green colour blindness.
- Focus is `focus-ring` on paper and `focus-ring-inverse` on `surface-inverse`.
- Failure is `surface-danger` with `line-danger`, words in `content-danger` and "!". Cherry never means error. There are no info, success or warning colours: the stages already say where things stand, and approval is the stamp.
- `helper-copy`, `helper-revision` and `helper-numeros` belong to the helpers' figures. Do not use them for UI states or decoration.
- One theme, by decision: the brand is ink on cotton and there is no dark mode. Because code only names roles, a theme could be added later by pointing the roles at other primitives, without touching a component.

## Type

- **Allo** (`font-sans`) talks: all headings, body and controls. It is a variable font with a roundness axis: set `font-variation-settings: "ROND" 50` for body and `"ROND" 100` for headings and big numbers. The stamp alone uses 20.
- **Fraunces italic** (`font-serif`, soft 100, wonk 1) is the `accent`: one word in a heading, in `content-brand`. Website and the portal's first screen only.
- **DM Mono** (`font-mono`) is for `label` (uppercase, tracked, `content-muted`) and `num` (tabular numbers, times, dates).
- Allo runs from weight 100 to 900 and its regular is 400. Body is 400. App headings are 680 to 720, website headings 760, controls and labels 550 to 650, and emphasis inside text is 620, never italic or colour. Only the wordmark (850) and the stamp (900) go heavier.
- Headings take tight tracking (-0.02em to -0.045em, tighter as they grow). Running text is at most about 65 characters wide.
- Website headings are fluid: `display` is clamp(41px, 6.1vw, 75px), `headline` is clamp(31px, 4.2vw, 50px).
- App base is 15px; the floor for running text is 13px (`caption`) and for mono labels 11px.
- One loud thing per view: a `display`, a `stat` number or the stamp. Not two.
- All three families are open-licensed (SIL OFL) and ship in `fonts/` as Latin subsets (licences in `fonts/LICENSES.md`). Self-host them; do not call a font CDN.

## Line, shape and shadow

- Every object is drawn with one ink line: `line-width` (1.5px) solid `line`. Dividers inside an object are a 1px `line-subtle`. Dashed means "not real yet": an idea, or a result not confirmed.
- Shadows are hard offsets in ink (`shadow-nav`, `shadow-pop`, `shadow-modal`, `shadow-desk`), never blurred. In the app only things that float cast one. No glass, no glow, no blur, no gradients except the two-stop button face.
- Corners are generous and consistent by kind: `radius-sm` for controls, `radius-md` for cards and inputs, `radius-lg` for bubbles and the palette, `radius-pill` for pills. Buttons use the `radius-btn-*` tokens (about 36% of their height).
- Spacing comes from the `space-*` steps. The app is dense: 20px view padding, 14px card padding, 8px between controls. The website breathes: 72px and 84px around sections, 56px between columns.

## Motion

Things respond like things, and motion is there to explain, never to decorate. A button face lifts off its slot on hover (`dur-lift`) and presses back flush (`dur-press`). A slip lifts when picked up. The stamp lands once with a small overshoot (`dur-stamp`, `ease-stamp`). Sheets slide in (`dur-slide`, `ease-slide`). Figures blink one at a time. Nothing loops for attention, nothing fades in on scroll, and everything holds still under `prefers-reduced-motion`.

- Things that enter use ease-out and take under 300ms. Never ease-in for an entrance.
- Animate only `transform` and `opacity`, and list the properties: no `transition: all`.
- A popover grows from the control that opened it; a dialog from the centre.
- Anything opened from the keyboard many times a day (the command palette, shortcuts, tab switches) appears at once, with no animation.
- No delay on tooltips after the first one in a group.

## App layout

- The sidebar says where you are; the top bar says what you can do here. The brand picker is at the top of the sidebar and filters the whole app.
- Lines line up. The top bar and every panel header are exactly `bar-height`; the band under them is exactly `subbar-height`. A border that starts in one panel continues in the next.
- One primary button per view. One touch of character per view (a figure, the stamp, or one line of copy with a smile). Function first; density over air.
- Breakpoints: full sidebar from `bp-rail` up; icon rail between `bp-drawer` and `bp-rail`; under `bp-drawer` the sidebar is a drawer, bars wrap, the week becomes a list and the sheet is full screen.
- Focus is always visible: a solid `focus-ring` outline, `focus-width`, 2px offset, the same on buttons, inputs and rows. Inputs get no shadow on focus. Everything works from the keyboard; ⌘K opens the command palette.

## Figures and iconography

- The five figures are the brand's characters and each stands for one thing: Sello is Posteando, Globo is Copy, Nota is Revisión, Barras is Números, Domo is the assistant. See the Figure component for inks, expressions and the small cut, and `assets/logos/` and `assets/figures/` for files.
- Sello is the logo. The wordmark is live type in Allo beside it; there is no separate wordmark file.
- Icons are a small line set from `Posteando.icon()` (16 grid, 1.6 stroke, `currentColor`), used only for navigation and search. Actions are words.
- Network marks in the previews are drawn stand-ins. Use each network's official logo files under its own brand rules.
- Thumbnails of client media sit in a 7px-radius frame with the ink line; the client's content is the illustration, so nothing decorates it.

## Using the files

- `tokens/tokens.json` holds every value. `tokens/tokens.css` is generated from it (`python3 tools/build_tokens.py`) and declares the fonts, one CSS variable per token and one class per type style. Never edit `tokens.css` by hand.
- `components/bundle.css` holds the component classes and reads only tokens. `components/bundle.js` sets `window.Posteando` with `figure()`, `figureSvg()`, `icon()`, `blink()` and `stageMark()`; it has no dependencies. In the React app, port these into components that render the same markup and classes; keep `bundle.js` as the reference for the figure geometry.
- Each folder in `components/` has a README (when to use it, its markup, its states) and a `preview.html` you can open in a browser.
- `reference/` holds the settled mocks (landing, app, figure sheet) for look and feel only. Their data is invented and their font is a placeholder; never copy code or copy text from them into the product.
- Components are plain HTML and CSS classes with no framework inside, so the Astro website and the React app both wrap the same classes. Copy the markup from a component's preview and keep its structure: the button's inner `<span>` is the moving face.
- State is styled through attributes, never extra classes where an attribute exists: `aria-current`, `aria-pressed`, `aria-selected`, `aria-invalid`, `disabled`. Behaviour (focus handling, keyboard navigation, popover placement, dismissal) comes from a headless React library; this system only decides how those states look. Do not hand-roll focus traps or arrow-key logic.
- Test every screen with worst-case content: a 60-character brand name, an empty list, 12,480,000 as a count, a client who has 40 posts waiting.
- Add a new value as a token first, then use it. Do not write a hex colour, a blurred shadow or a new radius in component code. Shadows are the one place a raw colour appears inside a token, because a shadow value cannot point at another token.
