/**
 * activeLineHighlight.js — draws the violet band across the line currently
 * being executed.
 *
 * This is the single detail that makes a dry run feel like a dry run: as you
 * step, the highlight walks down the code the same way your finger would.
 *
 * HOW IT WORKS, IN CODEMIRROR TERMS
 *
 * CodeMirror does not let you reach in and restyle a line. You describe what
 * you want and it works out the rest:
 *
 *   an EFFECT is a message  — "the active line is now 7"
 *   a FIELD holds the answer — it listens for that message and keeps the
 *                              current decoration
 *
 * Doing it this way, rather than rebuilding the editor's configuration each
 * time, means stepping costs almost nothing — which matters when you are
 * holding down the arrow key or watching a run play back.
 */

import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";

/**
 * The message. Send it with:
 *   view.dispatch({ effects: setActiveLine.of(7) })
 * Pass `null` to clear the highlight.
 */
export const setActiveLine = StateEffect.define();

const activeLineField = StateField.define({
  create() {
    return Decoration.none;
  },

  update(decorations, transaction) {
    // Keep the highlight attached to the right place if the text was edited.
    decorations = decorations.map(transaction.changes);

    for (const effect of transaction.effects) {
      if (!effect.is(setActiveLine)) continue;

      const lineNumber = effect.value;
      const document = transaction.state.doc;

      // No line, or a line that does not exist any more because the code was
      // edited after the run. Clearing is the honest thing to do.
      if (!lineNumber || lineNumber < 1 || lineNumber > document.lines) {
        decorations = Decoration.none;
        continue;
      }

      const line = document.line(lineNumber);

      decorations = Decoration.set([
        // A line decoration styles the whole row, not a range of characters.
        Decoration.line({ class: "cm-dryrun-active-line" }).range(line.from),
      ]);
    }

    return decorations;
  },

  provide: (field) => EditorView.decorations.from(field),
});

/*
 * The styling.
 *
 * Note the CSS variables: because this becomes a real stylesheet in the page,
 * `var(--brand)` resolves exactly as it does everywhere else — so the
 * highlight switches with light and dark mode on its own, with no JavaScript
 * involved. Those variables live in src/styles/theme.css.
 */
const activeLineTheme = EditorView.baseTheme({
  ".cm-dryrun-active-line": {
    backgroundColor: "var(--brand-tint)",
    // A bar down the left edge, so the line is still obvious to anyone who
    // cannot easily distinguish the background tint.
    boxShadow: "inset 3px 0 0 0 var(--brand)",
    borderRadius: "2px",
  },
});

/** Add this to the editor's extensions to switch the feature on. */
export const activeLineHighlight = [activeLineField, activeLineTheme];
