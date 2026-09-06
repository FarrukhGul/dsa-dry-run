/**
 * ProblemDialog — the choice you get when you pick a problem.
 *
 * THE POINT OF THIS BEING A CHOICE
 *
 * The library used to open a problem straight into its worked solution, which
 * is a bad way to learn: nobody attempts a problem with the answer already on
 * the screen. Now you decide, and the emphasis is on trying it.
 *
 * The answer is never hidden — it is one button away here, and one button away
 * inside the editor. It just is not what happens by accident.
 *
 * WHY THIS IS NOT A <dialog> ELEMENT
 *
 * It was. The native element brings focus trapping and Escape for free, which
 * is genuinely nice — but its behaviour and its ::backdrop styling vary
 * between browsers, and when it silently failed to appear there was no way to
 * tell why. A plain overlay is a few more lines and behaves the same
 * everywhere. Predictable beats elegant for something this important.
 *
 * So the three things the native element gave us are done by hand below:
 * Escape closes it, focus moves into it, and clicking outside dismisses it.
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { cx } from "../../lib/classNames.js";

const difficultyStyles = {
  easy: "text-[#1a7f64] dark:text-[#6cc79b]",
  medium: "text-[#b8590a] dark:text-[#e0a86a]",
  hard: "text-[#c0392b] dark:text-[#ff8a80]",
};

export function ProblemDialog({ problem, status, onClose }) {
  const navigate = useNavigate();
  const firstButtonRef = useRef(null);

  // Escape closes it, wherever the focus happens to be.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Move focus into the dialog, so a keyboard user is not left behind on the
  // list underneath.
  useEffect(() => {
    firstButtonRef.current?.focus();
  }, []);

  function open(mode) {
    navigate(`/dry-run?problem=${problem.id}&mode=${mode}`);
  }

  return (
    <div
      // Clicking the backdrop dismisses. The panel below stops the click from
      // reaching here, so clicking inside does nothing.
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-raised p-6 shadow-pop"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="problem-dialog-title"
            className="font-hand text-2xl text-text"
          >
            {problem.title}
          </h2>

          <span
            className={cx(
              "shrink-0 text-xs font-medium capitalize",
              difficultyStyles[problem.difficulty],
            )}
          >
            {problem.difficulty}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {problem.summary}
        </p>

        {status === "solved" && (
          <p className="mt-3 text-xs text-brand">
            ✓ You have already solved this one.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            ref={firstButtonRef}
            type="button"
            onClick={() => open("solve")}
            className="flex-1 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-brand-contrast shadow-card transition-colors hover:bg-brand-hover"
          >
            Solve it myself
            <span className="mt-0.5 block text-[11px] font-normal opacity-80">
              The problem, and an empty function
            </span>
          </button>

          <button
            type="button"
            onClick={() => open("solution")}
            className="flex-1 rounded-lg border border-border bg-raised px-4 py-3 text-sm font-medium text-text transition-colors hover:border-brand hover:text-brand"
          >
            See the solution
            <span className="mt-0.5 block text-[11px] font-normal text-muted">
              Step through a worked answer
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-xs text-muted transition-colors hover:text-text"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
