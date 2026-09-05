/**
 * Container — keeps content centred and stops it stretching too wide on big
 * monitors. Wrap page sections in it so every page lines up the same way.
 *
 *   <Container>Reading-width content</Container>
 *   <Container size="wide">The dry run screen</Container>
 */

import { cx } from "../../lib/classNames.js";

const sizeStyles = {
  /** Comfortable reading width. Use for almost everything. */
  default: "max-w-6xl",

  /** Nearly full width. Use for tool screens that need the room. */
  wide: "max-w-[1600px]",
};

export function Container({ size = "default", className, children }) {
  return (
    <div
      className={cx("mx-auto w-full px-5 sm:px-8", sizeStyles[size], className)}
    >
      {children}
    </div>
  );
}
