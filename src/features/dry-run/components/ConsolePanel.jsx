/**
 * ConsolePanel — whatever your code has printed so far.
 *
 * "So far" is the important word. The list is cut to the number of lines that
 * had been printed by the step you are looking at, so the console rewinds with
 * everything else rather than always showing the final state.
 */

import { cx } from "../../../lib/classNames.js";
import { PanelSection } from "../../../components/ui/PanelSection.jsx";

const toneStyles = {
  log: "text-text",
  warn: "text-[#b8590a] dark:text-[#e0a86a]",
  error: "text-[#c0392b] dark:text-[#ff8a80]",
  system: "text-muted italic",
};

export function ConsolePanel({ output, totalOutput }) {
  const remaining = totalOutput - output.length;

  return (
    <PanelSection title="Console">
      {output.length === 0 ? (
        <p className="text-xs text-muted">
          {totalOutput > 0
            ? "Nothing printed yet at this point in the run."
            : "Nothing printed. Add a console.log to see values here."}
        </p>
      ) : (
        <ul className="space-y-0.5">
          {output.map((line, index) => (
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

      {remaining > 0 && (
        <p className="mt-2 text-[11px] text-muted">
          {remaining} more {remaining === 1 ? "line" : "lines"} printed later in
          the run.
        </p>
      )}
    </PanelSection>
  );
}
