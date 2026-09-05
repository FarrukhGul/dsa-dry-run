/**
 * dsaShapes.js — ready-made drawings for the four things people sketch most.
 *
 * Drawing eight identical boxes in a row by hand, evenly spaced, is a chore
 * that has nothing to do with understanding an algorithm. These build them for
 * you, in one click, already lined up.
 *
 * HOW THE SHAPES ARE DESCRIBED
 *
 * Excalidraw elements are big objects with dozens of fields — ids, seeds,
 * version numbers, binding tables. We never write those by hand. Instead we
 * describe what we want in the simple "skeleton" form and let Excalidraw's own
 * `convertToExcalidrawElements` fill in everything else:
 *
 *   { type: "rectangle", x: 0, y: 0, width: 60, height: 60, label: { text: "3" } }
 *
 * Every builder takes the point to draw at and returns a skeleton array.
 */

/** Sizes, in canvas pixels. Kept here so the shapes stay in proportion. */
const CELL = 60;
const GAP = 8;
const NODE_WIDTH = 80;
const NODE_HEIGHT = 52;

/** Palette. These match src/styles/theme.css, but Excalidraw needs literals. */
const INK = "#1e1e1e";
const TINT = "#f1f0ff";
const VIOLET = "#6965db";

/** Fields shared by every filled shape, so they all look like one family. */
const filled = {
  strokeColor: INK,
  backgroundColor: TINT,
  fillStyle: "solid",
  strokeWidth: 1,
  roughness: 1,
};

/**
 * A row of numbered cells — an array.
 *
 * The index labels underneath are the point of it: they are what you actually
 * need when working out whether a loop should stop at `n` or `n - 1`.
 */
function arrayStrip({ x, y }, count = 6) {
  const shapes = [];

  for (let index = 0; index < count; index++) {
    const cellX = x + index * (CELL + GAP);

    shapes.push({
      ...filled,
      type: "rectangle",
      x: cellX,
      y,
      width: CELL,
      height: CELL,
    });

    // The index, sitting below its cell.
    shapes.push({
      type: "text",
      x: cellX + CELL / 2 - 6,
      y: y + CELL + 8,
      text: String(index),
      fontSize: 16,
      strokeColor: VIOLET,
    });
  }

  return shapes;
}

/**
 * A chain of linked-list nodes.
 *
 * Each node is drawn in the conventional two halves — a value box and a
 * smaller `next` box — with arrows between them, and a `∅` at the end so the
 * chain visibly terminates.
 */
function linkedList({ x, y }, count = 4) {
  const shapes = [];
  const stride = NODE_WIDTH + 46;

  for (let index = 0; index < count; index++) {
    const nodeX = x + index * stride;

    shapes.push({
      ...filled,
      type: "rectangle",
      x: nodeX,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });

    // The `next` compartment on the right-hand end of the node.
    shapes.push({
      ...filled,
      type: "rectangle",
      backgroundColor: "transparent",
      x: nodeX + NODE_WIDTH,
      y,
      width: 24,
      height: NODE_HEIGHT,
    });

    // An arrow from this node's `next` box to the following node.
    shapes.push({
      type: "arrow",
      x: nodeX + NODE_WIDTH + 26,
      y: y + NODE_HEIGHT / 2,
      width: 20,
      height: 0,
      strokeColor: INK,
    });
  }

  shapes.push({
    type: "text",
    x: x + count * stride,
    y: y + NODE_HEIGHT / 2 - 12,
    text: "∅",
    fontSize: 20,
    strokeColor: INK,
  });

  return shapes;
}

/**
 * A three-level binary tree: one root, two children, four grandchildren.
 *
 * Drawn empty so you can label the nodes yourself — which is usually the
 * exercise.
 */
function binaryTree({ x, y }) {
  const shapes = [];
  const radius = 44;
  const levelHeight = 90;

  // Level 0 sits at the middle of the widest level below it.
  const levels = [
    [{ column: 3.5 }],
    [{ column: 1.5 }, { column: 5.5 }],
    [{ column: 0.5 }, { column: 2.5 }, { column: 4.5 }, { column: 6.5 }],
  ];

  const centreOf = (level, node) => ({
    cx: x + node.column * radius,
    cy: y + level * levelHeight,
  });

  // Lines first, so the circles are drawn over their ends.
  levels.forEach((nodes, level) => {
    if (level === 0) return;

    nodes.forEach((node, index) => {
      const parent = levels[level - 1][Math.floor(index / 2)];
      const from = centreOf(level - 1, parent);
      const to = centreOf(level, node);

      shapes.push({
        type: "line",
        x: from.cx + radius / 2,
        y: from.cy + radius,
        width: to.cx - from.cx,
        height: levelHeight - radius,
        strokeColor: INK,
      });
    });
  });

  levels.forEach((nodes, level) => {
    nodes.forEach((node) => {
      const { cx, cy } = centreOf(level, node);
      shapes.push({
        ...filled,
        type: "ellipse",
        x: cx,
        y: cy,
        width: radius,
        height: radius,
      });
    });
  });

  return shapes;
}

/**
 * A call stack — frames piled up, newest on top.
 *
 * The label sits above rather than inside, because the boxes are for writing
 * each frame's variables into.
 */
function callStack({ x, y }, count = 4) {
  const shapes = [
    {
      type: "text",
      x,
      y: y - 28,
      text: "call stack",
      fontSize: 16,
      strokeColor: VIOLET,
    },
  ];

  for (let index = 0; index < count; index++) {
    shapes.push({
      ...filled,
      // The top frame is the one running, so it gets the accent fill.
      backgroundColor: index === 0 ? TINT : "transparent",
      type: "rectangle",
      x,
      y: y + index * (NODE_HEIGHT + 4),
      width: 180,
      height: NODE_HEIGHT,
    });
  }

  return shapes;
}

/**
 * Everything the Insert menu offers.
 *
 * `build` is called with the point to draw at, worked out from wherever the
 * canvas is currently scrolled to.
 */
export const DSA_SHAPES = [
  {
    id: "array",
    label: "Array",
    hint: "A row of six numbered cells",
    build: (origin) => arrayStrip(origin),
  },
  {
    id: "linked-list",
    label: "Linked list",
    hint: "Four nodes, arrows, and a null at the end",
    build: (origin) => linkedList(origin),
  },
  {
    id: "tree",
    label: "Binary tree",
    hint: "An empty tree, three levels deep",
    build: (origin) => binaryTree(origin),
  },
  {
    id: "stack",
    label: "Call stack",
    hint: "Four frames, newest on top",
    build: (origin) => callStack(origin),
  },
];
