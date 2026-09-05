/**
 * useDryRunner — everything the dry run screen needs to know, in one hook.
 *
 * THE ONE IDEA WORTH UNDERSTANDING
 *
 * The whole run is recorded before you see anything. What you are looking at is
 * never live code — it is entry number `stepIndex` in a finished notebook.
 *
 * That is why stepping backwards is instant and free: nothing re-runs, we just
 * look at an earlier page. Everything on screen is worked out from
 * `steps[stepIndex]` and nothing else.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { runInSandbox } from "../sandbox/runInSandbox.js";

/** Milliseconds between steps when the run is playing itself. */
const PLAYBACK_SPEEDS = { slow: 700, normal: 300, fast: 90 };

export function useDryRunner() {
  const [status, setStatus] = useState("idle"); // idle | running | ready
  const [runningMode, setRunningMode] = useState(null); // which button is busy
  const [trace, setTrace] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");

  /*
   * Which run we are waiting for.
   *
   * Press Dry Run twice quickly and two workers are in flight. Without this,
   * the slower one could come back last and overwrite the newer result. Each
   * run takes a ticket, and a result is only accepted if its ticket is still
   * the current one.
   */
  const currentRunId = useRef(0);

  // useMemo so this is the same array between renders. Without it, `[]` would
  // be a brand-new array each time and everything downstream would recompute
  // on every render — which matters during playback.
  const steps = useMemo(() => trace?.steps ?? [], [trace]);
  const totalSteps = steps.length;

  const start = useCallback(async ({ source, languageId, mode }) => {
    const runId = ++currentRunId.current;

    setStatus("running");
    setRunningMode(mode);
    setIsPlaying(false);
    setTrace(null);
    setStepIndex(0);

    const result = await runInSandbox({ source, languageId, mode });

    // A newer run started while this one was working. Throw this away.
    if (runId !== currentRunId.current) return;

    setTrace(result);
    setStepIndex(0);
    setStatus("ready");
    setRunningMode(null);
  }, []);

  /** Record every step, so it can be stepped through afterwards. */
  const dryRun = useCallback(
    (request) => start({ ...request, mode: "dry-run" }),
    [start],
  );

  /** Just run it and show what it printed. */
  const runCode = useCallback(
    (request) => start({ ...request, mode: "run" }),
    [start],
  );

  /** Forget the current run — used when the code is edited underneath it. */
  const clear = useCallback(() => {
    currentRunId.current += 1;
    setTrace(null);
    setStatus("idle");
    setRunningMode(null);
    setStepIndex(0);
    setIsPlaying(false);
  }, []);

  const goTo = useCallback(
    (index) => {
      if (totalSteps === 0) return;
      // Clamp, so a stray keypress at either end simply does nothing.
      setStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [totalSteps],
  );

  const next = useCallback(() => goTo(stepIndex + 1), [goTo, stepIndex]);
  const previous = useCallback(() => goTo(stepIndex - 1), [goTo, stepIndex]);
  const first = useCallback(() => goTo(0), [goTo]);
  const last = useCallback(() => goTo(totalSteps - 1), [goTo, totalSteps]);

  const togglePlay = useCallback(() => {
    if (totalSteps === 0) return;
    setIsPlaying((playing) => !playing);
  }, [totalSteps]);

  // Playback. Advances one step per tick and stops itself at the end.
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return;

    const timer = setInterval(() => {
      setStepIndex((index) => {
        if (index >= totalSteps - 1) {
          setIsPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, PLAYBACK_SPEEDS[speed]);

    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps]);

  /*
   * Everything the screen shows, worked out from the current step.
   *
   * useMemo because this runs on every render, and playback re-renders many
   * times a second.
   */
  const view = useMemo(() => {
    const step = steps[stepIndex] ?? null;
    const stack = step?.stack ?? [];

    return {
      step,
      stack,

      /** The line to highlight in the editor. */
      activeLine: step?.line ?? null,

      /** The innermost function — the one actually running right now. */
      currentFrame: stack.length > 0 ? stack[stack.length - 1] : null,

      /**
       * Console output printed up to this point.
       *
       * Slicing by the count recorded on the step is what makes the console
       * rewind along with everything else, instead of showing the end state.
       */
      output: (trace?.output ?? []).slice(0, step?.outputCount ?? 0),
    };
  }, [steps, stepIndex, trace]);

  return {
    // What happened
    status,
    /** "dry-run" or "run" — which kind of result we are holding. */
    mode: trace?.mode ?? null,
    /** While running, which button is busy. */
    runningMode,
    trace,
    totalSteps,

    // Where we are
    stepIndex,
    ...view,

    // Playback
    isPlaying,
    speed,
    setSpeed,
    togglePlay,

    // Controls
    dryRun,
    runCode,
    clear,
    goTo,
    next,
    previous,
    first,
    last,
  };
}
