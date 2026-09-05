# features/editor/

The code editing half of the dry run screen. Built in Phase 1.

| File                  | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `CodeEditor.jsx`      | The editor itself — a thin wrapper around CodeMirror       |
| `EditorToolbar.jsx`   | Language buttons, Reset, and the Dry Run button            |
| `LanguagePicker.jsx`  | The row of language buttons                                |
| `useCodeDraft.js`     | Holds your code and saves it to your browser automatically |
| `languages.js`        | Which languages exist, and which can be dry run yet        |
| `templates.js`        | Starter code for each language                             |
| `editor-languages.js` | Syntax highlighting grammar for each language              |
| `editor-themes.js`    | Makes the editor use our colours                           |

## Why CodeMirror and not Monaco

Monaco is the editor from VS Code, and it was the first thing built here. It
was replaced after measuring it: **980 KB compressed**, versus a small fraction
of that for CodeMirror. On a slow phone connection that is the difference
between the editor appearing in about a second and appearing in half a minute.

CodeMirror still gives line numbers, syntax highlighting for all four
languages, bracket matching and auto-closing, autocomplete, search, and undo.
It is also easier to draw our own decorations on — which is exactly what
Phase 3 needs, to highlight the line currently being executed.

## Two things that are easy to get wrong

**The colours in `editor-themes.js` are hand-copied hex.** The editor cannot
read CSS variables. Change a colour in `src/styles/theme.css` and you have to
change it there too.

**Grammars are built once, at the top of `editor-languages.js`.** Building one
inside a component would make CodeMirror rebuild the whole document on every
render, throwing away your cursor position and undo history. If you add a
language, follow the existing pattern exactly.

## What Phase 2 adds here

Nothing, really — the toolbar's Dry Run button gets wired to the engine in
`features/dry-run/`, and that is the only edit this folder should need.
