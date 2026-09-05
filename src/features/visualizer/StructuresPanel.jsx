/**
 * StructuresPanel — draws every structure the current function is holding.
 *
 * Primitives stay in the variables table below; anything with a shape to it —
 * an array, a map, a list, a tree — gets a picture here.
 *
 * Arrays also get their pointers drawn on them, which is why this panel needs
 * the whole set of variables rather than just the one it is drawing: `i` only
 * means something once you know which array it is indexing.
 */

import { PanelSection } from "../../components/ui/PanelSection.jsx";
import { StructureView } from "./StructureView.jsx";
import { SHAPE, SHAPE_LABELS, detectShape, isDrawable } from "./detectShape.js";
import { findPointers } from "./findPointers.js";

export function StructuresPanel({ frame, previousFrame }) {
  const locals = frame?.locals ?? {};

  const drawable = Object.entries(locals).filter(([, value]) =>
    isDrawable(value),
  );

  if (drawable.length === 0) return null;

  // Only compare against the previous step if it was the same function, or
  // every structure would look like it had just changed.
  const previousLocals =
    previousFrame && previousFrame.name === frame.name
      ? (previousFrame.locals ?? {})
      : {};

  return (
    <PanelSection title="Structures">
      <div className="space-y-4">
        {drawable.map(([name, value]) => {
          const shape = detectShape(value);

          // Pointers only make sense for a flat array of cells.
          const pointers =
            shape === SHAPE.ARRAY
              ? findPointers(locals, value.length, name)
              : null;

          return (
            <div key={name}>
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-mono text-[13px] text-brand">{name}</span>

                <span className="text-[11px] text-muted">
                  {SHAPE_LABELS[shape]}
                  {shape === SHAPE.ARRAY && ` · ${value.length} items`}
                </span>
              </div>

              <StructureView
                value={value}
                previousValue={previousLocals[name]}
                pointers={pointers}
              />
            </div>
          );
        })}
      </div>
    </PanelSection>
  );
}
