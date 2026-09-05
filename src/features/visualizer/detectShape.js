/**
 * detectShape.js — works out what a recorded value actually *is*, so we can
 * draw it properly.
 *
 * The engine records everything as arrays and objects, because that is all
 * JavaScript has. But `{ value: 3, next: {…} }` is a linked list and
 * `{ value: 3, left: {…}, right: {…} }` is a tree, and drawing those as
 * nested boxes helps nobody. This is where we recognise them.
 *
 * It is a guess, made from field names, and it is occasionally going to be
 * wrong — someone's `next` field might mean "next appointment". That is an
 * acceptable trade: when it guesses right it is the single most useful thing
 * on the screen, and when it guesses wrong you still see all the same data,
 * just drawn as a chain instead of a box.
 */

export const SHAPE = {
  ARRAY: "array",
  MATRIX: "matrix",
  LINKED_LIST: "linked-list",
  TREE: "tree",
  MAP: "map",
  SET: "set",
  OBJECT: "object",
  PRIMITIVE: "primitive",
};

/**
 * A short label for how we read a value, shown next to the variable name.
 *
 * It matters: the shape is a guess, so if we have decided something is a tree
 * and you meant otherwise, you should be able to see that we guessed rather
 * than wonder why the picture looks wrong.
 */
export const SHAPE_LABELS = {
  [SHAPE.ARRAY]: "array",
  [SHAPE.MATRIX]: "grid",
  [SHAPE.LINKED_LIST]: "linked list",
  [SHAPE.TREE]: "tree",
  [SHAPE.MAP]: "map",
  [SHAPE.SET]: "set",
  [SHAPE.OBJECT]: "object",
};

/** Field names that mean "the next one along". */
const LINK_KEYS = ["next"];

/** Field names that mean "the ones below me". */
const TREE_KEYS = ["left", "right", "children"];

/** Field names people use for the payload a node carries. */
export const VALUE_KEYS = ["value", "val", "data", "key", "item"];

/**
 * @param {object} snapshot a recorded value
 * @returns {string} one of SHAPE
 */
export function detectShape(snapshot) {
  if (!snapshot) return SHAPE.PRIMITIVE;

  switch (snapshot.kind) {
    case "array":
      return isMatrix(snapshot) ? SHAPE.MATRIX : SHAPE.ARRAY;

    case "map":
      return SHAPE.MAP;

    case "set":
      return SHAPE.SET;

    case "object":
      // Tree is checked first: a node with `left`, `right` AND `next` is far
      // more likely to be a tree that also threads its nodes together.
      if (hasAnyKey(snapshot, TREE_KEYS)) return SHAPE.TREE;
      if (hasAnyKey(snapshot, LINK_KEYS)) return SHAPE.LINKED_LIST;
      return SHAPE.OBJECT;

    default:
      return SHAPE.PRIMITIVE;
  }
}

/** True when this value is worth drawing rather than printing on one line. */
export function isDrawable(snapshot) {
  const shape = detectShape(snapshot);
  return shape !== SHAPE.PRIMITIVE;
}

/** An array of arrays — a grid, a chessboard, a DP table. */
function isMatrix(snapshot) {
  if (snapshot.items.length === 0) return false;

  // Every row has to be an array, or it is just a list that happens to start
  // with one.
  return snapshot.items.every((item) => item?.kind === "array");
}

function hasAnyKey(snapshot, keys) {
  return snapshot.entries.some(([key]) => keys.includes(key));
}

/** Reads one field out of a recorded object, or null if it has no such field. */
export function readField(snapshot, key) {
  if (snapshot?.kind !== "object") return null;
  return snapshot.entries.find(([entryKey]) => entryKey === key)?.[1] ?? null;
}

/**
 * The payload a node carries — its `value`, `val`, `data`, whichever it uses.
 * Falls back to null when the node stores something less conventional.
 */
export function readNodeValue(snapshot) {
  for (const key of VALUE_KEYS) {
    const found = readField(snapshot, key);
    if (found) return found;
  }
  return null;
}
