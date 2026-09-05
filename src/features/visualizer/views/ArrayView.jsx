/**
 * ArrayView — an array drawn as a row of cells, the way you would on paper.
 *
 * Three things are shown at once:
 *   the values      in the cells
 *   the indices     underneath, so you never have to count
 *   the pointers    under the cell they point at — `i`, `left`, `right`
 *
 * A cell whose value changed on this step is tinted, which is what makes a
 * sort readable: you watch the two swapped cells light up as they move.
 */

import { cx } from "../../../lib/classNames.js";
import { snapshotToText } from "../../../lib/formatSnapshot.js";

/** Cells drawn before we stop and say how many are left. */
const MAX_CELLS = 60;

export function ArrayView({ value, previousValue, pointers }) {
  const items = value.items.slice(0, MAX_CELLS);
  const hiddenCount = value.length - items.length;

  // A pointer parked one past the last cell — `right = nums.length`.
  const endPointer = pointers?.get(value.length) ?? null;

  if (value.length === 0) {
    return <EmptyNote>empty array</EmptyNote>;
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-start gap-1">
        {items.map((item, index) => {
          const previousItem = previousValue?.items?.[index];
          const hasChanged =
            previousItem !== undefined &&
            snapshotToText(previousItem) !== snapshotToText(item);

          const names = pointers?.get(index) ?? null;

          return (
            <div key={index} className="flex shrink-0 flex-col items-center gap-1">
              <div
                className={cx(
                  "flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-[13px] transition-colors",
                  names
                    ? "border-brand bg-brand-tint text-text"
                    : hasChanged
                      ? "border-brand/40 bg-brand-tint text-text"
                      : "border-border text-text",
                )}
              >
                {snapshotToText(item)}
              </div>

              <span className="font-mono text-[10px] text-muted/70">{index}</span>

              {/* The pointer labels, stacked when more than one lands here. */}
              {names && (
                <span className="flex flex-col items-center font-mono text-[11px] leading-tight text-brand">
                  <span aria-hidden="true">▲</span>
                  {names.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </span>
              )}
            </div>
          );
        })}

        {endPointer && (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div
              className="flex h-9 min-w-9 items-center justify-center rounded-md border border-dashed border-border px-2 font-mono text-[13px] text-muted"
              title="One past the end of the array"
            >
              ·
            </div>

            <span className="font-mono text-[10px] text-muted/70">
              {value.length}
            </span>

            <span className="flex flex-col items-center font-mono text-[11px] leading-tight text-brand">
              <span aria-hidden="true">▲</span>
              {endPointer.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </span>
          </div>
        )}

        {hiddenCount > 0 && (
          <span className="shrink-0 self-center pl-2 text-xs text-muted">
            … {hiddenCount} more
          </span>
        )}
      </div>
    </div>
  );
}

export function EmptyNote({ children }) {
  return <p className="font-mono text-xs text-muted">{children}</p>;
}
