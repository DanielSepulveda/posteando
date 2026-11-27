# Button

The lift-and-press button: a noir slot that never moves and a face that lifts off it on hover and presses back flush on click. Markup is always `<button class="btn"><span>Label</span></button>` (or an `<a>`); the inner span is the face.

- **Primary** (cherry face): one per view, for the thing the view is for. `btn`.
- **Ghost** (white to cream face): every other real action. `btn ghost`.
- **Danger** (`action-danger` face, `content-danger` line and label): only the button that confirms something that cannot be undone, such as deleting a brand or disconnecting an account. `btn danger`. The button that opens the confirmation is a ghost or a menu item; cherry is never used for danger, and there is no warning or success button: those are states, shown with pills and words.
- App sizes: `xs` (rows, cards), default, `lg`. Website sizes live under `.site`: `sm`, default, `lg`, with a slightly longer lift.
- Radius is about 36% of the height at every size: use the `radius-btn-*` tokens, never a pill.
- The slot does not move, so the hit area never shifts and hover cannot flicker. Do not animate the outer element.
- Label: a verb first, sentence case, two or three words. "Programar", "Enviar al cliente", "Empieza gratis".
- Filters, toggles and view switches are not buttons: use Tool.
