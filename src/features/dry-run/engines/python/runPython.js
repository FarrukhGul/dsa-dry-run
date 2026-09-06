/**
 * runPython.js — the JavaScript half of the Python engine.
 *
 * It starts CPython, hands it your code and our recorder, and gets the same
 * trace back that the JavaScript engine produces. Everything downstream — the
 * variables panel, the diagrams, the call stack, the narration — then works
 * on Python without knowing anything about it.
 *
 * WHY THIS IS REAL PYTHON
 *
 * Pyodide is CPython itself, compiled to WebAssembly. So it is not an
 * approximation of Python that agrees with it most of the time: integers are
 * arbitrary precision, dicts keep insertion order, and every quirk you have
 * learned still holds. For a teaching tool that matters more than the download.
 *
 * THE DOWNLOAD IS THE PRICE
 *
 * That runtime is about 6 MB compressed. It is fetched only when someone
 * actually runs Python, cached by the browser afterwards, and never touches
 * anyone who stays in JavaScript. It is the honest cost of real semantics —
 * the alternative is a look-alike interpreter that would eventually lie.
 */

import { loadPyodide } from "pyodide";

import { DEFAULT_LIMITS } from "../shared/limits.js";
import { PYTHON_TRACER } from "./tracerSource.js";

/**
 * Where Pyodide's WebAssembly and standard library live.
 *
 * Served from our own domain rather than a CDN, so the Content Security Policy
 * never has to trust someone else's server. `npm run sync:pyodide` copies them
 * into public/pyodide/.
 */
const DEFAULT_INDEX_URL = "/pyodide/";

/**
 * Started once and reused.
 *
 * Booting CPython takes a couple of seconds, and doing that per run would make
 * stepping through a problem unbearable. The worker is thrown away after each
 * run anyway, so a stale interpreter can never leak between runs.
 */
let runtime = null;

export function loadPythonRuntime(indexURL = DEFAULT_INDEX_URL) {
  if (runtime === null) {
    runtime = loadPyodide({ indexURL });
  }
  return runtime;
}

/**
 * Dry runs a piece of Python.
 *
 * Never throws — every outcome comes back as a result object with a `status`,
 * exactly like the JavaScript engine.
 *
 * @param {string} source the code as typed
 * @param {object} [options]
 * @param {boolean} [options.record] true for a dry run, false for Run Code
 * @param {object} [options.limits] overrides for testing
 * @param {string} [options.indexURL] where Pyodide's files are served from
 */
export async function runPython(
  source,
  { record = true, limits = DEFAULT_LIMITS, indexURL = DEFAULT_INDEX_URL } = {},
) {
  let python;

  try {
    python = await loadPythonRuntime(indexURL);
  } catch (problem) {
    return failure(
      `Python could not start: ${problem?.message ?? problem}. It is about 6 MB, so a slow or interrupted connection is the usual cause.`,
    );
  }

  // Run Code keeps nothing, so the cap that protects a dry run's memory does
  // not apply — the clock is the guard there instead. Same rule as JavaScript.
  const effectiveLimits = record
    ? limits
    : { ...limits, maxSteps: limits.maxStepsWithoutRecording };

  try {
    python.globals.set("_source", source);
    python.globals.set("_limits", JSON.stringify(effectiveLimits));
    python.globals.set("_record", record);

    python.runPython(PYTHON_TRACER);

    return JSON.parse(python.globals.get("_result"));
  } catch (problem) {
    // The tracer catches everything your code can do, so reaching here means
    // the engine itself broke rather than your program.
    return failure(`The Python engine hit a problem: ${problem?.message ?? problem}`);
  }
}

function failure(message) {
  return {
    status: "error",
    steps: [],
    output: [],
    stepCount: 0,
    error: { message, line: null },
  };
}
