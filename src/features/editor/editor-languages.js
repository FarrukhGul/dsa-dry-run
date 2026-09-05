/**
 * editor-languages.js — connects our language ids to CodeMirror's grammars.
 *
 * Each grammar teaches the editor how to read one language: where the keywords
 * are, where a string starts and ends, how to indent a new line. That is what
 * turns plain text into coloured, foldable code.
 *
 * Adding a language takes three steps:
 *   1. npm install @codemirror/lang-<name>
 *   2. add it to the table below
 *   3. add an entry in languages.js so it shows up in the picker
 */

import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

/*
 * Each grammar is built ONCE, here, rather than every time the editor renders.
 *
 * This matters: CodeMirror compares extensions by identity, so handing it a
 * freshly-built grammar on each render would make it tear down and rebuild the
 * whole document — losing your cursor position and undo history as it went.
 */
const LANGUAGE_EXTENSIONS = {
  javascript: javascript(),
  python: python(),
  cpp: cpp(),
  java: java(),
};

/**
 * The CodeMirror grammar for one of our languages.
 *
 * @param {string} languageId one of the ids in languages.js
 * @returns the grammar, or an empty list (plain text) if we have none
 */
export function getLanguageExtension(languageId) {
  return LANGUAGE_EXTENSIONS[languageId] ?? [];
}
