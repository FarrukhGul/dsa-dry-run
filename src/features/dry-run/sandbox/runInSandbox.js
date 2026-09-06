/**
 * runInSandbox.js — the page's side of the conversation with the worker.
 *
 * Call it with some code, get a trace back. Everything unpleasant — starting
 * the thread, waiting, giving up, cleaning up — is handled in here.
 *
 * A FRESH THREAD EVERY TIME
 *
 * Each run starts a new worker and throws it away afterwards. Reusing one
 * would be faster, but it would also let one run leave things behind for the
 * next: a global variable, a monkey-patched Array.prototype, a half-finished
 * timer. Starting clean costs a few milliseconds and removes that whole class
 * of confusing bug.
 *
 * THE Hard DEADLINE
 *
 * The engine watches its own step count and clock, so it normally stops
 * itself. This timeout is the backstop for the case where it cannot — and
 * `worker.terminate()` is not a polite request. It stops the thread mid-
 * instruction, which is exactly what you want when something has run away.
 */

/**
 * How long we wait before killing the thread, in milliseconds.
 *
 * Comfortably longer than the engine's own 5 second limit, so that a normal
 * "your code ran too long" result gets a chance to come back with its trace
 * intact. This only fires when the engine itself has failed to stop.
 */
const Hard_DEADLINE_MS = 8_000;

let nextRequestId = 1;

/**
 * Dry runs code on a background thread.
 *
 * Never rejects — every outcome, including a crash or a timeout, comes back as
 * a result object with a `status`. Callers have one thing to check, not two.
 *
 * @param {object} request
 * @param {string} request.source
 * @param {string} request.languageId
 * @param {"dry-run"|"run"} [request.mode] record every step, or just run it
 * @returns {Promise<object>} the result
 */
export function runInSandbox({ source, languageId, mode = "dry-run" }) {
  return new Promise((resolve) => {
    const requestId = nextRequestId++;

    // `new URL(..., import.meta.url)` is how the bundler is told "this file is
    // a worker" — it gets built as its own separate script.
    const worker = new Worker(new URL("./dryRun.worker.js", import.meta.url), {
      type: "module",
    });

    let finished = false;

    /** Resolve once, and make sure the thread is gone. */
    function finish(result) {
      if (finished) return;
      finished = true;

      clearTimeout(deadline);
      worker.terminate();
      resolve(result);
    }

    const deadline = setTimeout(() => {
      finish({
        mode,
        status: "time-limit",
        steps: [],
        output: [],
        stepCount: 0,
        error: {
          message:
            "Your code was still running after 8 seconds, so it was stopped. This usually means a loop that never ends.",
          line: null,
        },
      });
    }, Hard_DEADLINE_MS);

    worker.onmessage = (event) => {
      // Ignore anything that is not the answer we asked for.
      if (event.data?.requestId !== requestId) return;
      finish(event.data.result);
    };

    worker.onerror = (event) => {
      finish({
        mode,
        status: "error",
        steps: [],
        output: [],
        stepCount: 0,
        error: {
          message: `The run could not start: ${event.message ?? "unknown problem"}`,
          line: null,
        },
      });
    };

    worker.postMessage({ requestId, source, languageId, mode });
  });
}
