# Design principles and voice

> Status: agreed (distilled from the landing mock Daniel approved on 2026-11-26; figures decided 2026-11-26; the design system built from these is v1). Where this file and [README.md](README.md) differ on a value, the README and `tokens/tokens.json` win.

## The idea

**Posteando is a desk, not a dashboard.** It looks and behaves like the work table of a small studio that makes things for people it knows by name: paper, ink, a stamp, a roll of tape, a receipt. And somebody lives on that desk.

Most software in this space looks like a control panel, because it was designed around the system. Ours is designed around the people doing the work and the things they already handle every day: the month's calendar, the client's yes, the report.

That gives every design decision one question to answer: **would this exist on the desk?** A stamp would. A glass card with a glow would not.

These principles describe ideas, not implementation, so they hold for the app, the client portal, WhatsApp and email.

## Principles

1. **A world, not a style.** Everything comes from one place: the papelería desk. Grid paper, tape, stamps, receipts and notes are not decoration, they are the vocabulary. A new screen starts by asking which object from the desk it is, not which component to reuse.
2. **Ink on paper.** The ground is cotton paper. Cherry red is ink: it writes, marks and stamps, and it sits on the one thing you should press. It never fills big areas. Pastels are highlighters, used to tell things apart (a state), never to decorate.
3. **Objects are honest.** Things have an edge, a weight and a hard shadow, like paper cut-outs on a table. No blur, no glass, no glow, no gradients as atmosphere. This is our share of brutalism: plain construction you can see, kept gentle by round corners and round type.
4. **Things respond like things.** A button lifts and presses back down. A stamp lands with a small thump. The movement is short and physical, and it always ends where the object started. Nothing floats, bounces for fun, or animates only to be noticed.
5. **A hand was here.** One mark per view looks made by a person with a marker: a circle, an underline, an arrow, a squiggle, a slight tilt. The mark serves the content, so it never crosses the words it points at. If you remove it and nothing is lost, it should not have been there.
6. **Somebody lives here.** The figures are the inhabitants of the desk, and they are the ones who help with the work. They are flat shapes with a pair of eyes and nothing else. They sit at the edges of things, watch, and react when something matters.
7. **One moment per screen.** Delight is spent where the work has meaning: a client approved, a post went out, the month is done. Everywhere else the product is calm and quick. If every action celebrates, it reads as childish and the real moments stop counting.
8. **The work is the illustration.** We show the real things: a calendar with posts on it, a chat with a client, a receipt with real numbers. No abstract illustrations or stock scenes. If a picture could belong to any product, it is not ours.
9. **Two voices in type, and quiet around the loud.** The round sans (Allo) does the talking. A soft italic serif (Fraunces) gives the emphasis, one word per headline, the way you would stress a word out loud. Each view has one loud thing (a headline, a stamp, a figure) and everything around it stays quiet.

## Voice

**We sound like the friend at the agency who is very good at this and does not make a big deal of it.** Always tú, in everyday Mexican Spanish, a bit sassy and fun, and never cringy.

- **Say the useful thing first.** The wink comes after the information, never instead of it.
- **Use the words people actually say.** Jalón, chamba, corretear, truena, nomás. They go where a friend would use them, not sprinkled to sound local.
- **A wink, not a joke.** The humour is a small turn at the end of a sentence. Never a pun that needs a drum roll, never an emoji doing the work.
- **One wink per section, at most.** Most sentences are simply clear. The dry ones make the fun ones land.
- **Say what we do.** Describe what the product does and what you get. Do not spend words on what we are not or what we refuse. (Scoped AI is a product rule, never a marketing line.)
- **Be specific.** Real names, real hours, real numbers. "Sale el martes a la 1:00 pm" beats "se publicará pronto".
- **We laugh with the user about the work, never at the user or at their client.**
- **Get serious when it matters.** A failed post, money and anything about a client's data are stated plainly, with what happened and what to do. No wink there.

Positioning: power-ups so a small agency works like a big one, without excluding big agencies. Never market as "para agencias chiquitas".

### Lines that set the tone

The first two are the ones Daniel picked as exactly right.

| Line | Why it works |
| --- | --- |
| Aprueba el mes de un jalón o post por post. | "De un jalón" is how people say it, and it carries the feature (bulk approval) by itself. |
| Las ideas a medias también caben, nadie las juzga. | Useful fact first, then one sassy turn. It is on the user's side. |
| ...aprobado y posteado sin corretear a nadie. | Names the real pain (chasing approvals) in the user's own word. |
| Si algo truena, te enteras tú antes que tu cliente. | A serious promise said the way a colleague would say it. |
| Para que una agencia de tres rinda como una de diez. | The positioning in one concrete image. |
| Factura sin drama. | Short, and it knows what the drama is. |
| Hecho en México con mucho café y cero juntas. | A footer can relax a little more than a button can. |

### Ours and not ours

| Ours | Not ours | What went wrong |
| --- | --- | --- |
| Listo. Tu cliente dijo que sí. | ¡¡Felicidades!! ¡Tu post fue aprobado! 🎉🎉 | Shouting and emoji in place of warmth. |
| No pudimos publicar en TikTok. Vuelve a conectar la cuenta y lo reintentamos. | Ups, algo salió mal, jeje. | A joke where the user needs facts. |
| Sube lo que ya diseñaste, ponle fecha y cuentas. | Optimice su flujo de trabajo de contenidos. | Usted, and enterprise words nobody says. |
| Entre más marcas, más barata sale cada una. | Qué onda, crack, ¿listo para romperla? | Trying too hard. This is the cringe line. |

### Where the voice gets quieter

The landing page carries the most personality. Inside the app, buttons and labels are plain ("Aprobar", "Programar"), and the voice shows up in empty states, confirmations and the helpers. Messages a client receives are the politest version: still tú and warm, but with no slang the agency would not use with that client. "Tu mes" leads; "parrilla" is an insider wink, used sparingly.

## The figures

**The figures are the residents of the desk, and each one has a job.** They replace a mascot: there is no single hero, there is a small crew.

| Figure | Shape | Stands for | Ink |
| --- | --- | --- | --- |
| Sello | A seal with eight lobes, the mark of approval | The brand: logo, app icon, system voice | Cherry |
| Globo | A speech bubble | Copy (agent key `copywriter`, working name Lety) | Azul tinta #27407A |
| Nota | A note with a folded corner | Revisión (agent key `reviewer`, working name Checo) | Amarillo #E8B62C, dark eyes |
| Barras | Three rising bars | Números (analyst, working name Conta) | Verde botella #2C5B4C |
| Domo | A sun rising over the desk | The general assistant, when it arrives (working name Compa) | Noir |

- **Shapes come from our world.** Not animals, not robots, not generic blobs.
- **Eyes only, "Puntos" style:** two plain dots. Feeling comes from dots, arcs and dashes alone. No mouths, arms or props.
- **Six expressions:** atento, pensando, contento, guiño, dormido, alerta. Each is tied to a product state.
- **One flat colour each.** The base palette stays quiet and the helpers carry the brighter colour. Helper inks are only for the figures, never for UI states.
- **A figure stands for something** and appears wherever that thing speaks, so people learn to recognise it.
- **They live at the edges.** Peeking over a card, sitting on a corner. Never in the middle of the work.
- **They watch more than they act.** Only the figure nearest the cursor glances at it (many watching feels like pressure). One figure blinks at a time, quickly, at uneven intervals.
- **Never cute for its own sake.** If a figure is there only to be adorable, remove it.
- **Sello is the logo.** The wordmark is live Allo type beside it. A hand-drawn star was tried and set aside.
- **Small cut** at 24px and below: dot eyes, simpler outline. One-ink versions exist for single-colour use.
- **By channel:** strongest in a chat with a helper, small doses in the app, a still image in email, profile photo only in WhatsApp, one moment in the client portal.

## Dosage by surface

**The idea is the same everywhere, and the amount changes.** The more time someone spends on a surface, the less of the personality it carries.

| Surface | Dose | What carries it |
| --- | --- | --- |
| Website and landing | Full | The whole desk: paper textures, hand marks, figures, one live moment, the most playful copy |
| App for the agency | Low | Paper ground, ink, honest objects and the buttons, all day. Figures only where a helper speaks, in empty states and at the moments. Plain labels |
| Client portal | Lowest | Calm and clear, the client's brand and content in front. One moment: the approval stamp. Polite voice |
| WhatsApp and email | Voice only | Wording does the work. Short, specific, one wink at most, none in alerts |
| MCP and assistant replies | Voice only | Same friend, same tú, plain and direct. The helper's figure where the surface can show it |
| Errors, billing, data | None | Clear facts and the next step. Brand red never means error |

## Is it ours?

Five questions to ask of any screen, message or page before it ships.

1. Could this exist on the desk, or was it borrowed from a dashboard?
2. Is red used as ink, and is there only one thing to press?
3. Is there one loud thing, with quiet around it?
4. If there is a hand mark, a figure or a wink, does it earn its place, and is there only one?
5. Read the copy out loud. Would you say it to a friend who runs an agency?

We are not elegant, serious or enterprise. We are also not childish, loud or trying to be funny. When a choice could go either way, pick the one a careful person with a sense of humour would make.
