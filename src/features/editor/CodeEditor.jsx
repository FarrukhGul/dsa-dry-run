/**
 * CodeEditor — the code editing area.
 *
 * A thin wrapper around CodeMirror. Everything specific to this app is here:
 * our colours, our font, and settings tuned for reading a short algorithm
 * rather than editing a large project.
 *
 * It is a "controlled" component, like a normal <input>: it does not hold the
 * code itself. It shows what you pass in and tells you when it changes.
 *
 * Why CodeMirror and not Monaco (the VS Code editor)? Monaco costs about
 * 980 KB compressed; this does the same job in a fraction of that. On a slow
 * phone connection that is the difference between the editor appearing in a
 * second and appearing in half a minute — and this app is meant to be usable
 * by everyone.
 */

import { useEffect, useMemo, useRef } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";

import { useTheme } from "../../hooks/useTheme.js";
import { activeLineHighlight, setActiveLine } from "./activeLineHighlight.js";
import { getLanguageExtension } from "./editor-languages.js";
import { darkEditorTheme, lightEditorTheme } from "./editor-themes.js";

/**
 * Which built-in editor features to switch on.
 *
 * Defined outside the component on purpose: a new object on every render would
 * make CodeMirror reconfigure itself constantly.
 */
const BASIC_SETUP = {
  lineNumbers: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,

  // Typing "(" gives you ")", and putting the cursor on one bracket highlights
  // its partner. Both quietly prevent a lot of beginner mistakes.
  closeBrackets: true,
  bracketMatching: true,

  // Suggests words already in your file. Cheap, and genuinely useful for long
  // variable names.
  autocompletion: true,

  // Selecting a word dims-in every other copy of it in the file.
  highlightSelectionMatches: true,

  // Ctrl+F / Cmd+F to search.
  searchKeymap: true,

  // Code folding is turned off: DSA solutions are short, and the extra gutter
  // arrows are just noise at this size.
  foldGutter: false,
};

/**
 * @param {object} props
 * @param {object} props.language    from features/editor/languages.js
 * @param {string} props.value       the code
 * @param {Function} props.onChange  called with the new code
 * @param {number|null} [props.activeLine] line to highlight while stepping
 */
export function CodeEditor({ language, value, onChange, activeLine = null }) {
  const { theme } = useTheme();

  // A handle on the live editor, so we can send it the active line without
  // rebuilding anything.
  const viewRef = useRef(null);

  // Rebuild the extension list only when the language changes — not on every
  // keystroke, which would reset the editor.
  const extensions = useMemo(
    () => [
      getLanguageExtension(language.id),

      // Long lines wrap instead of scrolling sideways. Easier on a laptop, and
      // much easier on a phone.
      EditorView.lineWrapping,

      activeLineHighlight,
    ],
    [language.id],
  );

  // Tell the editor which line is running, whenever that changes.
  useEffect(() => {
    viewRef.current?.dispatch({ effects: setActiveLine.of(activeLine) });
  }, [activeLine]);

  return (
    <CodeMirror
      value={value}
      // CodeMirror also passes details about the edit as a second argument.
      // We only care about the new text, so we drop it.
      onChange={(nextValue) => onChange(nextValue)}
      extensions={extensions}
      theme={theme === "dark" ? darkEditorTheme : lightEditorTheme}
      basicSetup={BASIC_SETUP}
      onCreateEditor={(view) => {
        viewRef.current = view;
      }}
      // Fills whatever box it is placed in. The parent sets the real height.
      height="100%"
      className="h-full text-[13px]"
    />
  );
}
