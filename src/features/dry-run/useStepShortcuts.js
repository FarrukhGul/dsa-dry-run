/**
 * useStepShortcuts — arrow keys to step through a run.
 *
 *   →  or  ↓     next step
 *   ←  or  ↑     previous step
 *   Home / End   first / last
 *   Space        play or pause
 *
 * Once you are reading a run properly, reaching for the mouse between every
 * step breaks the rhythm. This is the difference between stepping through
 * forty lines and giving up after five.
 *
 * IT STAYS OUT OF THE WAY WHILE YOU ARE TYPING
 *
 * The editor is right next to these controls, and pressing → in your code must
 * move the cursor, not the run. So any key press that starts inside a text
 * field, a form control or the editor itself is ignored.
 */

import { useEffect } from "react";

/**
 * @param {object} runner   from useDryRunner
 * @param {boolean} enabled false while there is nothing to step through
 */
export function useStepShortcuts(runner, enabled) {
  const { next, previous, first, last, togglePlay } = runner;

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event) {
      // Let the browser's own shortcuts through untouched.
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (isTyping(event.target)) return;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          next();
          break;

        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          previous();
          break;

        case "Home":
          event.preventDefault();
          first();
          break;

        case "End":
          event.preventDefault();
          last();
          break;

        case " ":
          // Space would otherwise scroll the page.
          event.preventDefault();
          togglePlay();
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, next, previous, first, last, togglePlay]);
}

/** True when the key press belongs to something the person is editing. */
function isTyping(target) {
  if (!target) return false;

  // The code editor is a contenteditable region, not a textarea.
  if (target.isContentEditable) return true;

  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
