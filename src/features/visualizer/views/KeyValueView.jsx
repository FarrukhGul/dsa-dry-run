/**
 * KeyValueView — maps, sets and plain objects, drawn as rows.
 *
 * There is no clever picture to be had here, and pretending otherwise would
 * only get in the way. A hash map is a lookup table, so it is drawn as one —
 * key on the left, value on the right, one pair per line.
 *
 * The one thing worth doing is marking what changed, because `seen.set(…)`
 * inside a loop is exactly the line people lose track of.
 */

import { cx } from "../../../lib/classNames.js";
import { snapshotToText } from "../../../lib/formatSnapshot.js";
import { ValueView } from "../../../components/ui/ValueView.jsx";
import { EmptyNote } from "./ArrayView.jsx";

const MAX_ROWS = 40;

/**
 * Pulls maps, sets and objects into one shape: a list of [label, value] rows.
 * A set has no keys, so its items are numbered instead.
 */
function toRows(snapshot) {
  if (!snapshot) return [];

  if (snapshot.kind === "map") {
    return snapshot.entries.map(([key, value]) => [snapshotToText(key), value]);
  }

  if (snapshot.kind === "set") {
    return snapshot.items.map((item, index) => [String(index), item]);
  }

  if (snapshot.kind === "object") {
    return snapshot.entries.map(([key, value]) => [key, value]);
  }

  return [];
}

export function KeyValueView({ value, previousValue }) {
  const rows = toRows(value).slice(0, MAX_ROWS);

  if (rows.length === 0) {
    return <EmptyNote>{value.kind === "map" ? "empty map" : value.kind === "set" ? "empty set" : "no fields"}</EmptyNote>;
  }

  // A lookup of what each key held one step ago, so we can mark the changes.
  const before = new Map(
    toRows(previousValue).map(([label, item]) => [label, snapshotToText(item)]),
  );
  const hadPrevious = previousValue != null;

  const total =
    value.kind === "map" || value.kind === "set" ? value.size : toRows(value).length;

  return (
    <div>
      <dl className="space-y-0.5">
        {rows.map(([label, item]) => {
          const isNew = hadPrevious && !before.has(label);
          const hasChanged =
            hadPrevious &&
            before.has(label) &&
            before.get(label) !== snapshotToText(item);

          return (
            <div
              key={label}
              className={cx(
                "flex items-baseline gap-2 rounded px-2 py-0.5 text-[13px] transition-colors",
                isNew || hasChanged ? "bg-brand-tint" : "",
              )}
            >
              <dt className="shrink-0 font-mono text-brand">{label}</dt>
              <dd className="flex min-w-0 items-baseline gap-2">
                <span className="text-muted">
                  {value.kind === "set" ? "·" : "→"}
                </span>
                <ValueView value={item} />
              </dd>
            </div>
          );
        })}
      </dl>

      {total > rows.length && (
        <p className="mt-1 px-2 text-xs text-muted">
          … {total - rows.length} more
        </p>
      )}
    </div>
  );
}
