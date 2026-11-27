# The app UI

> Status: settled (Daniel, 2026-11-27: "the app UI, design, and style direction are settled"). Brand picker placement agreed 2026-11-27; helpers in chat decided 2026-11-27. The settled mock is `reference/app-mock.html` (invented data, placeholder font: look and feel only). Release 1 builds only part of it, see docs/release-plan.md.

The app is the same brand as the website at a lower dose, with its own guidelines.

## Shared with the website

- The palette, the type (Allo, one italic serif word on the website only, mono for labels and numbers), the 1.5px ink outline and the hard shadow.
- The buttons that lift and press, and the figures with their eyes.
- The voice: friendly, tú, short, with a light wink only where nothing is at stake.

## Specific to the app

- **Function first.** Every screen answers "what do I do next?" before it tries to charm. If a touch of character slows a task down, it goes.
- **Colour means state, never brand or decoration.** The pastels only mark a post's stage. Brands are plain noir monograms.
- **Neutral means neutral.** Hover, focus and selection use cotton and an ink outline, never a pastel or yellow, so nothing reads as a warning by accident (this is why the ⌘K highlight is neutral).
- **One cherry button per view**, for the main action of that view.
- **Lines line up.** The top bar and every panel header are exactly `bar-height` (68px); the band under them is exactly `subbar-height` (46px). The border of a panel continues the border of the page behind it. Daniel cares about this a lot.
- **The sidebar says where you are; the top bar says what you can do here.**
- **Brand picker** at the top of the sidebar, under the logo: a searchable switcher, "Todas las marcas" by default, that applies to the whole app. A "Marcas" directory page stays in the nav. Filters that belong to one view (stage, network) live with that view.
- **Sidebar footer:** a usage card above the user row with its menu.
- **Every list can be searched, filtered and sorted**, and the keyboard reaches everything (⌘K palette, / to search, Esc to close).
- **Numbers** are set in mono with tabular figures and are never rounded for looks.
- **One touch of character per view at most:** a hand-drawn mark, a stamp, or a figure. Figures appear only where a helper speaks or where a screen is empty.
- **The voice lives in small copy** (empty states, confirmations, hints), never in errors, billing or anything read under stress.
- **Density over air.** Rows are compact; whitespace groups, it does not impress.
- **Network logos** are the networks' official files under their brand rules. The glyphs in the mocks are stand-ins.

## Stage pills

On screen in Spanish, with a pastel highlighter and a stage mark (`Posteando.stageMark(stage)`) so colour is never the only cue:

| Stage | Fill | Note |
| --- | --- | --- |
| Idea | Dashed outline, no fill | Not real yet |
| Borrador | Butter | |
| Revisión | Lavender | Internal review |
| Con el cliente | Sky | Waiting on customer approval |
| Cambios | Blush | Changes requested |
| Programado | Sage | Scheduled |
| Falló | Tangerine (`surface-danger`) with "!" | Never cherry |
| Sin confirmar | Cream, dashed tangerine line, "?" | **Proposed, not agreed** (outcome unknown) |

Agency stages are data, so these defaults can be renamed; the fixed engine states keep their meaning.

## Smaller screens

- Wide (1100px and up): full sidebar, collapsible to an icon rail by hand.
- Medium (760 to 1100px): the sidebar becomes the icon rail on its own, tables scroll sideways inside their frame, side panels narrow.
- Phone (under 760px): the sidebar is a drawer behind a menu button, the week becomes a list of days, the post panel takes the whole screen.
- Today in the calendar is a cherry border around the whole day plus a filled date chip, not a hand-drawn mark. In the app, attention comes from structure first.

## Helpers in the app

- People talk to the helpers directly. The general assistant can come later as a front door that delegates.
- **One helper per chat.** A chat is about one topic and belongs to one helper. Other helpers are never pulled into it.
- **Chats are private for now.** Shared chats are parked: no share button, no private/shared switch.
- A post shows all the helpers' work on it together, so the post is where their work meets.
- The sidebar lists a few chats under the helpers: still working first (animated dots), then waiting on you (cherry dot), then recent, with "Ver los N chats". It is a status list, not a history. The collapsed rail shows a cherry dot on Chats.
- A "Chats" screen lists threads with a helper filter and a new-chat picker; chats can be tied to a post.

## Screens in the mock, and when they ship

| Screen | Release |
| --- | --- |
| App shell (sidebar, brand picker, top bar) | 1 |
| Calendar (week with drag to reschedule, month) | 1 |
| Post sheet (stage stepper, publications per account, approval record with the APROBADO stamp, history) | 1 |
| Upload and connect | 1 |
| Approval page for the client (phone first) | 1 |
| Chat with the copywriter | 1 |
| Inicio (start page and command centre) | 2 to 4 |
| Posts table (saved views, search syntax, filters, group by, bulk bar) | 2 to 4 |
| Command palette (⌘K) | 2 to 4 |
| Marcas directory | 2 to 4 |
