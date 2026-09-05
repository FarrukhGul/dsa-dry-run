/**
 * cx — joins CSS class names together, skipping anything falsy.
 *
 * It exists so we can write conditional classes without messy string maths:
 *
 *   cx("rounded-lg px-4", isActive && "bg-brand", isDisabled && "opacity-50")
 *
 * When `isActive` is false, that value is simply left out.
 *
 * @param {...(string|false|null|undefined)} classNames
 * @returns {string}
 */
export function cx(...classNames) {
  return classNames.filter(Boolean).join(" ");
}
