/**
 * CallStackPanel — which functions are part-way through running.
 *
 * Drawn with the newest call at the top, the way a stack of plates works: the
 * function at the top is the one executing, and everything below it is waiting
 * for it to finish.
 *
 * This is the panel that makes recursion click. Step into `fib(5)` and you can
 * watch the same function name pile up five deep, each frame holding its own
 * value of `n`.
 */

import { cx } from "../../../lib/classNames.js";
import { PanelSection } from "../../../components/ui/PanelSection.jsx";

export function CallStackPanel({ stack, onSelectFrame, selectedDepth }) {
  if (stack.length === 0) return null;

  // Innermost (currently running) first.
  const frames = [...stack].reverse();

  return (
    <PanelSection title={`Call stack (${stack.length})`}>
      <ol className="space-y-1">
        {frames.map((frame, position) => {
          // `position` counts from the top of the display; `depth` is the real
          // index in the stack, which is what the parent needs.
          const depth = stack.length - 1 - position;
          const isSelected = depth === selectedDepth;
          const isRunning = position === 0;

          return (
            <li key={depth}>
              <button
                type="button"
                onClick={() => onSelectFrame(depth)}
                className={cx(
                  "flex w-full items-baseline gap-2 rounded px-2 py-1 text-left text-[13px] transition-colors",
                  isSelected
                    ? "bg-brand-tint text-text"
                    : "text-muted hover:bg-surface hover:text-text",
                )}
              >
                <span className="font-mono">{frame.name}</span>
                <span className="text-xs text-muted">line {frame.line}</span>

                {isRunning && (
                  <span className="ml-auto text-[10px] text-brand">running</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </PanelSection>
  );
}
