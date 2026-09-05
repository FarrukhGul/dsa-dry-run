# features/visualizer/

Draws the structures your code is holding, instead of printing them.

An array becomes a row of cells with `i` and `right` sitting underneath the
cells they point at. A linked list becomes boxes and arrows that end in `∅` or
`↻`. A tree gets laid out the way you would draw it on a whiteboard.

## Files

| File                    | What it does                                         |
| ----------------------- | ---------------------------------------------------- |
| `detectShape.js`        | Decides what a recorded value really is               |
| `findPointers.js`       | Works out which variables index into an array         |
| `StructureView.jsx`     | Switchboard: shape in, drawing out                    |
| `StructuresPanel.jsx`   | Draws every structure in the current function         |
| `views/ArrayView.jsx`   | Cells, indices, and pointers underneath               |
| `views/MatrixView.jsx`  | An array of arrays as a grid                          |
| `views/LinkedListView.jsx` | Boxes and arrows, following `next`                |
| `views/TreeView.jsx`    | An SVG tree layout                                    |
| `views/KeyValueView.jsx`| Maps, sets and plain objects as rows                  |

## The two guesses this makes

Both are heuristics. Both are worth understanding, because a picture that is
confidently wrong is worse than no picture.

**What a value is.** `{ value, next }` is read as a linked list;
`{ value, left, right }` or anything with `children` is read as a tree. A field
named `next` that means "next appointment" will be drawn as a chain. The label
beside the variable name always says how we read it, so a wrong guess is
visible rather than mysterious.

**Which variables are pointers.** A variable is drawn on an array cell only
when its name is one people genuinely use for an index — `i`, `left`, `mid`,
`slow`, and the rest of the list in `findPointers.js` — *and* its value lands
inside the array.

The name check is the important half. Without it `sum = 3` would be drawn as a
pointer at cell 3. So `n`, `len`, `size`, `count` and `total` are deliberately
excluded: they are lengths, not positions. The cost is that an index named
something unusual is missed, which is the safer way to be wrong.

## Depth

The engine caps how far it walks into a value: 12 levels deep, and 300 objects
per variable (`engines/shared/limits.js`). A chain or tree bigger than that is
recorded as far as the budget allows and then marked `…`, which these views
draw as a faded node rather than pretending the structure ends there.

## Dependencies

This feature imports only from `lib/` and `components/ui/`. It never imports
from `features/dry-run/`, even though it draws dry-run data — the edge runs the
other way, with `DryRunPanel` composing `StructuresPanel`.
