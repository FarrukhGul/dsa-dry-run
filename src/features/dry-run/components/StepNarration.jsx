/**
 * StepNarration — the sentence at the top of the panel saying what happened.
 *
 * Three things, stacked:
 *   the line number      so you can find it
 *   the sentence         "i goes from 2 to 3."
 *   the line itself      the actual code, so you need not look away
 *
 * The sentence describes what the PREVIOUS line did; the highlighted line in
 * the editor is what runs next. narrateStep.js explains why that is the useful
 * way round.
 */

import { narrateStep } from "../narrateStep.js";

/** How each kind of token from the narrator is drawn. */
const tokenStyles = {
  name: "font-mono text-brand",
  value: "font-mono text-text",
  text: "text-muted",
};

export function StepNarration({ step, previousStep, sourceLines }) {
  if (!step) return null;

  const tokens = narrateStep({ step, previousStep, sourceLines });
  const sourceLine = sourceLines[step.line - 1] ?? "";

  return (
    <div className="bg-surface px-3 py-2.5">
      <div className="flex items-baseline gap-2">
        <span className="shrink-0 rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[11px] text-brand">
          line {step.line}
        </span>

        {/* `aria-live` means a screen reader reads the new sentence as you
            step, which is the whole experience for anyone not watching the
            highlight move. */}
        <p aria-live="polite" className="text-[13px] leading-relaxed">
          {tokens.map((token, index) => (
            <span key={index} className={tokenStyles[token.t]}>
              {token.v}
            </span>
          ))}
        </p>
      </div>

      {sourceLine.trim() && (
        <pre className="mt-1.5 overflow-x-auto rounded bg-raised px-2 py-1 font-mono text-[12px] text-muted">
          {sourceLine.trim()}
        </pre>
      )}
    </div>
  );
}
