/**
 * useLocalStorage — like useState, but the value survives a page refresh.
 *
 *   const [code, setCode] = useLocalStorage("my-key", "");
 *
 * It behaves exactly like useState, including updater functions:
 *   setCode((previous) => previous + "!");
 *
 * Every read and write is wrapped in try/catch. Browser storage can fail — a
 * private window, cookies switched off, or a full quota — and losing a saved
 * draft should never take the whole page down with it.
 */

import { useCallback, useEffect, useState } from "react";

/**
 * Reads and parses a saved value.
 * @param {string} key
 * @param {*} fallback used when nothing is saved, or the saved text is damaged
 */
function readFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return fallback;

    return JSON.parse(saved);
  } catch {
    // Either storage is blocked, or someone hand-edited the value into
    // something that is not valid JSON. Start fresh instead of crashing.
    return fallback;
  }
}

export function useLocalStorage(key, initialValue) {
  // The function form of useState means we only touch storage on the first
  // render, not on every single one.
  const [value, setValue] = useState(() => readFromStorage(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Out of space, or storage is blocked. The app keeps working for this
      // visit — the value just will not be there next time.
    }
  }, [key, value]);

  // useCallback keeps this function stable between renders, so components that
  // receive it do not re-render for no reason.
  const setStoredValue = useCallback((next) => {
    setValue(next);
  }, []);

  return [value, setStoredValue];
}
