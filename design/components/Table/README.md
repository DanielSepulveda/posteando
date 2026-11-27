# Table

The posts table: dense, sortable, groupable, with bulk selection. The real work is the illustration, so the table carries no ornament.

- Header cells are `label` (mono, uppercase, muted) on `surface-page`, sticky, with the ink line under them. The sorted column turns noir and shows its arrow.
- Rows are 48px with a thumbnail, 7px cell padding and a `line-subtle` hairline. Hover is `surface-raised`; selected is `surface-desk`. Neither is a pastel.
- The first and last cells keep the view's 20px side padding, so table edges line up with the top bar.
- Numbers, dates and times are `num` (mono, tabular) and right-aligned when they are quantities. An empty value is "—".
- Group rows are `surface-desk` between two ink lines, with the count in mono.
- Clicking a row opens the Sheet; the checkbox selects it for the bulk bar.
- Empty result: Sello asleep, "Nada por aquí.", one ghost button to clear filters.
