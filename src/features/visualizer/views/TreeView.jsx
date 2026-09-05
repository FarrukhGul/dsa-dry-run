/**
 * TreeView — a tree laid out the way it is drawn on a whiteboard.
 *
 * HOW THE LAYOUT WORKS
 *
 * The classic trick, and it is only three lines: place every leaf in the next
 * free column, left to right, then put each parent midway between its first
 * and last child. Do that bottom-up and nothing ever overlaps.
 *
 * A missing child is kept as an empty slot rather than skipped, so a node with
 * only a right child still leans right. Dropping it would redraw a lopsided
 * tree as a balanced one, which would be a lie about the thing you are
 * debugging.
 */

import { snapshotToText } from "../../../lib/formatSnapshot.js";
import { readField, readNodeValue } from "../detectShape.js";
import { EmptyNote } from "./ArrayView.jsx";

/** Drawing sizes, in pixels. */
const COLUMN_WIDTH = 46;
const ROW_HEIGHT = 58;
const RADIUS = 15;
const PADDING = 20;

/** Stop after this many nodes, however deep the tree goes. */
const MAX_NODES = 60;

/**
 * Turns a recorded value into a simple tree of `{ label, children }`.
 *
 * @param {object|null} snapshot
 * @param {{count: number}} budget shared across the whole tree
 */
function toTreeNode(snapshot, budget) {
  if (!snapshot) return null;
  if (snapshot.kind === "null" || snapshot.kind === "undefined") return null;

  if (budget.count >= MAX_NODES) return { label: "…", children: [], faded: true };
  budget.count += 1;

  if (snapshot.kind === "circular") return { label: "↻", children: [], faded: true };
  if (snapshot.kind === "truncated") return { label: "…", children: [], faded: true };

  // A tree of plain values rather than node objects.
  if (snapshot.kind !== "object") {
    return { label: snapshotToText(snapshot), children: [] };
  }

  const payload = readNodeValue(snapshot);
  const label = payload ? snapshotToText(payload) : "•";

  // Some trees use a `children` array; binary trees use `left` and `right`.
  const childrenField = readField(snapshot, "children");

  if (childrenField?.kind === "array") {
    const children = childrenField.items
      .map((child) => toTreeNode(child, budget))
      .filter(Boolean);
    return { label, children };
  }

  const left = toTreeNode(readField(snapshot, "left"), budget);
  const right = toTreeNode(readField(snapshot, "right"), budget);

  // Both missing means this is a leaf. One missing means the empty side is
  // kept as a placeholder, so the remaining child still sits on its own side.
  const children =
    left || right
      ? [left ?? { empty: true, children: [] }, right ?? { empty: true, children: [] }]
      : [];

  return { label, children };
}

/** Gives every node an x (column) and y (depth). See the note at the top. */
function layout(root) {
  let nextColumn = 0;
  let deepest = 0;

  function place(node, depth) {
    node.depth = depth;
    deepest = Math.max(deepest, depth);

    if (node.children.length === 0) {
      node.column = nextColumn;
      nextColumn += 1;
      return;
    }

    for (const child of node.children) place(child, depth + 1);

    const first = node.children[0].column;
    const last = node.children[node.children.length - 1].column;
    node.column = (first + last) / 2;
  }

  place(root, 0);
  return { columns: nextColumn, depth: deepest };
}

/** Flattens the laid-out tree into the lines and circles we draw. */
function collect(node, parent, nodes, edges) {
  if (parent) edges.push({ from: parent, to: node });
  if (!node.empty) nodes.push(node);

  for (const child of node.children) collect(child, node, nodes, edges);
}

export function TreeView({ value }) {
  const root = toTreeNode(value, { count: 0 });

  if (!root) return <EmptyNote>empty tree</EmptyNote>;

  const { columns, depth } = layout(root);

  const nodes = [];
  const edges = [];
  collect(root, null, nodes, edges);

  const width = Math.max(columns, 1) * COLUMN_WIDTH + PADDING * 2;
  const height = (depth + 1) * ROW_HEIGHT;

  const x = (node) => node.column * COLUMN_WIDTH + PADDING + COLUMN_WIDTH / 2;
  const y = (node) => node.depth * ROW_HEIGHT + PADDING + RADIUS;

  return (
    <div className="overflow-x-auto pb-1">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Tree with ${nodes.length} nodes`}
        className="block"
      >
        {/* Lines first, so the circles sit on top of them. */}
        {edges.map((edge, index) => (
          <line
            key={index}
            x1={x(edge.from)}
            y1={y(edge.from)}
            x2={x(edge.to)}
            y2={y(edge.to)}
            stroke="var(--border)"
            strokeWidth="1.5"
            // A missing child gets a faint stub, so you can see which side is
            // empty without it looking like a real node.
            strokeDasharray={edge.to.empty ? "3 3" : undefined}
          />
        ))}

        {nodes.map((node, index) => (
          <g key={index}>
            <circle
              cx={x(node)}
              cy={y(node)}
              r={RADIUS}
              fill="var(--raised)"
              stroke={node.faded ? "var(--border)" : "var(--brand)"}
              strokeWidth="1.5"
            />
            <text
              x={x(node)}
              y={y(node)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={node.faded ? "var(--muted)" : "var(--text)"}
              className="font-mono"
              fontSize="12"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
