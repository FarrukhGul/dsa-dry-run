/*
 * theme-init.js — runs before the page draws anything.
 *
 * Why this exists:
 *   React takes a moment to start. Without this file, a visitor who prefers
 *   dark mode would see a white flash first. This script puts the right class
 *   on <html> immediately, so the very first paint is already correct.
 *
 * Why it is a separate file and not an inline <script> in index.html:
 *   Our Content Security Policy (see public/_headers) blocks inline scripts.
 *   That rule is what stops injected code from running, and it is worth more
 *   than the one saved request. This file is a few hundred bytes and cached.
 *
 * It deliberately repeats a little logic from src/app/providers/ThemeProvider.jsx.
 * If you change the storage key or the rules, change them in BOTH places.
 */

(function () {
  try {
    var saved = localStorage.getItem("dsa-dry-run:theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (saved === null && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch {
    /* Storage is blocked (private window, or cookies turned off).
       Falling back to light mode is fine — nothing breaks. */
  }
})();
