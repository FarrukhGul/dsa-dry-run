/**
 * RunStatusBanner — says how the run ended, in plain English.
 *
 * "step-limit" means nothing to somebody learning loops. Every status is
 * translated into what actually happened and, where we can, what to look at.
 * A good error message is a teaching moment; a bad one just makes people feel
 * stupid.
 */

import { cx } from "../../../lib/classNames.js";

/**
 * @param {object} trace the result from the engine
 * @returns {{tone: "ok"|"warn"|"error", title: string, detail: string}|null}
 */
function describeRun(trace) {
  const line = trace.error?.line;
  const atLine = line ? ` on line ${line}` : "";

  switch (trace.status) {
    case "completed":
      return null; // Nothing went wrong — no need to say anything.

    case "syntax-error":
      return {
        tone: "error",
        title: `JavaScript could not read your code${atLine}`,
        detail: `${trace.error?.message ?? ""}. Nothing ran — this is caught before the code starts, usually a missing bracket, brace or quote.`,
      };

    case "error":
      return {
        tone: "error",
        title: `Your code threw an error${atLine}`,
        detail:
          trace.mode === "run"
            ? `${trace.error?.message ?? ""}. Press Dry Run to step up to that line and see what every variable held when it happened.`
            : `${trace.error?.message ?? ""}. The steps up to that point were still recorded, so you can step forward and watch it happen.`,
      };

    case "step-limit":
      // The cap is much higher for Run Code, which keeps nothing as it goes,
      // so the advice differs: hitting it while recording often just means the
      // program is big, not broken.
      return trace.mode === "run"
        ? {
            tone: "warn",
            title: `Stopped after ${trace.stepCount.toLocaleString()} lines`,
            detail:
              "That is an enormous amount of work for one program, so this is almost certainly a loop that never ends. Check that whatever your loop is waiting for actually changes inside it.",
          }
        : {
            tone: "warn",
            title: "Stopped after 20,000 steps",
            detail:
              "A dry run records every line, so it stops far sooner than the code itself would. If your program is simply large, press Run Code instead — it runs the whole thing. If it is not, look for a loop that never ends. Everything up to this point was recorded and can still be stepped through.",
          };

    case "time-limit":
      return {
        tone: "warn",
        title: "Stopped after 5 seconds",
        detail:
          "The code was still going, so it was stopped. Usually a loop that never ends, or a very large input.",
      };

    case "depth-limit":
      return {
        tone: "warn",
        title: "Too much recursion — the call stack reached 200 deep",
        detail:
          "A function kept calling itself without ever reaching a stopping point. Check that your base case is there and that it is actually reachable.",
      };

    case "unsupported":
      return {
        tone: "warn",
        title: "Not available for this language yet",
        detail: trace.error?.message ?? "",
      };

    default:
      return {
        tone: "error",
        title: "Something went wrong",
        detail: trace.error?.message ?? "",
      };
  }
}

const toneStyles = {
  ok: "border-border bg-surface",
  warn: "border-[#e0a86a] bg-[#e0a86a]/10",
  error: "border-[#e07a7a] bg-[#e07a7a]/10",
};

export function RunStatusBanner({ trace }) {
  const description = describeRun(trace);
  if (!description) return null;

  return (
    <div
      // `role="status"` means a screen reader announces this when it appears.
      role="status"
      className={cx(
        "border-b p-3 text-[13px]",
        toneStyles[description.tone],
      )}
    >
      <p className="font-semibold text-text">{description.title}</p>
      <p className="mt-1 leading-relaxed text-muted">{description.detail}</p>
    </div>
  );
}
