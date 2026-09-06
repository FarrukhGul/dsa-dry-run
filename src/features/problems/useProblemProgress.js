/**
 * useProblemProgress — remembers which problems you have attempted and solved.
 *
 * Saved in your own browser and nowhere else. There is no account, so there is
 * nothing to sign into and nothing to lose.
 *
 * TWO STATES, AND WHY "SOLVED" IS EARNED
 *
 *   attempted  you opened it in solve mode
 *   solved     your own code produced the right answer
 *
 * "Solved" is never a button you press. It is set only when your code is run
 * and its output matches what the problem expects — the same check the build
 * uses on our own solutions. A progress bar you can tick yourself measures
 * nothing; this one measures something real.
 *
 * Looking at the worked solution does not mark anything as solved either. That
 * is deliberate. There is no shame in reading it, but it is not the same thing.
 */

import { useCallback } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage.js";

const STORAGE_KEY = "dsa-dry-run:progress";

export const PROGRESS = {
  ATTEMPTED: "attempted",
  SOLVED: "solved",
};

export function useProblemProgress() {
  // Shaped like { "two-sum": "solved", "3sum": "attempted" }
  const [progress, setProgress] = useLocalStorage(STORAGE_KEY, {});

  const markAttempted = useCallback(
    (problemId) => {
      setProgress((current) => {
        // Never downgrade: solving it once is permanent.
        if (current[problemId] === PROGRESS.SOLVED) return current;

        return { ...current, [problemId]: PROGRESS.ATTEMPTED };
      });
    },
    [setProgress],
  );

  const markSolved = useCallback(
    (problemId) => {
      setProgress((current) => ({ ...current, [problemId]: PROGRESS.SOLVED }));
    },
    [setProgress],
  );

  const statusOf = useCallback(
    (problemId) => progress[problemId] ?? null,
    [progress],
  );

  /**
   * How many of a given list are solved and attempted.
   * Used for the bars on each topic and the ring at the top of the page.
   */
  const summarise = useCallback(
    (problems) => {
      let solved = 0;
      let attempted = 0;

      for (const problem of problems) {
        const status = progress[problem.id];
        if (status === PROGRESS.SOLVED) solved++;
        else if (status === PROGRESS.ATTEMPTED) attempted++;
      }

      return { solved, attempted, total: problems.length };
    },
    [progress],
  );

  const reset = useCallback(() => setProgress({}), [setProgress]);

  return { progress, statusOf, summarise, markAttempted, markSolved, reset };
}

/**
 * How many problems are solved, read straight from storage.
 *
 * A plain function rather than the hook, so app chrome like the footer can
 * show the number without subscribing to it — and, more importantly, without
 * importing the 150-problem library into the main bundle.
 */
export function readSolvedCount() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;

    return Object.values(JSON.parse(saved)).filter(
      (status) => status === PROGRESS.SOLVED,
    ).length;
  } catch {
    // Storage blocked or damaged. Zero is the honest answer.
    return 0;
  }
}
