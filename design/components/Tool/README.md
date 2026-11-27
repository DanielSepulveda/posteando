# Tool

Flat, outlined controls for the top bar and filter bar: `tool` (filters, sort, group), `seg` (two or three views of the same thing) and `icon-btn` (30px square: close, previous, next).

- They do not lift. Only Button lifts, so the primary action stays the one physical thing in the bar.
- Hover is `surface-raised-hover`. On is `surface-inverse` with white text (`tool on` or `aria-pressed="true"`), never a pastel and never cherry.
- An active filter shows its value and a "×" to clear it: "Marca: Tacos Don Beto ×".
- Every `icon-btn` needs an `aria-label`.
