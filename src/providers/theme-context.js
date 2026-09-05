/**
 * theme-context.js — the "box" that holds the current theme.
 *
 * This lives in its own file (separate from ThemeProvider.jsx) for one boring
 * but important reason: React's hot-reloading only works properly when a file
 * exports components OR plain values, not a mix of both.
 *
 * You almost never import this file directly. Use the `useTheme` hook instead:
 *   import { useTheme } from "../hooks/useTheme.js";
 */

import { createContext } from "react";

/**
 * The default value is only used if a component asks for the theme while
 * sitting outside of <ThemeProvider>. `useTheme` treats that as a mistake and
 * throws a helpful error, so these defaults are just a safety net.
 */
export const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});
