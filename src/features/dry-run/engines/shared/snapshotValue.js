/**
 * snapshotValue.js — turns a live JavaScript value into a safe, plain
 * description of it.
 *
 * WHY THIS EXISTS
 *
 * A trace is a list of thousands of moments frozen in time. If we stored the
 * real objects, three things would go wrong:
 *
 *   1. They keep changing. Store a live array at step 3 and by step 40 it has
 *      been sorted — so step 3 would show the wrong thing when you scrub back.
 *   2. They cannot cross the wire. The engine runs on a background thread and
 *      has to post its results back; functions and class instances do not
 *      survive that trip.
 *   3. They can be endless. A linked list that loops, or a tree with parent
 *      pointers, would be walked forever.
 *
 * So every value is copied into a plain, finite, self-describing shape:
 *
 *   42          →  { kind: "number", value: 42 }
 *   [1, 2]      →  { kind: "array", length: 2, items: [ …, … ] }
 *   node.next   →  { kind: "object", entries: [["value", …], ["next", …]] }
 *
 * The `kind` field is what the visualiser reads to decide how to draw it.
 */

/**
 * Describes one value.
 *
 * @param {unknown} value    the thing to describe
 * @param {object}  limits   from limits.js — caps depth, item count, string length
 * @param {number}  depth    how deep we already are (internal)
 * @param {Set}     seen     objects already being described (internal, for cycles)
 * @returns {object} a plain object safe to store and send
 */
export function snapshotValue(
  value,
  limits,
  depth = 0,
  seen = new Set(),
  // A shared allowance for this one value's walk. Because it is a default
  // parameter, every top-level call gets a fresh budget and every recursive
  // call inherits the one already in progress.
  budget = { remaining: limits.maxValueNodes },
) {
  // --- the simple cases, in rough order of how often they turn up ----------

  if (value === null) return { kind: "null" };
  if (value === undefined) return { kind: "undefined" };

  const type = typeof value;

  if (type === "number") {
    // NaN and Infinity are real numbers but do not survive JSON, and they are
    // worth showing differently anyway — a stray NaN is usually the bug.
    if (Number.isNaN(value)) return { kind: "number", value: null, label: "NaN" };
    if (!Number.isFinite(value)) {
      return { kind: "number", value: null, label: value > 0 ? "Infinity" : "-Infinity" };
    }
    return { kind: "number", value };
  }

  if (type === "boolean") return { kind: "boolean", value };

  if (type === "string") {
    if (value.length > limits.maxStringLength) {
      return {
        kind: "string",
        value: value.slice(0, limits.maxStringLength),
        truncated: true,
        length: value.length,
      };
    }
    return { kind: "string", value };
  }

  if (type === "bigint") return { kind: "bigint", label: `${value}n` };
  if (type === "symbol") return { kind: "symbol", label: value.toString() };

  if (type === "function") {
    return { kind: "function", name: value.name || "(anonymous)" };
  }

  // --- from here on we are dealing with objects ---------------------------

  // A value that points back at itself, directly or through a chain. Without
  // this check a circular linked list would be followed until we ran out of
  // memory.
  if (seen.has(value)) return { kind: "circular" };

  // Deep enough, or we have looked at enough objects for one variable. Either
  // way, say so rather than silently cutting it off.
  if (depth >= limits.maxValueDepth || budget.remaining <= 0) {
    return { kind: "truncated", label: describeBriefly(value) };
  }

  budget.remaining -= 1;

  // Mark this object as "currently being described" for the branch below us,
  // then unmark it on the way out. Marking it for the whole run would wrongly
  // report the same shared object as circular when it appears twice side by
  // side — as `[node, node]` does.
  seen.add(value);

  try {
    if (Array.isArray(value)) {
      return snapshotArray(value, limits, depth, seen, budget);
    }

    if (value instanceof Map) {
      return snapshotMap(value, limits, depth, seen, budget);
    }

    if (value instanceof Set) {
      return snapshotSet(value, limits, depth, seen, budget);
    }

    if (value instanceof Error) {
      return { kind: "error", name: value.name, message: value.message };
    }

    return snapshotObject(value, limits, depth, seen, budget);
  } finally {
    seen.delete(value);
  }
}

function snapshotArray(value, limits, depth, seen, budget) {
  const shown = Math.min(value.length, limits.maxValueItems);
  const items = [];

  for (let index = 0; index < shown; index++) {
    items.push(snapshotValue(value[index], limits, depth + 1, seen, budget));
  }

  return {
    kind: "array",
    length: value.length,
    items,
    truncated: value.length > shown,
  };
}

function snapshotMap(value, limits, depth, seen, budget) {
  const entries = [];

  for (const [key, entryValue] of value) {
    if (entries.length >= limits.maxValueItems) break;

    entries.push([
      snapshotValue(key, limits, depth + 1, seen, budget),
      snapshotValue(entryValue, limits, depth + 1, seen, budget),
    ]);
  }

  return {
    kind: "map",
    size: value.size,
    entries,
    truncated: value.size > entries.length,
  };
}

function snapshotSet(value, limits, depth, seen, budget) {
  const items = [];

  for (const item of value) {
    if (items.length >= limits.maxValueItems) break;
    items.push(snapshotValue(item, limits, depth + 1, seen, budget));
  }

  return {
    kind: "set",
    size: value.size,
    items,
    truncated: value.size > items.length,
  };
}

function snapshotObject(value, limits, depth, seen, budget) {
  // Only the object's own keys. Walking inherited ones would drag in half the
  // language's built-in methods on every step.
  const keys = Object.keys(value);
  const shown = keys.slice(0, limits.maxValueItems);
  const entries = [];

  for (const key of shown) {
    let entryValue;

    try {
      entryValue = value[key];
    } catch {
      // A getter that throws. Rare, but it must not take down the whole trace.
      entries.push([key, { kind: "unavailable" }]);
      continue;
    }

    entries.push([
      key,
      snapshotValue(entryValue, limits, depth + 1, seen, budget),
    ]);
  }

  return {
    kind: "object",
    // The constructor name is how we later recognise a ListNode or TreeNode.
    className: readClassName(value),
    entries,
    truncated: keys.length > shown.length,
  };
}

function readClassName(value) {
  const name = value?.constructor?.name;
  return name && name !== "Object" ? name : null;
}

/** A one-line label for something we chose not to walk into. */
function describeBriefly(value) {
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (value instanceof Map) return `Map(${value.size})`;
  if (value instanceof Set) return `Set(${value.size})`;
  return readClassName(value) ?? "Object";
}

/**
 * Formats a value the way console.log would — a short single line.
 *
 * Used only for the console panel, where people expect `[1, 2, 3]` rather than
 * a structured description.
 *
 * @param {unknown} value
 * @param {number} depth internal
 */
export function formatForConsole(value, depth = 0) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;

  if (type === "string") return depth === 0 ? value : JSON.stringify(value);
  if (type === "number" || type === "boolean" || type === "bigint") {
    return String(value);
  }
  if (type === "function") return `ƒ ${value.name || "(anonymous)"}`;
  if (type === "symbol") return value.toString();

  // Stop before we print something enormous or endless.
  if (depth >= 3) return Array.isArray(value) ? "[…]" : "{…}";

  try {
    if (Array.isArray(value)) {
      const items = value.slice(0, 20).map((item) => formatForConsole(item, depth + 1));
      if (value.length > 20) items.push(`… ${value.length - 20} more`);
      return `[${items.join(", ")}]`;
    }

    if (value instanceof Map) {
      const entries = [...value.entries()]
        .slice(0, 20)
        .map(([key, item]) => `${formatForConsole(key, depth + 1)} => ${formatForConsole(item, depth + 1)}`);
      return `Map(${value.size}) {${entries.join(", ")}}`;
    }

    if (value instanceof Set) {
      const items = [...value].slice(0, 20).map((item) => formatForConsole(item, depth + 1));
      return `Set(${value.size}) {${items.join(", ")}}`;
    }

    if (value instanceof Error) return `${value.name}: ${value.message}`;

    const className = readClassName(value);
    const entries = Object.keys(value)
      .slice(0, 20)
      .map((key) => `${key}: ${formatForConsole(value[key], depth + 1)}`);

    return `${className ? className + " " : ""}{${entries.join(", ")}}`;
  } catch {
    return "[unprintable value]";
  }
}
