/**
 * ThemeProvider — decides whether the app is in light or dark mode, and
 * remembers the choice for next time.
 *
 * The rules, in plain English:
 *   1. If the visitor has picked a theme before, use that.
 *   2. Otherwise, follow whatever their computer is set to.
 *   3. If they are following their computer and later change it, follow along.
 *
 * The actual switching is dead simple: we add or remove the class "dark" on the
 * <html> element. Every colour in the app is a CSS variable that changes with
 * that class, so one line flips the whole site. (See src/styles/theme.css.)
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { ThemeContext } from "./theme-context.js";

/** The key we save the choice under in the browser's storage. */
const STORAGE_KEY = "dsa-dry-run:theme";

/**
 * Reads the visitor's saved choice.
 * Returns "light", "dark", or null when they have never chosen.
 *
 * Storage can throw (private browsing, blocked cookies), so we guard it. A
 * broken theme memory should never crash the app.
 */
function readSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

/** Returns "dark" if the visitor's operating system is set to dark mode. */
function readSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Adds or removes the `dark` class on <html>. */
function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }) {
  // Work out the starting theme once, before the first render, so the page
  // never flashes the wrong colours.
  const [theme, setThemeState] = useState(
    () => readSavedTheme() ?? readSystemTheme(),
  );

  // Whenever the theme changes, paint it on the page and save the choice.
  useEffect(() => {
    applyTheme(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Saving failed (storage blocked or full). The theme still works for
      // this visit, it just won't be remembered. Not worth bothering the user.
    }
  }, [theme]);

  // If the visitor has never picked a theme, keep following their computer.
  useEffect(() => {
    if (readSavedTheme() !== null) return;

    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemChange(event) {
      setThemeState(event.matches ? "dark" : "light");
    }

    systemPreference.addEventListener("change", handleSystemChange);
    return () =>
      systemPreference.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = useCallback((next) => {
    if (next !== "light" && next !== "dark") return;
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  // `useMemo` keeps this object identical between renders, so components that
  // read the theme don't re-render for no reason.
  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
