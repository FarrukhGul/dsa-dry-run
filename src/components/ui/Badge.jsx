/**
 * Badge — a small rounded label, used for things like "Free forever" or
 * marking which languages are ready yet.
 *
 *   <Badge>Coming soon</Badge>
 *   <Badge tone="brand">Ready</Badge>
 */

import { cx } from "../../lib/classNames.js";

const toneStyles = {
  /** Violet. Use to draw attention. */
  brand: "bg-brand-tint text-brand",

  /** Grey. Use for neutral information. */
  neutral: "bg-surface text-muted border border-border",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
