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
 * One request from the page: some code, and which language it is.
 * We answer with exactly one message, then the page throws this thread away.
 */
self.onmessage = (event) => {
  const { requestId, languageId, source, mode = "dry-run" } = event.data ?? {};

  try {
    if (languageId !== "javascript") {
      self.postMessage({
        requestId,
        result: {
          mode,
          status: "unsupported",
          steps: [],
          output: [],
          stepCount: 0,
          error: {
            message: `The engine for ${languageId} is not built yet. JavaScript is the one that works today.`,
            line: null,
          },
        },
      });
      return;
    }

    // "dry-run" writes down every step; "run" just runs it and collects the
    // output. Same engine either way — see runJavaScript.js.
    const result = runJavaScript(source, { record: mode === "dry-run" });

    self.postMessage({ requestId, result: { ...result, mode } });
  } catch (thrown) {
    // Reaching here means the engine itself broke, not the user's code —
    // runJavaScript is supposed to turn every failure into a result. Report it
    // as an error rather than letting the thread die silently.
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
