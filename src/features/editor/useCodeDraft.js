/**
 * useCodeDraft — holds the code you are writing, and remembers it.
 *
 * Two things worth knowing:
 *
 *   YOUR WORK IS SAVED AUTOMATICALLY. Close the tab, come back tomorrow, and
 *   your code is still there. It is saved in your own browser and sent nowhere.
 *
 *   EACH LANGUAGE KEEPS ITS OWN DRAFT. Switching from JavaScript to Python and
 *   back does not lose your JavaScript. That is why drafts are stored as an
 *   object keyed by language, rather than a single string.
 */

import { useCallback } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { DEFAULT_LANGUAGE_ID, getLanguage } from "./languages.js";
import { getTemplate } from "./templates.js";

/* Storage keys. The "dsa-dry-run:" prefix keeps our values from colliding with
   anything else stored on the same domain. */
const LANGUAGE_KEY = "dsa-dry-run:language";
const DRAFTS_KEY = "dsa-dry-run:drafts";

export function useCodeDraft() {
  const [savedLanguageId, setLanguageId] = useLocalStorage(
    LANGUAGE_KEY,
    DEFAULT_LANGUAGE_ID,
  );

  // Shaped like { javascript: "...", python: "..." }
  const [drafts, setDrafts] = useLocalStorage(DRAFTS_KEY, {});

  // Run the saved id through getLanguage, which falls back to the default if
  // the stored value is unknown. Storage is user-editable, so never trust it.
  const language = getLanguage(savedLanguageId);

  // No draft yet for this language? Show the starter template.
  const template = getTemplate(language.id);
  const code = drafts[language.id] ?? template;

  const setCode = useCallback(
    (nextCode) => {
      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [language.id]: nextCode,
      }));
    },
    [language.id, setDrafts],
  );

  const resetToTemplate = useCallback(() => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [language.id]: getTemplate(language.id),
    }));
  }, [language.id, setDrafts]);

  return {
    language,
    setLanguageId,
    code,
    setCode,
    resetToTemplate,

    // True when the code is still exactly the starter template, so the Reset
    // button can switch itself off — there would be nothing to reset.
    isUnchanged: code === template,
  };
}
