# features/whiteboard/

A hand-drawn canvas for sketching an approach before, or while, you code it.

## We run Excalidraw, we do not imitate it

Excalidraw is open source under the MIT licence, so the whiteboard is the real
thing — the same strokes, the same fonts, the same tools that
excalidraw.com uses. Rebuilding that would have taken months and been worse in
every way.

What this folder adds is small and specific:

| File                    | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `Whiteboard.jsx`        | The embed: theme, persistence, layout            |
| `WhiteboardToolbar.jsx` | The "insert a shape" strip                       |
| `dsaShapes.js`          | Array, linked list, tree and call-stack presets  |
| `sceneStorage.js`       | Saves your drawing to your own browser           |

## The three additions

**It follows the site's theme.** Excalidraw's own light/dark button is switched
off in `UI_OPTIONS`, because the header already owns that choice and two
toggles that disagree is worse than one.

**It remembers your drawing.** Saved to `localStorage`, never uploaded. Only a
handful of app-state fields are kept — scroll position, zoom, canvas settings —
because Excalidraw's live state holds things that cannot be turned into text
(a Map of collaborators, the current pointer) and saving those throws.

Saving is delayed by 600 ms. `onChange` fires on every mouse move while you
drag a shape, and writing to storage that often makes dragging stutter.

**Ready-made DSA shapes.** Drawing eight identical boxes in a row, evenly
spaced and numbered underneath, is a chore with nothing to do with
understanding an algorithm. The Insert buttons do it in one click, dropped in
the middle of wherever you are looking.

Shapes are described in Excalidraw's simple "skeleton" form and passed through
its own `convertToExcalidrawElements`, which fills in the ids, seeds and
version numbers. We never hand-write a full element.

## What it costs

Opening `/whiteboard` downloads about **345 KB compressed**. That is the real
Excalidraw, and it only loads when somebody visits this page — the route is
lazy (`routes/AppRoutes.jsx`), so the landing page is unaffected.

The build also contains roughly 4.7 MB of Mermaid diagram chunks. Excalidraw
loads that converter with a dynamic `import()`, so **none of it is downloaded**
unless somebody opens the Mermaid dialog. It costs deploy space, not load time.

## Supply chain

Excalidraw's Mermaid converter pulls a dependency chain with published
advisories — `lodash-es` code injection and `nanoid` predictable IDs. Both are
pinned to patched releases by the `overrides` block in `package.json`, and
`npm audit` reports zero vulnerabilities. Re-check that block whenever
Excalidraw is upgraded; the goal is to delete it once upstream catches up.
