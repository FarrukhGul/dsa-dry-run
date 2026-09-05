/**
 * narrateStep.js — says what just happened, in words.
 *
 * A variables table tells you `i = 3`. It does not tell you that `i` was 2 a
 * moment ago and the loop has moved on. That gap is the whole reason people
 * dry run on paper: they are narrating to themselves as they go. This does the
 * narrating.
 *
 * WHICH MOMENT IS BEING DESCRIBED
 *
 * A step is recorded *before* its line runs. So the difference between the
 * previous step and this one is the work the PREVIOUS line did. That is what
 * gets narrated — "what just happened" — while the violet highlight in the
 * editor shows what is about to happen next. Press Next and the sentence tells
 * you what the line you just left actually did.
 *
 * WHY IT RETURNS TOKENS, NOT A STRING
 *
 * `i goes from 2 to 3` reads far better when the names and values are styled
 * differently from the prose. So this returns small labelled pieces and lets
 * the component decide how to draw them.
 *
 *   [ {t:"name", v:"i"}, {t:"text", v:" goes from "}, {t:"value", v:"2"}, … ]
 */

import { snapshotToText } from "../../lib/formatSnapshot.js";

/** Values longer than this are described rather than printed. */
const MAX_VALUE_LENGTH = 40;

/** How many changes we spell out before summarising the rest. */
const MAX_CHANGES = 3;

const text = (v) => ({ t: "text", v });
const name = (v) => ({ t: "name", v });
const value = (v) => ({ t: "value", v });

/**
 * The sentence for one step.
 *
 * @param {object} options
 * @param {object} options.step          the step being shown
 * @param {object|null} options.previousStep  the one before it
 * @param {string[]} options.sourceLines the code, split into lines
 * @returns {Array<{t: string, v: string}>} tokens to render
 */
export function narrateStep({ step, previousStep, sourceLines = [] }) {
  if (!step) return [];

  if (step.kind === "call") return narrateCall(step);
  if (step.kind === "return") return narrateReturn(step);

  const changes = findChanges(step, previousStep);

  if (changes.length > 0) return narrateChanges(changes);

  // Nothing visible changed, so fall back to describing the line itself.
  return narrateLine(step, sourceLines);
}

/* ------------------------------------------------------------------ */

function narrateCall(step) {
  const frame = step.stack[step.stack.length - 1];
  if (!frame) return [text("A function was called.")];

  // At the moment of a call the frame holds only the parameters, which is
  // exactly what "called with…" wants to list.
  const parameters = Object.entries(frame.locals ?? {});

  if (parameters.length === 0) {
    return [text("Called "), name(frame.name), text(" with no arguments.")];
  }

  const tokens = [text("Called "), name(frame.name), text(" with ")];

  parameters.forEach(([parameterName, parameterValue], index) => {
    if (index > 0) {
      tokens.push(text(index === parameters.length - 1 ? " and " : ", "));
    }
    tokens.push(name(parameterName), text(" = "), value(describe(parameterValue)));
  });

  tokens.push(text("."));
  return tokens;
}

function narrateReturn(step) {
  const frame = step.stack[step.stack.length - 1];
  const functionName = frame?.name ?? "the function";

  if (!step.value || step.value.kind === "undefined") {
    return [name(functionName), text(" finished without returning a value.")];
  }

  return [
    name(functionName),
    text(" returned "),
    value(describe(step.value)),
    text("."),
  ];
}

function narrateChanges(changes) {
  const shown = changes.slice(0, MAX_CHANGES);
  const tokens = [];

  shown.forEach((change, index) => {
    if (index > 0) {
      tokens.push(text(index === shown.length - 1 ? ", and " : ", "));
    }

    if (change.kind === "new") {
      tokens.push(name(change.name), text(" starts at "), value(change.after));
      return;
    }

    // A structure that changed shape is not worth printing twice over — the
    // diagram above already shows it, and the sentence should stay a sentence.
    if (change.isBig) {
      tokens.push(name(change.name), text(" was updated"));
      return;
    }

    tokens.push(
      name(change.name),
      text(" goes from "),
      value(change.before),
      text(" to "),
      value(change.after),
    );
  });

  const remaining = changes.length - shown.length;
  if (remaining > 0) {
    tokens.push(text(`, and ${remaining} more`));
  }

  tokens.push(text("."));
  return tokens;
}

/**
 * When nothing changed, say what the line is about to do.
 *
 * Deliberately vague where being specific would mean guessing: we say
 * "checking a condition" rather than claiming to know whether it is true,
 * because we do not — the next step is what reveals that.
 */
function narrateLine(step, sourceLines) {
  const line = (sourceLines[step.line - 1] ?? "").trim();

  const description = describeLineSyntax(line);
  if (description) return [text(description)];

  if (line) {
    // Drop a trailing `;` or `{` before quoting the code, so the sentence does
    // not end up with two full stops: "Running seen.set(a, b);." reads badly.
    const quoted = line.replace(/[;{]\s*$/, "").trim();
    return [text("Running "), value(shorten(quoted)), text(".")];
  }

  return [text(`Running line ${step.line}.`)];
}

function describeLineSyntax(line) {
  if (/^if\s*\(/.test(line)) return "Checking a condition.";
  if (/^else\s+if\s*\(/.test(line)) return "Checking the next condition.";
  if (/^else\b/.test(line)) return "Taking the other branch.";
  if (/^for\s*\(/.test(line)) return "Starting a loop.";
  if (/^while\s*\(/.test(line)) return "Checking whether the loop keeps going.";
  if (/^do\b/.test(line)) return "Starting a loop.";
  if (/^switch\s*\(/.test(line)) return "Choosing a branch.";
  if (/^case\b/.test(line)) return "Trying this case.";
  if (/^return\b/.test(line)) return "About to return.";
  if (/^break\b/.test(line)) return "Leaving the loop.";
  if (/^continue\b/.test(line)) return "Skipping to the next turn of the loop.";
  if (/^throw\b/.test(line)) return "Throwing an error.";
  if (/^console\.(log|info|warn|error|debug)/.test(line)) {
    return "Printing to the console.";
  }
  if (/^try\b/.test(line)) return "Trying something that might fail.";
  if (/^catch\b/.test(line)) return "Handling the error.";
  if (/^\}/.test(line)) return "Finishing a block.";

  return null;
}

/* ------------------------------------------------------------------ */

/**
 * Which variables differ between two steps, within the same function call.
 *
 * Comparing across a call boundary would report every variable as changed, so
 * it returns nothing in that case.
 */
function findChanges(step, previousStep) {
  const depth = step.stack.length - 1;
  const frame = step.stack[depth];
  const previousFrame = previousStep?.stack?.[depth];

  if (!frame || !previousFrame || previousFrame.name !== frame.name) return [];

  const changes = [];

  for (const [variableName, current] of Object.entries(frame.locals ?? {})) {
    const before = previousFrame.locals?.[variableName];

    // The tracer reuses the same object when a frame's variables are untouched,
    // so an identical reference means nothing changed. Cheap and exact.
    if (before === current) continue;

    if (before === undefined) {
      changes.push({
        name: variableName,
        kind: "new",
        after: describe(current),
      });
      continue;
    }

    const beforeText = snapshotToText(before);
    const afterText = snapshotToText(current);
    if (beforeText === afterText) continue;

    changes.push({
      name: variableName,
      kind: "changed",
      before: shorten(beforeText),
      after: shorten(afterText),
      isBig:
        beforeText.length > MAX_VALUE_LENGTH ||
        afterText.length > MAX_VALUE_LENGTH,
    });
  }

  return changes;
}

function describe(snapshot) {
  return shorten(snapshotToText(snapshot));
}

function shorten(string) {
  return string.length > MAX_VALUE_LENGTH
    ? `${string.slice(0, MAX_VALUE_LENGTH)}…`
    : string;
}
