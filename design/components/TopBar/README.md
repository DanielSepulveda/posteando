# TopBar

The top bar says what you can do in this view: a mono crumb, the view title, the view's tools, and the one primary button on the right. Under it, an optional second band holds saved-view tabs or filters.

- Fixed heights: `bar-height` for the top bar and `subbar-height` for the band under it. Sheets and side panels use the same two heights, so borders meet across panels. Never let a header grow with its content on desktop.
- The top bar's bottom edge is the ink line; the band under it ends in a `line-subtle` hairline, except tabs, which sit on an ink line.
- One `view-title` per view. One primary button per view.
- Under `bp-drawer` the bars wrap and stick to the top.
