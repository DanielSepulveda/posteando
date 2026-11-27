# Card

The plain containers of the app: the card (class `.card`), `list` with `list-row`, and `stat-tiles`.

- A card is `surface-raised` on `surface-page` with the ink line and `radius-md`. It has no shadow: in the app only things that float (popovers, toasts, a dragged slip) cast one. On the website, cards lie on the desk with `shadow-desk` and `radius-xl`, and may tilt up to 3 degrees.
- Never a coloured left border, never a gradient, never a card inside a card.
- A list row is one line: who or what, the sentence, the state, and at most one small action.
- A stat tile is a `stat` number, what it counts in plain words, and one line of context. Four across, two under `bp-drawer`.
- An insight card is the one place in a view where a helper's figure may sit beside the content.
