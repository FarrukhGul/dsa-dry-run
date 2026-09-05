/**
 * useTheme — lets any component read or change the light/dark theme.
 *
 * Example:
 *   const { theme, toggleTheme } = useTheme();
 *   <button onClick={toggleTheme}>Currently {theme}</button>
 */

import { useContext } from "react";

import { ThemeContext } from "../providers/theme-context.js";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme() was called outside of <ThemeProvider>. " +
        "Wrap your app in <ThemeProvider> in src/main.jsx.",
    );
  }

  return context;
}
