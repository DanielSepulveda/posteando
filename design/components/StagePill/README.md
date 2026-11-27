# StagePill

Where a post is in its life. The pastels are highlighters over ink: colour in the app means state, never a client.

| Stage | Class | Fill |
| --- | --- | --- |
| Idea | `stage-idea` | none, dashed line |
| Borrador | `stage-borrador` | `marker-butter` |
| Revisión interna | `stage-revision` | `marker-lavender` |
| Con el cliente | `stage-cliente` | `marker-sky` |
| Cambios pedidos | `stage-cambios` | `marker-blush` |
| Programado | `stage-programado` | `marker-sage` |
| Publicado | `stage-publicado` | `surface-raised` |
| Falló | `stage-fallo` | `surface-danger`, `line-danger` line, "!" |

- Always the word, never the colour alone. Failure also carries "!".
- The same fills colour calendar slips and the stepper's current step, so a stage looks the same everywhere.
- Only scheduled, published and failed are fixed by the platform; an agency may rename or add the earlier stages, and a new stage picks one of the five highlighters.
- "Sin confirmar" (`stage-incierto`, dashed tangerine line, "?") is a proposal for a publish whose result the network never confirmed. It is not agreed yet.
