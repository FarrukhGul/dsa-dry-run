/**
 * VariablesPanel — every variable in the selected function, at this step.
 *
 * The one thing that makes this more than a table: a variable whose value just
 * changed is marked. When you are hunting for why a loop went wrong, "which of
 * these moved on this line" is almost always the question you are asking.
 *
 * The comparison is done on the rendered text rather than the raw values.
 * A recorded value is a nested description, so comparing them properly would
 * mean a deep walk on every render — and the text is what you are looking at
 * anyway, so if it reads the same, nothing visibly changed.
 */

import { PanelSection } from "../../../components/ui/PanelSection.jsx";
import { ValueView } from "../../../components/ui/ValueView.jsx";
import { cx } from "../../../lib/classNames.js";
import { snapshotToText } from "../../../lib/formatSnapshot.js";
import { isDrawable } from "../../visualizer/detectShape.js";

export function VariablesPanel({ frame, previousFrame }) {
  const locals = frame?.locals ?? {};

  // Arrays, maps, lists and trees are drawn in the Structures panel above, so
  // listing them here as text too would just be saying everything twice. This
  // panel takes what is left: the plain values.
  const names = Object.keys(locals).filter((name) => !isDrawable(locals[name]));

  if (names.length === 0) {
    const hasStructures = Object.keys(locals).length > 0;

    return (
      <PanelSection title="Variables">
        <p className="text-xs leading-relaxed text-muted">
          {hasStructures
            ? "No plain values here — everything in scope is drawn above."
            : "Nothing in scope here yet — a variable appears from the line that declares it onwards."}
        </p>
      </PanelSection>
    );
  }

  // Only compare against the previous step if it was the same function.
  // Comparing across a call boundary would light up every row at once.
  const comparable =
    previousFrame && previousFrame.name === frame.name
      ? (previousFrame.locals ?? {})
      : null;

  return (
    <PanelSection title="Variables">
      <dl className="space-y-1">
        {names.map((name) => {
          const value = locals[name];

          const isNew = comparable !== null && !(name in comparable);
          const hasChanged =
            comparable !== null &&
            name in comparable &&
            snapshotToText(comparable[name]) !== snapshotToText(value);

          return (
            <div
              key={name}
              className={cx(
                "flex items-baseline gap-2 rounded px-2 py-1 text-[13px] transition-colors",
                hasChanged || isNew ? "bg-brand-tint" : "",
              )}
            >
              <dt className="shrink-0 font-mono text-brand">{name}</dt>

              <dd className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="text-muted">=</span>
                <ValueView value={value} />

                {(isNew || hasChanged) && (
                  <span className="ml-auto shrink-0 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-medium text-brand-contrast">
                    {isNew ? "new" : "changed"}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </PanelSection>
  );
}
