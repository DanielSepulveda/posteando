# Figure

Five flat figures with two dot eyes. Each stands for something, so a figure is never decoration.

| Figure | Stands for | Ink |
| --- | --- | --- |
| Sello (seal, eight lobes) | Posteando itself: logo, app icon | `brand` |
| Globo (speech bubble) | the Copy helper | `helper-copy` |
| Nota (folded note) | the Revisión helper | `helper-revision`, noir eyes |
| Barras (rising bars) | the Números helper | `helper-numeros` |
| Domo (rising dome) | the assistant | `helper-asistente` |

- Draw them with `Posteando.figure(shape, {mood, size})` from `components/bundle.js`, or use the files in Logos and Figuras.
- Eyes only: no mouths, arms or props. Six expressions: atento (default), pensando (working), contento (done, approved), guiño (a tip), dormido (empty state), alerta (needs you).
- At 24px and below use the small cut: bigger eyes, no fold, no expression. `figure()` does this for you.
- One ink per figure and the eyes in `surface-raised` (noir on Nota). In one colour, the eyes are cut out.
- One figure blinks at a time, at uneven intervals (`Posteando.blink()`), and only the figure nearest the pointer glances at it. Under reduced motion they hold still.
- Dose: freely on the website; in the app one figure per view at most outside chats, at the edges of things; one moment in the client portal; a static image in email; none in errors or billing.
- The helpers' nicknames (Lety, Checo, Conta, Compa) are working names. Refer to helpers by what they do (Copy, Revisión, Números) in anything hard to change.
