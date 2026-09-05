# features/

Each folder here is one self-contained part of the app. A feature owns its
components, its state and its logic, and exposes only what other parts need.

These folders are empty on purpose — they are the build plan, made visible.

| Folder        | What it will hold                                          | Phase |
| ------------- | ---------------------------------------------------------- | ----- |
| `editor/`     | Monaco code editor, language picker, starter templates     | 1     |
| `dry-run/`    | The engine: turns code into a list of steps, safely        | 2     |
| `visualizer/` | Variables, call stack, arrays, linked lists, trees, graphs | 3–4   |
| `whiteboard/` | The Excalidraw canvas and DSA shape library                | 5     |
| `problems/`   | Browsing and loading problems from `src/data/problems/`    | 7     |

## The shape of a feature folder

```
features/dry-run/
├─ engines/      one folder per language, all producing the same step format
├─ sandbox/      the locked-down box that user code runs inside
├─ store/        the current run: all steps, and which one we are looking at
└─ components/   toolbar, timeline, step explanation
```

## The rule about sharing

A feature may import from `components/`, `hooks/` and `lib/`.

A feature should **not** import from another feature. If two features need the
same thing, that thing belongs in `lib/` or `components/`.
