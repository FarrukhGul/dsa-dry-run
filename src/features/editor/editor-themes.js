/**
 * editor-themes.js — makes the code editor match the rest of the app.
 *
 * CodeMirror's default look would clash badly with our violet, hand-drawn
 * styling. These two themes fix that: one for light mode, one for dark.
 *
 * A theme has two halves:
 *   `settings`  the editor chrome — background, gutter, cursor, selection
 *   `styles`    the code itself — what colour a keyword or a string gets
 *
 * ⚠ THE COLOURS BELOW ARE COPIES.
 * The editor is drawn on a canvas-like surface that cannot read CSS variables,
 * so the values from src/styles/theme.css have to be repeated here as plain
 * hex. If you change a colour there, change it here too. The comment beside
 * each one says which variable it mirrors.
 */

import { tags } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

const FONT_FAMILY =
  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const lightEditorTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff", // --raised
    foreground: "#1b1b1f", // --text
    caret: "#6965db", // --brand
    selection: "#e3e2fe",
    selectionMatch: "#f1f0ff", // --brand-tint
    lineHighlight: "#f8f9fa", // --surface
    gutterBackground: "#ffffff", // --raised
    gutterForeground: "#adb5bd",
    gutterActiveForeground: "#6965db", // --brand
    gutterBorder: "transparent",
    fontFamily: FONT_FAMILY,
  },
  styles: [
    { tag: tags.comment, color: "#6b6b75", fontStyle: "italic" }, // --muted
    { tag: [tags.keyword, tags.controlKeyword], color: "#6965db" }, // --brand
    { tag: [tags.string, tags.special(tags.string)], color: "#1a7f64" },
    { tag: [tags.number, tags.bool, tags.null], color: "#b8590a" },
    { tag: [tags.function(tags.variableName)], color: "#0b6bcb" },
    { tag: [tags.typeName, tags.className], color: "#5b57d1" }, // --brand-hover
    { tag: tags.operator, color: "#6b6b75" },
    { tag: tags.propertyName, color: "#1b1b1f" },
  ],
});

export const darkEditorTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#232329", // --raised
    foreground: "#ced4da", // --text
    caret: "#a8a5ff", // --brand
    selection: "#3a3a55",
    selectionMatch: "#30303a", // --brand-tint
    lineHighlight: "#2a2a31",
    gutterBackground: "#232329", // --raised
    gutterForeground: "#5a5a66",
    gutterActiveForeground: "#a8a5ff", // --brand
    gutterBorder: "transparent",
    fontFamily: FONT_FAMILY,
  },
  styles: [
    { tag: tags.comment, color: "#8a8a94", fontStyle: "italic" }, // --muted
    { tag: [tags.keyword, tags.controlKeyword], color: "#a8a5ff" }, // --brand
    { tag: [tags.string, tags.special(tags.string)], color: "#6cc79b" },
    { tag: [tags.number, tags.bool, tags.null], color: "#e0a86a" },
    { tag: [tags.function(tags.variableName)], color: "#7ab8f5" },
    { tag: [tags.typeName, tags.className], color: "#bcb9ff" }, // --brand-hover
    { tag: tags.operator, color: "#8a8a94" },
    { tag: tags.propertyName, color: "#ced4da" },
  ],
});
