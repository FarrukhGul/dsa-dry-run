/**
 * limits.js — the guard rails every engine runs inside.
 *
 * We are about to execute code somebody pasted in. Most of it will be an
 * honest attempt at Two Sum, but some of it will have an infinite loop, and
 * some tiny fraction will be deliberately hostile. These numbers are what stops
 * any of that from freezing the browser tab.
 *
 * Every limit is deliberately generous for real DSA code and tight enough to
 * catch a runaway. If you find yourself raising one of these to make a normal
 * problem work, the engine has a bug — raising the limit is treating a symptom.
 */

export const DEFAULT_LIMITS = {
  /**
   * How many steps we record before giving up.
   *
   * A step is one executed line. Bubble-sorting 50 items is about 7,500 steps,
   * so this leaves plenty of headroom while catching `while (true)` quickly.
   */
  maxSteps: 20_000,

  /**
   * The same limit when we are only running the code, not recording it.
   *
   * "Run Code" throws nothing away as it goes, so the memory cost that makes
   * 20,000 the right number for a dry run does not apply. Real work — sorting
   * ten thousand items, say — needs millions of steps, and refusing to run it
   * would make the button useless. The clock below is the real guard here.
   */
  maxStepsWithoutRecording: 5_000_000,

  /**
   * How long the code may run, in milliseconds.
   *
   * The step counter catches most runaway loops, but not one whose body never
   * completes a statement. This is the backstop.
   */
  maxMilliseconds: 5_000,

  /**
   * How deep the call stack may get.
   *
   * Runaway recursion would otherwise hit the browser's own stack limit, which
   * gives a confusing error. This lets us say "too much recursion" plainly.
   */
  maxCallDepth: 200,

  /**
   * How deep into nested objects we look when recording a value.
   *
   * This has to be generous, because the structures worth drawing are deep by
   * nature: a linked list of twelve nodes is twelve levels of nesting, and a
   * balanced tree of fifteen nodes is four.
   *
   * Depth alone is a bad limit though — a wide tree twelve deep is thousands
   * of nodes. `maxValueNodes` below is the real guard; this just stops a
   * single long chain running away.
   */
  maxValueDepth: 12,

  /**
   * How many objects we visit in total while recording ONE value.
   *
   * This is the limit that actually protects us. Depth cannot bound the work,
   * because a structure can be wide as well as deep; a total budget can. It is
   * spent across the whole walk and refilled for the next variable.
   *
   * 300 comfortably covers any structure worth looking at on screen.
   */
  maxValueNodes: 300,

  /** How many array items or object keys we record before saying "and more". */
  maxValueItems: 100,

  /** How many characters of a long string we keep. */
  maxStringLength: 200,

  /** How many console lines we keep. */
  maxOutputLines: 200,
};

/**
 * Thrown when the code runs past one of the limits above.
 *
 * It is a distinct class so the runner can tell "your code ran too long" apart
 * from "your code has a bug in it" — those need very different messages.
 */
export class LimitReachedError extends Error {
  /**
   * @param {"step-limit"|"time-limit"|"depth-limit"} reason
   */
  constructor(reason) {
    super(`Dry run stopped: ${reason}`);
    this.name = "LimitReachedError";
    this.reason = reason;
  }
}
