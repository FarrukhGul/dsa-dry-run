/**
 * languages.js — the languages the editor offers.
 *
 * Note the two different ideas here:
 *
 *   The EDITOR supports all of these today. You can type, get syntax colours,
 *   and paste code in any of them.
 *
 *   The DRY RUN ENGINE — the part that steps through your code — supports only
 *   the ones marked `canDryRun`. We would rather say "not yet" than show
 *   somebody a dry run that is subtly wrong.
 *
 * This file is pure data — it decides what the picker shows. The matching
 * syntax highlighting lives in editor-languages.js, keyed by the same `id`.
 */

export const LANGUAGES = [
  {
    id: "javascript",
    label: "JavaScript",
    canDryRun: true,
  },
  {
    id: "python",
    label: "Python",
    canDryRun: true,
  },
  {
    id: "cpp",
    label: "C++",
    canDryRun: false,
  },
  {
    id: "java",
    label: "Java",
    canDryRun: false,
  },
];

/** The language selected the very first time somebody opens the page. */
export const DEFAULT_LANGUAGE_ID = "javascript";

/**
 * Looks up one language by id.
 *
 * Falls back to the default rather than returning undefined, so an old or
 * hand-edited value in someone's browser storage can never break the page.
 *
 * @param {string} id
 * @returns {(typeof LANGUAGES)[number]}
 */
export function getLanguage(id) {
  return (
    LANGUAGES.find((language) => language.id === id) ??
    LANGUAGES.find((language) => language.id === DEFAULT_LANGUAGE_ID)
  );
}
