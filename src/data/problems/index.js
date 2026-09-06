/**
 * index.js — the whole problem library, assembled.
 *
 * Problems live in one file per pattern. This file stitches them together and
 * stamps each one with the topic it came from, so a problem never has to
 * repeat its own topic id — the file it lives in already says that.
 *
 * ADDING A PROBLEM
 *   1. Add it to the right topic file, with a `solution` that ends in a
 *      console.log and an `expectedOutput` saying what that should print.
 *   2. Run `npm run check:problems`. It executes every solution through the
 *      real engine and compares. A wrong solution fails there rather than
 *      surprising whoever opens it.
 */

import { advancedGraphs } from "./advanced-graphs.js";
import { arraysHashing } from "./arrays-hashing.js";
import { backtracking } from "./backtracking.js";
import { bitManipulation } from "./bit-manipulation.js";
import { binarySearch } from "./binary-search.js";
import { dp1d } from "./dp-1d.js";
import { dp2d } from "./dp-2d.js";
import { graphs } from "./graphs.js";
import { greedy } from "./greedy.js";
import { intervals } from "./intervals.js";
import { mathGeometry } from "./math-geometry.js";
import { heap } from "./heap.js";
import { linkedList } from "./linked-list.js";
import { slidingWindow } from "./sliding-window.js";
import { stack } from "./stack.js";
import { STATEMENTS } from "./statements/index.js";
import { TOPICS } from "./topics.js";
import { trees } from "./trees.js";
import { tries } from "./tries.js";
import { twoPointers } from "./two-pointers.js";

/** Which list belongs to which topic. Add a line here per new topic file. */
const BY_TOPIC = {
  "arrays-hashing": arraysHashing,
  "two-pointers": twoPointers,
  "sliding-window": slidingWindow,
  stack,
  "binary-search": binarySearch,
  "linked-list": linkedList,
  trees,
  tries,
  heap,
  backtracking,
  graphs,
  "advanced-graphs": advancedGraphs,
  "dp-1d": dp1d,
  "dp-2d": dp2d,
  greedy,
  intervals,
  "math-geometry": mathGeometry,
  "bit-manipulation": bitManipulation,
};

/**
 * Every problem, in topic order, each carrying its topic id.
 *
 * Built from TOPICS rather than from the object above, so the order on screen
 * always matches the learning order in topics.js.
 */
export const PROBLEMS = TOPICS.flatMap((topic) =>
  (BY_TOPIC[topic.id] ?? []).map((problem) => {
    const statement = STATEMENTS[problem.id] ?? null;

    return {
      ...problem,
      ...statement,
      topic: topic.id,

      // Lower-cased on the way through. These are hand-typed across eighteen
      // files, and "Medium" slipping in next to "medium" should not quietly
      // split one filter into two.
      difficulty: String(problem.difficulty).toLowerCase(),

      // Whether the full statement has been written yet. The dialog uses this
      // to decide what it can honestly offer.
      hasStatement: statement !== null,

      // Solve mode always has something to open, even before a proper starter
      // is written for a problem.
      starter: statement?.starter ?? fallbackStarter(problem),
    };
  }),
);

/**
 * A minimal stub for a problem whose starter has not been written yet.
 *
 * Deliberately empty rather than clever: guessing a function signature from
 * the solution would sometimes guess wrong, and a misleading stub is worse
 * than a blank page.
 */
function fallbackStarter(problem) {
  return `// ${problem.title}\n// ${problem.summary}\n\n// Write your solution here.\n`;
}

/** One problem by id, or null. Used when opening /dry-run?problem=two-sum */
export function getProblem(id) {
  return PROBLEMS.find((problem) => problem.id === id) ?? null;
}

/**
 * The problems grouped under their topic, skipping topics with none yet.
 *
 * Returns `{ topic, problems }` pairs so the page can render a heading and its
 * list together without looking anything up.
 */
export function problemsByTopic() {
  return TOPICS.map((topic) => ({
    topic,
    problems: PROBLEMS.filter((problem) => problem.topic === topic.id),
  })).filter((group) => group.problems.length > 0);
}
