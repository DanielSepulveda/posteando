# Field

Text input, textarea, search box, keyboard key and checkbox.

- Anything you type into is `surface-input` with the ink line; everything else on the page is cream or card, so inputs read as the blank spots.
- Focus is the standard `focus-ring` outline, the same as every other control. No shadow, no glow.
- The label sits above, in 14px at weight 650. Help text is `caption` in `content-muted`.
- An error keeps the field white and swaps the ink line for a 2px `line-danger` one, with a message in `content-danger` that starts with "!" and says how to fix it. No jokes in errors.
- Search shows its syntax in the placeholder and the shortcut as a `kbd`.
- A checked `check` is cherry. It is the only cherry besides the primary button that may repeat in a view.
