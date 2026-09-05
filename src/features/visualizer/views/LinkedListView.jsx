/**
 * LinkedListView — a chain of nodes drawn as boxes and arrows.
 *
 * The whole difficulty of linked lists is that they are a picture in your head
 * and a pile of nested braces on the screen. This closes that gap: follow the
 * `next` field from node to node and lay them out in a row.
 *
 * Two endings are worth telling apart, and both are shown:
 *   ∅   the chain ends properly at null
 *   ↻   the chain loops back on itself — the classic cycle bug
 */

import { snapshotToText } from "../../../lib/formatSnapshot.js";
import { readField, readNodeValue } from "../detectShape.js";
import { EmptyNote } from "./ArrayView.jsx";

/** Nodes drawn before we stop. Longer chains say how many are left. */
const MAX_NODES = 30;

/**
 * Follows the chain and collects what we find.
 * Returns the nodes plus how the chain finished.
 */
function walkChain(head) {
  const nodes = [];
  let ending = "null"; // "null" | "cycle" | "more" | "odd"
  let current = head;

  while (current) {
    if (nodes.length >= MAX_NODES) {
      ending = "more";
      break;
    }

    // The engine marks a node it has already described, which is exactly what
    // a cycle looks like from here.
    if (current.kind === "circular") {
      ending = "cycle";
      break;
    }

    // The engine ran out of its node budget before reaching the end.
    if (current.kind === "truncated") {
      ending = "more";
      break;
    }

    if (current.kind !== "object") {
      ending = "odd";
      break;
    }

    nodes.push(current);

    const next = readField(current, "next");
    if (!next || next.kind === "null" || next.kind === "undefined") {
      ending = "null";
      break;
    }

    current = next;
  }

  return { nodes, ending };
}

export function LinkedListView({ value }) {
  const { nodes, ending } = walkChain(value);

  if (nodes.length === 0) return <EmptyNote>empty list</EmptyNote>;

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-center gap-1">
        {nodes.map((node, index) => {
          const payload = readNodeValue(node);

          return (
            <div key={index} className="flex shrink-0 items-center gap-1">
              <div className="flex h-9 items-center rounded-md border border-border">
                <span className="px-2.5 font-mono text-[13px] text-text">
                  {payload ? snapshotToText(payload) : "•"}
                </span>

                {/* The `next` half of the node, drawn as its own compartment
                    the way these are always sketched. */}
                <span className="flex h-full w-5 items-center justify-center border-l border-border text-[10px] text-muted">
                  ●
                </span>
              </div>

              <span aria-hidden="true" className="text-muted">
                →
              </span>
            </div>
          );
        })}

        <ChainEnding ending={ending} />
      </div>
    </div>
  );
}

function ChainEnding({ ending }) {
  if (ending === "cycle") {
    return (
      <span
        className="shrink-0 rounded-md border border-brand bg-brand-tint px-2 py-1 font-mono text-[12px] text-brand"
        title="This node points back at one earlier in the chain — the list has a cycle"
      >
        ↻ loops back
      </span>
    );
  }

  if (ending === "more") {
    return (
      <span className="shrink-0 text-xs text-muted">… continues</span>
    );
  }

  if (ending === "odd") {
    return (
      <span className="shrink-0 text-xs text-muted">… ends in a non-node</span>
    );
  }

  return (
    <span
      className="shrink-0 font-mono text-sm text-muted"
      title="The chain ends here — next is null"
    >
      ∅
    </span>
  );
}
