/**
 * ValueView — shows one recorded value, coloured by what kind of thing it is.
 *
 * SAFETY NOTE
 * The text goes through React as text. There is no `innerHTML` in this file,
 * and there must never be — this displays the output of code a stranger wrote,
 * so a value like `<img onerror=…>` has to stay a string of characters and
 * never become markup.
 *
 * Phase 4 replaces this with real diagrams: arrays as cells, linked lists as
 * boxes and arrows. This is the readable text version until then.
 */

import { cx } from "../../lib/classNames.js";
import { snapshotToText } from "../../lib/formatSnapshot.js";

/** Colour by kind, so numbers and strings are tellable apart at a glance. */
const kindStyles = {
  number: "text-[#b8590a] dark:text-[#e0a86a]",
  string: "text-[#1a7f64] dark:text-[#6cc79b]",
  boolean: "text-brand",
  null: "text-muted",
  undefined: "text-muted",
  unavailable: "text-muted italic",
  circular: "text-muted italic",
  function: "text-muted",
};

export function ValueView({ value, className }) {
  return (
    <span
      className={cx(
        "font-mono break-all",
        kindStyles[value?.kind] ?? "text-text",
        className,
      )}
    >
      {snapshotToText(value)}
    </span>
  );
}
