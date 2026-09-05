/**
 * MatrixView — an array of arrays drawn as a grid.
 *
 * Grids are everywhere in DSA: a maze, a chessboard, a dynamic programming
 * table. Drawn as nested lists they are unreadable; drawn as a grid, the
 * shape of the answer is usually visible as it fills in.
 *
 * Row and column numbers run along the edges, because "which cell is [2][3]"
 * should never need counting.
 */

import { cx } from "../../../lib/classNames.js";
import { snapshotToText } from "../../../lib/formatSnapshot.js";
import { EmptyNote } from "./ArrayView.jsx";

const MAX_ROWS = 25;
const MAX_COLUMNS = 25;

export function MatrixView({ value, previousValue }) {
  const rows = value.items.slice(0, MAX_ROWS);

  if (rows.length === 0) return <EmptyNote>empty grid</EmptyNote>;

  const columnCount = Math.min(
    Math.max(...rows.map((row) => row.items?.length ?? 0)),
    MAX_COLUMNS,
  );

  return (
    <div className="overflow-x-auto pb-1">
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            {/* Empty corner, above the row numbers. */}
            <th />
            {Array.from({ length: columnCount }, (_, column) => (
              <th
                key={column}
                className="font-mono text-[10px] font-normal text-muted/70"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th className="pr-1 text-right font-mono text-[10px] font-normal text-muted/70">
                {rowIndex}
              </th>

              {Array.from({ length: columnCount }, (_, column) => {
                const cell = row.items?.[column];
                const previousCell =
                  previousValue?.items?.[rowIndex]?.items?.[column];

                const hasChanged =
                  cell !== undefined &&
                  previousCell !== undefined &&
                  snapshotToText(previousCell) !== snapshotToText(cell);

                return (
                  <td
                    key={column}
                    className={cx(
                      "h-8 min-w-8 rounded border px-1.5 text-center font-mono text-[12px] transition-colors",
                      cell === undefined
                        ? "border-transparent"
                        : hasChanged
                          ? "border-brand bg-brand-tint text-text"
                          : "border-border text-text",
                    )}
                  >
                    {cell === undefined ? "" : snapshotToText(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {value.items.length > rows.length && (
        <p className="mt-1 text-xs text-muted">
          … {value.items.length - rows.length} more rows
        </p>
      )}
    </div>
  );
}
