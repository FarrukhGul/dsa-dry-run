/**
 * RunOutputPanel — what you see after pressing Run Code.
 *
 * No steps, no scrubbing: your program ran start to finish, and this is what
 * it printed. The same thing a terminal would show you, which is what you want
 * when you already know the code works and just need the answer.
 *
 * Errors are real errors — the same message and line number JavaScript itself
 * reports, because it is the same engine underneath, only with the note-taking
 * switched off.
 */

import { Panel } from "../../../components/ui/Panel.jsx";
import { cx } from "../../../lib/classNames.js";
import { RunStatusBanner } from "./RunStatusBanner.jsx";

const toneStyles = {
  log: "text-text",
  warn: "text-[#b8590a] dark:text-[#e0a86a]",
  error: "text-[#c0392b] dark:text-[#ff8a80]",
  system: "text-muted italic",
};

export function RunOutputPanel({ trace }) {
  const finishedCleanly = trace.status === "completed";

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <span
          className={cx(
            "h-2 w-2 shrink-0 rounded-full",
            finishedCleanly ? "bg-brand" : "bg-[#e0a86a]",
          )}
          aria-hidden="true"
        />

        <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
          Output
        </h2>

        {finishedCleanly && (
          <span className="ml-auto font-mono text-[11px] text-muted tabular-nums">
            finished · {trace.stepCount.toLocaleString()} lines run
          </span>
        )}
      </div>

      <RunStatusBanner trace={trace} />

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {trace.output.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            {finishedCleanly ? (
              <>
                Your code ran, but printed nothing. Add{" "}
                <code className="font-mono text-text">console.log(…)</code> to
                see a value here — or press{" "}
                <strong className="text-text">Dry Run</strong> to watch every
                variable without printing anything at all.
              </>
            ) : (
              "Nothing was printed before it stopped."
            )}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {trace.output.map((line, index) => (
              <li
                key={index}
                className={cx(
                  "font-mono text-[13px] break-all whitespace-pre-wrap",
                  toneStyles[line.kind] ?? toneStyles.log,
                )}
              >
                {line.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
