/**
 * Button — the only button in the app.
 *
 * Two things to know:
 *
 * 1. `variant` picks how it looks, `size` picks how big it is. Both are just
 *    lookups in the tables below, so adding a new style means adding one line.
 *
 * 2. If you pass a `to` prop it renders a router link that LOOKS like a button.
 *    Use `to` for navigation, `onClick` for actions.
 *
 *   <Button to="/dry-run">Start a dry run</Button>
 *   <Button variant="secondary" onClick={reset}>Reset</Button>
 */

import { Link } from "react-router-dom";

import { cx } from "../../lib/classNames.js";

/** Styles shared by every button, whatever its variant. */
const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-colors duration-150 select-none " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variantStyles = {
  /** Filled violet. Use for the single most important action on a screen. */
  primary: "bg-brand text-brand-contrast hover:bg-brand-hover shadow-card",

  /** Outlined. Use for secondary actions sitting next to a primary one. */
  secondary:
    "bg-raised text-text border border-border hover:border-brand hover:text-brand",

  /** No background until hovered. Use for toolbars and quiet links. */
  ghost: "text-muted hover:text-text hover:bg-surface",
};

const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  to,
  className,
  children,
  ...rest
}) {
  const styles = cx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={styles} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    // `type="button"` stops the button from accidentally submitting a form.
    // Anything passed in `rest` can still override it.
    <button type="button" className={styles} {...rest}>
      {children}
    </button>
  );
}
