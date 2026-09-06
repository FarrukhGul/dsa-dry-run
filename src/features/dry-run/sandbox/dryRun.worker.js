/**
 * dryRun.worker.js — the isolated box your code actually runs in.
 *
 * This file does not run on the page. It runs on a separate background thread
 * with its own private world, and it talks to the page only by passing
 * messages back and forth. That separation is the whole point.
 *
 * WHAT A WORKER CANNOT REACH
 *
 *   The page          no document, no DOM, no access to anything on screen
 *   Your saved work   localStorage simply does not exist on this thread, so
 *                     pasted code cannot read the drafts you have saved
 *   Cookies           not available here either
 *
 * WHAT ELSE HOLDS IT IN
 *
 *   The kill switch   the page can terminate this thread at any moment, which
 *                     is how an infinite loop gets stopped for certain
 *   The limits        the engine counts steps and watches the clock (limits.js)
 *   Hidden globals    fetch, WebSocket and friends are shadowed before your
 *                     code sees them (runJavaScript.js)
 *   A tighter CSP     this file is served with its own Content Security Policy
 *                     that permits no network connections at all — see
 *                     public/_headers
 *
 * The everything-else caveat is written out honestly in README.md next door.
 */

import { runJavaScript } from "../engines/javascript/runJavaScript.js";

/**
 * Picks the engine for a language and runs it.
 *
 * Python is imported only when it is asked for. That import pulls in Pyodide's
 * loader, and someone who only ever writes JavaScript should not pay for it.
 */
async function runInLanguage(languageId, source, mode) {
  const record = mode === "dry-run";

  if (languageId === "javascript") {
    return runJavaScript(source, { record });
  }

  if (languageId === "python") {
    const { runPython } = await import("../engines/python/runPython.js");
    return runPython(source, { record });
  }

  return {
    status: "unsupported",
    steps: [],
    output: [],
    stepCount: 0,
    error: {
      message: `The engine for ${languageId} is not built yet. JavaScript and Python are the ones that work today.`,
      line: null,
    },
  };
}

/**
 * One request from the page: some code, which language it is, and whether to
 * record every step. We answer with exactly one message, then the page throws
 * this thread away.
 */
self.onmessage = async (event) => {
  const { requestId, languageId, source, mode = "dry-run" } = event.data ?? {};

  try {
    const result = await runInLanguage(languageId, source, mode);
    self.postMessage({ requestId, result: { ...result, mode } });
  } catch (thrown) {
    // Reaching here means the engine itself broke, not the user's code — each
    // engine is supposed to turn every failure into a result. Report it rather
    // than letting the thread die silently.
    self.postMessage({
      requestId,
      result: {
        mode,
        status: "error",
        steps: [],
        output: [],
        stepCount: 0,
        error: {
          message: `The engine hit a problem: ${thrown?.message ?? thrown}`,
          line: null,
        },
      },
    });
  }
};
