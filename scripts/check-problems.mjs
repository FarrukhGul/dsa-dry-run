/**
 * check-problems.mjs — runs every solution in the library and checks it works.
 *
 * Run it with:  npm run check:problems
 *
 * WHY THIS EXISTS
 *
 * A library of worked solutions is only worth having if the solutions are
 * right. A subtly wrong one is worse than no solution at all: somebody
 * learning would step through it, see the wrong answer, and assume they had
 * misunderstood.
 *
 * So nothing is trusted. Every solution is executed by the real engine — the
 * same one the site uses — and its printed output compared against what the
 * problem says it should print.
 *
 * It also catches a second class of problem: a solution that is correct but
 * runs past the dry run step budget would be useless on the site, because it
 * could never be stepped through. That fails here too.
 */

import { PROBLEMS } from "../src/data/problems/index.js";
import { PROBLEM_COUNT } from "../src/data/problems/topics.js";
import { runJavaScript } from "../src/features/dry-run/engines/javascript/runJavaScript.js";

let passed = 0;
const failures = [];

for (const problem of PROBLEMS) {
  const result = runJavaScript(problem.solution);
  const printed = result.output.map((line) => line.text).join("\n");

  if (result.status !== "completed") {
    failures.push({
      problem,
      reason: `did not finish: ${result.status}`,
      detail: result.error?.message ?? "",
    });
    continue;
  }

  if (printed !== problem.expectedOutput) {
    failures.push({
      problem,
      reason: "wrong output",
      detail: `expected  ${problem.expectedOutput}\n         got       ${printed}`,
    });
    continue;
  }

  // A solution nobody can step through is no use on a site about stepping.
  if (result.steps.length === 0) {
    failures.push({ problem, reason: "recorded no steps", detail: "" });
    continue;
  }

  /*
   * The starter has to parse.
   *
   * It will not produce the right answer — the function is empty, that is the
   * point — but a starter with a syntax error in it would be handed to someone
   * as their blank page, which is a horrible first impression. So it is only
   * checked for parsing, never for output.
   */
  const starter = runJavaScript(problem.starter, { record: false });

  if (starter.status === "syntax-error") {
    failures.push({
      problem,
      reason: "the starter stub does not parse",
      detail: starter.error?.message ?? "",
    });
    continue;
  }

  passed++;
  console.log(
    `  ok   ${problem.topic.padEnd(18)} ${problem.title.padEnd(34)} ${String(result.steps.length).padStart(5)} steps${problem.hasStatement ? "" : "   (no statement yet)"}`,
  );
}

for (const failure of failures) {
  console.log(`\n  FAIL ${failure.problem.topic} / ${failure.problem.title}`);
  console.log(`       ${failure.reason}`);
  if (failure.detail) console.log(`       ${failure.detail}`);
}

// The footer shows this total without importing the library, so it is written
// down in topics.js. Check it has not drifted.
if (PROBLEM_COUNT !== PROBLEMS.length) {
  failures.push({
    problem: { topic: "library", title: "PROBLEM_COUNT" },
    reason: `topics.js says ${PROBLEM_COUNT} problems, but there are ${PROBLEMS.length}`,
    detail: "Update PROBLEM_COUNT in src/data/problems/topics.js.",
  });
}

const withStatements = PROBLEMS.filter((problem) => problem.hasStatement).length;

console.log(
  `\n${passed} of ${PROBLEMS.length} problems verified, ${failures.length} failed`,
);
console.log(
  `${withStatements} of ${PROBLEMS.length} have a full statement (description, examples, constraints, starter)\n`,
);

process.exit(failures.length === 0 ? 0 : 1);
