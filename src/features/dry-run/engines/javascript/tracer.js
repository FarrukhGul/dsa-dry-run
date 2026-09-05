/**
 * tracer.js — the notebook the rewritten code writes into.
 *
 * instrument.js turns your code into code that calls `step`, `enter`, `exit`
 * and `ret` as it runs. This file is what those calls land on. Every one of
 * them adds a line to the notebook, and the finished notebook is the dry run.
 *
 * WHAT A STEP LOOKS LIKE
 *
 *   {
 *     kind: "step",          // or "call" / "return"
 *     line: 7,               // the line about to run
 *     depth: 2,              // how deep in the call stack
 *     stack: [               // every frame, outermost first
 *       { name: "(main)",  line: 12, locals: { nums: {…} } },
 *       { name: "twoSum",  line: 7,  locals: { i: {…}, need: {…} } },
 *     ],
 *     outputCount: 1,        // console lines printed by this point
 *   }
 *
 * Because every value has been copied by snapshotValue, a step never changes
 * after it is written down. That is what lets you scrub backwards.
 */

import { LimitReachedError } from "../shared/limits.js";
import { formatForConsole, snapshotValue } from "../shared/snapshotValue.js";

/**
 * Creates a fresh notebook and the recorder that writes to it.
 *
 * @param {object} limits from limits.js
 */
/**
 * @param {object} limits from limits.js
 * @param {object} [options]
 * @param {boolean} [options.record] when false, run the code but write nothing
 *   down. This is "Run Code": we still count work, watch the clock and track
 *   which line we are on (so an error can still name its line), but we skip
 *   reading and copying every variable — which is where nearly all the time
 *   and memory of a dry run goes.
 */
export function createTracer(limits, { record = true } = {}) {
  const steps = [];
  const output = [];

  // The call stack. The last entry is the function currently running.
  const stack = [{ name: "(main)", line: 0, locals: {} }];

  const startedAt = Date.now();
  let stepCount = 0;
  let outputTruncated = false;

  /**
   * Counts one unit of work and stops the run if we have gone too far.
   *
   * The clock is only checked every 256 steps. `Date.now()` is cheap but not
   * free, and this runs tens of thousands of times.
   */
  function countWork() {
    stepCount += 1;

    if (stepCount > limits.maxSteps) {
      throw new LimitReachedError("step-limit");
    }

    if (stepCount % 256 === 0 && Date.now() - startedAt > limits.maxMilliseconds) {
      throw new LimitReachedError("time-limit");
    }
  }

  /**
   * Turns `{ i: () => i }` into `{ i: <snapshot> }`.
   *
   * Each name is read inside its own try/catch. Reading a `let` above its own
   * declaration line throws in JavaScript, and that is a normal thing to hit
   * while stepping — one such variable must not cost us the whole snapshot.
   */
  function readLocals(thunks) {
    const locals = {};

    for (const name of Object.keys(thunks)) {
      try {
        locals[name] = snapshotValue(thunks[name](), limits);
      } catch {
        // Not yet declared at this line, or a getter threw.
        locals[name] = { kind: "unavailable" };
      }
    }

    return locals;
  }

  /**
   * Writes one entry into the notebook.
   *
   * The stack is copied shallowly: each frame becomes a new small object, but
   * the `locals` object inside it is shared with the previous step until that
   * frame changes. Since `step` always assigns a brand-new locals object rather
   * than editing the old one, older entries can never be altered by later ones.
   */
  function write(kind, line, extra) {
    steps.push({
      kind,
      line,
      depth: stack.length,
      stack: stack.map((frame) => ({
        name: frame.name,
        line: frame.line,
        locals: frame.locals,
      })),
      outputCount: output.length,
      ...extra,
    });
  }

  function writeOutput(kind, args) {
    if (output.length >= limits.maxOutputLines) {
      if (!outputTruncated) {
        outputTruncated = true;
        output.push({ kind: "system", text: "… further output was cut off" });
      }
      return;
    }

    output.push({
      kind,
      text: args.map((arg) => formatForConsole(arg)).join(" "),
    });
  }

  /**
   * The object the rewritten code calls into. Its method names are the ones
   * hard-coded in instrument.js — renaming one means renaming it there too.
   */
  const runtime = {
    /** About to run `line`. These are the variables in scope right now. */
    step(line, thunks) {
      countWork();

      const frame = stack[stack.length - 1];
      frame.line = line;

      // Tracking the line is cheap and worth doing either way — it is what
      // lets an error say which line it happened on. Reading the variables is
      // the expensive part, so that is what gets skipped.
      if (!record) return;

      frame.locals = readLocals(thunks);
      write("step", line);
    },

    /**
     * A function is starting. `thunks` holds its parameters, so the very first
     * entry for a call already shows what it was called with.
     */
    enter(name, line, thunks) {
      countWork();

      if (stack.length >= limits.maxCallDepth) {
        throw new LimitReachedError("depth-limit");
      }

      stack.push({ name, line, locals: record ? readLocals(thunks) : {} });
      if (record) write("call", line);
    },

    /**
     * A function is finishing — for any reason, including a thrown error.
     * The rewritten code puts this in a `finally`, so it always runs.
     */
    exit() {
      if (stack.length > 1) stack.pop();
    },

    /**
     * A `return`. Records what came back, then hands the value straight
     * through so the program behaves exactly as it would have.
     */
    ret(line, ...rest) {
      countWork();

      const hasValue = rest.length > 0;
      const value = rest[0];

      stack[stack.length - 1].line = line;

      if (record) {
        write("return", line, {
          value: hasValue ? snapshotValue(value, limits) : { kind: "undefined" },
        });
      }

      return value;
    },
  };

  /** The `console` your code sees. It writes here, not to the real one. */
  const consoleShim = {
    log: (...args) => writeOutput("log", args),
    info: (...args) => writeOutput("log", args),
    warn: (...args) => writeOutput("warn", args),
    error: (...args) => writeOutput("error", args),
    debug: (...args) => writeOutput("log", args),
    table: (...args) => writeOutput("log", args),
  };

  return {
    runtime,
    console: consoleShim,
    steps,
    output,
    /** Where execution had reached — used to point at the line that failed. */
    currentLine: () => stack[stack.length - 1]?.line ?? 0,
    stepCount: () => stepCount,
  };
}
