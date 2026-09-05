/**
 * formatSnapshot.js — turns a recorded value into a short, readable string.
 *
 * The engine records values as plain descriptions rather than the real thing
 * (see engines/shared/snapshotValue.js). This reads one back:
 *
 *   { kind: "number", value: 42 }       →  42
 *   { kind: "array", items: [ … ] }     →  [3, 1, 4]
 *   { kind: "map", entries: [ … ] }     →  Map(2) {3 → 0, 1 → 1}
 *
 * It lives apart from ValueView because it is also used for comparing two
 * values — that is how the variables panel spots what changed on a line.
 */

/** How deep to go before collapsing to `[…]`. Keeps one line to one line. */
const INLINE_DEPTH = 2;

/**
 * @param {object} snapshot a recorded value
 * @param {number} [depth] internal
 * @returns {string}
 */
export function snapshotToText(snapshot, depth = 0) {
  if (!snapshot) return "—";

  switch (snapshot.kind) {
    case "undefined":
      return "undefined";
    case "null":
      return "null";
    case "boolean":
      return String(snapshot.value);
    case "number":
      return snapshot.label ?? String(snapshot.value);
    case "bigint":
    case "symbol":
      return snapshot.label;

    case "string": {
      const text = JSON.stringify(snapshot.value);
      return snapshot.truncated
        ? `${text.slice(0, -1)}…" (${snapshot.length} characters)`
        : text;
    }

    case "function":
      return `ƒ ${snapshot.name}`;

    case "circular":
      return "↻ points back at itself";

    case "unavailable":
      return "not available here";

    case "truncated":
      return `${snapshot.label} …`;

    case "error":
      return `${snapshot.name}: ${snapshot.message}`;

    case "array": {
      if (depth >= INLINE_DEPTH) return `Array(${snapshot.length})`;

      const items = snapshot.items.map((item) => snapshotToText(item, depth + 1));
      if (snapshot.truncated) {
        items.push(`… ${snapshot.length - snapshot.items.length} more`);
      }
      return `[${items.join(", ")}]`;
    }

    case "map": {
      if (depth >= INLINE_DEPTH) return `Map(${snapshot.size})`;

      const entries = snapshot.entries.map(
        ([key, value]) =>
          `${snapshotToText(key, depth + 1)} → ${snapshotToText(value, depth + 1)}`,
      );
      if (snapshot.truncated) entries.push("…");
      return `Map(${snapshot.size}) {${entries.join(", ")}}`;
    }

    case "set": {
      if (depth >= INLINE_DEPTH) return `Set(${snapshot.size})`;

      const items = snapshot.items.map((item) => snapshotToText(item, depth + 1));
      if (snapshot.truncated) items.push("…");
      return `Set(${snapshot.size}) {${items.join(", ")}}`;
    }

    case "object": {
      const prefix = snapshot.className ? `${snapshot.className} ` : "";
      if (depth >= INLINE_DEPTH) return `${prefix}{…}`;

      const entries = snapshot.entries.map(
        ([key, value]) => `${key}: ${snapshotToText(value, depth + 1)}`,
      );
      if (snapshot.truncated) entries.push("…");
      return `${prefix}{${entries.join(", ")}}`;
    }

    default:
      return "?";
  }
}
