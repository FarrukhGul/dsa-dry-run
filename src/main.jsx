/**
 * main.jsx — where the app starts.
 *
 * It wraps <App /> in three layers, outermost first:
 *
 *   StrictMode     a development-only helper that warns about risky patterns
 *   ThemeProvider  supplies light/dark mode to everything inside it
 *   BrowserRouter  makes the URL bar work (back button, links, /dry-run, ...)
 *
 * Order matters: the router is inside the theme provider so that pages can read
 * the theme.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { ThemeProvider } from "./providers/ThemeProvider.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
