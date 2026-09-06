/**
 * ProblemPanel — the question, sitting beside the editor.
 *
 * The reason this exists: in solve mode you should never have to go back to
 * the library to remember what you are solving. Statement, worked examples and
 * constraints are all here, in the same view as your code.
 *
 * The examples matter more than the description. "Input, output, and why" is
 * usually the moment a problem clicks — most people read the first example
 * before they finish the paragraph above it.
 */

import { Panel } from "../../components/ui/Panel.jsx";
import { cx } from "../../lib/classNames.js";

const difficultyStyles = {
  easy: "text-[#1a7f64] dark:text-[#6cc79b]",
  medium: "text-[#b8590a] dark:text-[#e0a86a]",
  hard: "text-[#c0392b] dark:text-[#ff8a80]",
};

export function ProblemPanel({ problem, className }) {
  return (
    <Panel className={cx("flex flex-col overflow-y-auto", className)}>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-hand text-2xl text-text">{problem.title}</h1>

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
          {/* Falls back to the one-line summary for problems whose full
              statement has not been written yet. */}
          {problem.description ?? problem.summary}
        </p>

        {problem.examples?.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
              Examples
            </h2>

            <div className="mt-3 space-y-3">
              {problem.examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-surface p-3"
                >
                  <p className="text-[11px] font-medium text-muted">
                    Example {index + 1}
                  </p>

                  <dl className="mt-2 space-y-1 font-mono text-[12px]">
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-muted">Input</dt>
                      <dd className="min-w-0 break-all text-text">
                        {example.input}
                      </dd>
                    </div>

                    <div className="flex gap-2">
                      <dt className="shrink-0 text-muted">Output</dt>
                      <dd className="min-w-0 break-all text-brand">
                        {example.output}
                      </dd>
                    </div>
                  </dl>

                  {example.explanation && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {problem.constraints?.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
              Constraints
            </h2>

            <ul className="mt-2 space-y-1">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="font-mono text-[12px] text-muted">
                  {constraint}
                </li>
              ))}
            </ul>
          </section>
        )}

        {!problem.hasStatement && (
          <p className="mt-6 rounded-lg border border-dashed border-border p-3 text-xs leading-relaxed text-muted">
            The full statement for this one is still being written. The summary
            above says what it asks; the worked solution is available from the
            button in the editor.
          </p>
        )}
      </div>
    </Panel>
  );
}
