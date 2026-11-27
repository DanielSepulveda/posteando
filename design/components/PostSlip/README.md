# PostSlip

A post on the calendar: a slip of paper in its stage's highlighter, with the brand monogram, time, networks and title. The month view uses the one-line `slip-mini`.

- The fill is the stage (`stage-*` tokens). An idea is dashed with no fill; a failure adds one line in `content-danger` that says why.
- Colour is never the only cue. Every slip starts with its stage mark (`Posteando.stageMark(stage)`: a 12px ink glyph, the same one in the legend), and its accessible name and tooltip say the stage. Blush and sage, and lavender and sky, look alike to people with red-green colour blindness.
- A slip lifts on hover with `shadow-slip` and tilts 2 degrees while dragged. Dropping it on another day reschedules it.
- Today is a 2px inset cherry border with `surface-today`, and its date number is cherry. No hand-drawn circle in the app.
- Past days carry a faint diagonal hatch; a mono "now" line in cherry marks the time of day.
