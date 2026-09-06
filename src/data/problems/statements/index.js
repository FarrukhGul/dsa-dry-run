/**
 * statements/index.js — every problem statement, keyed by problem id.
 *
 * The files next door hold the questions: what a problem asks, worked
 * examples, constraints, and the starter stub you get in "solve it myself"
 * mode. The solution files one folder up hold the answers.
 *
 * They are kept apart on purpose. The whole point of solve mode is being able
 * to read the question without seeing the answer, so the two never sit in the
 * same file.
 *
 * Any problem without an entry still works — it falls back to its one-line
 * summary and a blank starter, and `npm run check:problems` reports how many
 * are done.
 */

import { advancedGraphsStatements } from "./advanced-graphs.js";
import { arraysHashingStatements } from "./arrays-hashing.js";
import { backtrackingStatements } from "./backtracking.js";
import { binarySearchStatements } from "./binary-search.js";
import { bitManipulationStatements } from "./bit-manipulation.js";
import { dp1dStatements } from "./dp-1d.js";
import { dp2dStatements } from "./dp-2d.js";
import { graphsStatements } from "./graphs.js";
import { greedyStatements } from "./greedy.js";
import { heapStatements } from "./heap.js";
import { intervalsStatements } from "./intervals.js";
import { linkedListStatements } from "./linked-list.js";
import { mathGeometryStatements } from "./math-geometry.js";
import { slidingWindowStatements } from "./sliding-window.js";
import { stackStatements } from "./stack.js";
import { treesStatements } from "./trees.js";
import { triesStatements } from "./tries.js";
import { twoPointersStatements } from "./two-pointers.js";

/** Merged into the problems by data/problems/index.js. */
export const STATEMENTS = {
  ...arraysHashingStatements,
  ...twoPointersStatements,
  ...slidingWindowStatements,
  ...stackStatements,
  ...binarySearchStatements,
  ...linkedListStatements,
  ...treesStatements,
  ...triesStatements,
  ...heapStatements,
  ...backtrackingStatements,
  ...graphsStatements,
  ...advancedGraphsStatements,
  ...dp1dStatements,
  ...dp2dStatements,
  ...greedyStatements,
  ...intervalsStatements,
  ...mathGeometryStatements,
  ...bitManipulationStatements,
};
