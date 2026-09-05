/**
 * runJavaScript.js — takes your code in, hands a finished trace back.
 *
 * Three steps: rewrite the code, run the rewritten version, return the
 * notebook. Everything that can go wrong is caught and reported as data, so
 * this function never throws at its caller.
 *
 * ⚠ THIS FILE EXECUTES CODE SOMEBODY ELSE WROTE.
 * It is only ever called from inside a Web Worker — see the sandbox folder for
 * what that does and does not protect. Do not import it on the main thread.
 */

import { DEFAULT_LIMITS, LimitReachedError } from "../shared/limits.js";
import { RUNTIME_NAME, instrumentJavaScript } from "./instrument.js";
import { createTracer } from "./tracer.js";

/**
 * Globals we hide from the running code.
 *
 * Listing a name as a parameter of the wrapper function shadows the real
 * global inside it, so `fetch(...)` finds our `undefined` instead of the real
 * one and fails immediately.
 *
 * This is a convenience, not the wall. The wall is the worker and the Content
 * Security Policy; this just closes the obvious doors so a mistake cannot
 * quietly reach the network while you are stepping through a sort.
 */
const HIDDEN_GLOBALS = [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "EventSource",
  "importScripts",
  "indexedDB",
  "caches",
  "navigator",
  "self",
  "globalThis",
  "postMessage",
  "Worker",
];

/**
 * Runs a piece of JavaScript, either recording every step or not.
 *
 * The two modes share one code path on purpose. "Run Code" is not a separate,
 * simpler engine — it is the same rewritten code with the notebook switched
 * off. So an error reports the same line in both, and the two can never
 * disagree about what your program does.
 *
 * @param {string} source the code as typed
 * @param {object} [options]
 * @param {boolean} [options.record] true for a dry run, false for Run Code
 * @param {object} [options.limits] overrides for testing; defaults in limits.js
 * @returns {{
 *   status: "completed"|"step-limit"|"time-limit"|"depth-limit"|"syntax-error"|"error",
 *   steps: Array, output: Array, error: object|null, stepCount: number
 * }}
 */
export function runJavaScript(
  source,
  { record = true, limits = DEFAULT_LIMITS } = {},
) {
  // --- 1. Rewrite -------------------------------------------------------
  let instrumented;

  try {
    instrumented = instrumentJavaScript(source);
  } catch (error) {
    // The code did not parse. This is by far the most common failure, and the
    // message is genuinely useful, so pass it along with its line number.
    return {
      status: "syntax-error",
      steps: [],
      output: [],
      stepCount: 0,
      error: {
        message: cleanSyntaxMessage(error.message),
        line: error.loc?.line ?? null,
      },
    };
  }

  // --- 2. Run -----------------------------------------------------------
  //
  // Run Code keeps nothing, so the step cap that protects a dry run's memory
  // does not apply. Sorting ten thousand items is millions of steps, and
  // refusing to do it would make the button pointless. The clock still holds.
  const effectiveLimits = record
    ? limits
    : { ...limits, maxSteps: limits.maxStepsWithoutRecording };

  const tracer = createTracer(effectiveLimits, { record });

  let status = "completed";
  let error = null;

  try {
    // `new Function` compiles the rewritten source. It is the one place in the
    // app that turns text into running code, which is why the worker it runs
    // in is the only thing allowed to do so — see public/_headers.
    const wrapper = new Function(
      RUNTIME_NAME,
      "console",
      ...HIDDEN_GLOBALS,
      instrumented,
    );

    wrapper(tracer.runtime, tracer.console);
  } catch (thrown) {
    if (thrown instanceof LimitReachedError) {
      // Not a bug in their code — it ran too long, or too deep.
      status = thrown.reason;
    } else {
      status = "error";
      error = {
        message: describeThrownValue(thrown),
        line: tracer.currentLine(),
      };
    }
  }

  // --- 3. Hand back the notebook ---------------------------------------
  return {
    status,
    steps: tracer.steps,
    output: tracer.output,
    stepCount: tracer.stepCount(),
    error,
  };
}

/**
 * Acorn's messages end with "(3:11)", repeating a line and column we already
 * show separately. Trim it.
 */
function cleanSyntaxMessage(message) {
  return String(message).replace(/\s*\(\d+:\d+\)\s*$/, "");
}

/** Anything can be thrown in JavaScript, not just Errors. */
function describeThrownValue(thrown) {
  if (thrown instanceof Error) {
    return `${thrown.name}: ${thrown.message}`;
  }

  try {
    return `Threw a value that was not an Error: ${String(thrown)}`;
  } catch {
    return "Threw a value that could not be described";
  }
}
