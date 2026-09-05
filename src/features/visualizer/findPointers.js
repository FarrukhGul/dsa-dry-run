/**
 * findPointers.js — works out which variables are pointing into an array, so
 * we can draw them underneath the cell they point at.
 *
 * This is the thing you would draw with a pencil. `i` sits under cell 2,
 * `left` and `right` sit at either end and walk towards each other. Seeing
 * that, rather than reading `i = 2` in a table and counting cells yourself, is
 * most of the value of a dry run.
 *
 * HOW WE DECIDE
 *
 * A variable is treated as a pointer when both are true:
 *
 *   1. its name is one people actually use for an index (the list below), and
 *   2. its value is a whole number that lands inside the array.
 *
 * The name check is what keeps it honest. Without it, `sum = 3` would be drawn
 * as a pointer at cell 3, which is worse than drawing nothing — a wrong
 * picture is more confusing than no picture. The cost is that an index named
 * something unusual is missed, which is the safer way to be wrong.
 */

/**
 * Names people give to indices. Lower-cased before comparing, so `Left` and
 * `left` both count.
 *
 * Deliberately missing: `n`, `len`, `size`, `count`, `total`, `sum`. Those are
 * almost always a length or a running total, not a position.
 */
const INDEX_NAMES = new Set([
  "i", "j", "k", "l", "r", "p", "q", "x", "y",
  "lo", "hi", "low", "high",
  "left", "right", "mid", "middle", "pivot",
  "start", "end", "begin", "finish",
  "first", "last", "front", "rear", "top",
  "slow", "fast",
  "pos", "idx", "index", "ptr", "pointer",
  "cur", "curr", "current",
  "read", "write", "head", "tail",
]);

/**
 * Finds the pointers into one array.
 *
 * @param {object} locals   every variable in the current frame
 * @param {number} length   how long the array is
 * @param {string} skipName the array's own name, so it cannot point at itself
 * @returns {Map<number, string[]>} cell index → the names pointing at it
 */
export function findPointers(locals, length, skipName) {
  const pointers = new Map();

  for (const [name, value] of Object.entries(locals)) {
    if (name === skipName) continue;
    if (value?.kind !== "number") continue;

    if (!INDEX_NAMES.has(name.toLowerCase())) continue;

    const index = value.value;
    if (!Number.isInteger(index)) continue;

    // `index === length` is allowed on purpose. Plenty of correct code parks a
    // pointer one past the end — `let right = nums.length` — and showing that
    // is more useful than hiding it. The array view draws it as a marker after
    // the last cell rather than on one.
    if (index < 0 || index > length) continue;

    if (!pointers.has(index)) pointers.set(index, []);
    pointers.get(index).push(name);
  }

  return pointers;
}
