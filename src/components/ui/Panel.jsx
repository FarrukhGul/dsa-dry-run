/**
 * Panel — a bordered card that sits slightly above the page background.
 *
 * Used for feature cards on the home page and, later, for the boxes around the
 * editor, the variables table and the console.
 *
 *   <Panel>
 *     <h3>Call stack</h3>
 *   </Panel>
 */

import { cx } from "../../lib/classNames.js";

export function Panel({ className, children, ...rest }) {
  return (
    <div
      className={cx(
        "rounded-xl border border-border bg-raised shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
