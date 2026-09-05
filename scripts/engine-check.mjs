/**
 * engine-check.mjs — exercises the dry run engine outside the browser.
 *
 * Run it with:  npm run check:engine
 *
 * The engine rewrites code and then executes it, which is the most fragile
 * thing in this project: a mistake here does not throw, it quietly produces a
 * trace that is subtly wrong — and a wrong dry run is worse than no dry run.
 * So every awkward case that has ever caught us out gets a check here.
 *
 * Run it after touching anything in features/dry-run/engines/.
 */

import { runJavaScript } from "../src/features/dry-run/engines/javascript/runJavaScript.js";
import { narrateStep } from "../src/features/dry-run/narrateStep.js";
import { SHAPE, detectShape } from "../src/features/visualizer/detectShape.js";
import { findPointers } from "../src/features/visualizer/findPointers.js";

let passed = 0;
let failed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name} ${detail}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

/* ------------------------------------------------------------------ */
section("1. Two Sum — the real template");

const twoSum = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
twoSum([3, 1, 4, 1, 5], 9);`;

const r1 = runJavaScript(twoSum);
check("status completed", r1.status === "completed", r1.status);
check("recorded steps", r1.steps.length >= 18, `got ${r1.steps.length}`);

const returns = r1.steps.filter((s) => s.kind === "return");
const finalReturn = returns[0];
check("recorded a return", !!finalReturn);
check(
  "returned [2, 4]",
  finalReturn?.value?.kind === "array" &&
    finalReturn.value.items.map((i) => i.value).join(",") === "2,4",
  JSON.stringify(finalReturn?.value),
);

const insideFn = r1.steps.find((s) => s.depth === 2);
check("call stack has 2 frames inside the function", !!insideFn);
check(
  "frame named twoSum",
  insideFn?.stack[1]?.name === "twoSum",
  insideFn?.stack[1]?.name,
);

const withNeed = r1.steps.find((s) => s.stack[1]?.locals?.need?.kind === "number");
check("captured `need` as a number", !!withNeed);
check(
  "captured `seen` as a Map",
  r1.steps.some((s) => s.stack[1]?.locals?.seen?.kind === "map"),
);

/* ------------------------------------------------------------------ */
section("2. Runaway loops are stopped");

const r2 = runJavaScript("let n = 0;\nwhile (true) { n++; }");
check("while(true){} hits step limit", r2.status === "step-limit", r2.status);

const r3 = runJavaScript("while (true);");
check("while(true); with EMPTY body hits step limit", r3.status === "step-limit", r3.status);

const r4 = runJavaScript("function f() { return f(); }\nf();");
check("runaway recursion hits depth limit", r4.status === "depth-limit", r4.status);

/* ------------------------------------------------------------------ */
section("3. Callbacks still behave (the generator trap)");

const r5 = runJavaScript(`const arr = [5, 3, 8, 1];
arr.sort((a, b) => a - b);
console.log(arr);`);
check("sort with arrow callback completed", r5.status === "completed", r5.status);
check(
  "array actually sorted",
  r5.output[0]?.text === "[1, 3, 5, 8]",
  JSON.stringify(r5.output[0]?.text),
);

const r6 = runJavaScript(`function double(n) { return n * 2; }
console.log([1, 2, 3].map(double));`);
check("map with a named function", r6.output[0]?.text === "[2, 4, 6]", r6.output[0]?.text);

const r7 = runJavaScript(`console.log([1,2,3,4].filter(n => n % 2 === 0).reduce((a, b) => a + b, 0));`);
check("filter + reduce chain", r7.output[0]?.text === "6", r7.output[0]?.text);

/* ------------------------------------------------------------------ */
section("4. Recursion is traced");

const r8 = runJavaScript(`function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(6));`);
check("fib(6) completed", r8.status === "completed", r8.status);
check("fib(6) === 8", r8.output[0]?.text === "8", r8.output[0]?.text);
const deepest = Math.max(...r8.steps.map((s) => s.depth));
check("stack got deeper than 3", deepest > 3, `deepest ${deepest}`);

/* ------------------------------------------------------------------ */
section("5. Errors are reported, not thrown");

const r9 = runJavaScript("const x = 1;\nx.foo.bar;");
check("runtime error caught", r9.status === "error", r9.status);
check("has a message", !!r9.error?.message, r9.error?.message);
check("has a line number", r9.error?.line === 2, `line ${r9.error?.line}`);

const r10 = runJavaScript("function ( {");
check("syntax error caught", r10.status === "syntax-error", r10.status);
check("syntax error has line", r10.error?.line === 1, `line ${r10.error?.line}`);

/* ------------------------------------------------------------------ */
section("6. Awkward values");

const r11 = runJavaScript(`const a = { name: "a" };
a.self = a;
console.log("done");`);
check("circular object does not hang", r11.status === "completed", r11.status);
const circularStep = r11.steps.find((s) => s.stack[0].locals.a?.kind === "object");
check("cycle recorded without hanging", !!circularStep);

const r12 = runJavaScript(`let later = 5;\nconsole.log(later);`);
check(
  "a let is absent before its own line",
  !("later" in r12.steps[0].stack[0].locals),
  JSON.stringify(Object.keys(r12.steps[0].stack[0].locals)),
);
check(
  "and present with its value afterwards",
  r12.steps[1].stack[0].locals.later?.value === 5,
  JSON.stringify(r12.steps[1].stack[0].locals.later),
);

const r13 = runJavaScript(`function f({ left, right }, [first, ...rest]) {
  return left + right + first + rest.length;
}
console.log(f({ left: 1, right: 2 }, [3, 4, 5]));`);
check("destructured params work", r13.output[0]?.text === "8", r13.output[0]?.text);
// The "call" entry is the moment the function is entered, so it should already
// carry the arguments it was called with.
const callEntry = r13.steps.find((s) => s.kind === "call");
check(
  "the call entry shows the destructured arguments",
  callEntry &&
    "left" in callEntry.stack[1].locals &&
    "rest" in callEntry.stack[1].locals,
  JSON.stringify(Object.keys(callEntry?.stack[1].locals ?? {})),
);
check(
  "argument values are right",
  callEntry?.stack[1].locals.left?.value === 1 &&
    callEntry?.stack[1].locals.rest?.length === 2,
  JSON.stringify(callEntry?.stack[1].locals.rest),
);

/* ------------------------------------------------------------------ */
section("7. Loops and structures");

const r14 = runJavaScript(`const out = [];
for (const ch of "abc") { out.push(ch); }
console.log(out.join(""));`);
check("for...of works", r14.output[0]?.text === "abc", r14.output[0]?.text);

const r15 = runJavaScript(`class Node {
  constructor(v) { this.value = v; this.next = null; }
}
const head = new Node(1);
head.next = new Node(2);
console.log(head.next.value);`);
check("classes work", r15.status === "completed", r15.status);
check("class output", r15.output[0]?.text === "2", r15.output[0]?.text);
const headStep = r15.steps.at(-1);
check(
  "linked node recorded with class name",
  headStep.stack[0].locals.head?.className === "Node",
  JSON.stringify(headStep.stack[0].locals.head?.className),
);

const r16 = runJavaScript(`let total = 0;
try { throw new Error("boom"); }
catch (err) { total = 1; }
finally { total += 1; }
console.log(total);`);
check("try/catch/finally", r16.output[0]?.text === "2", r16.output[0]?.text);

const r17 = runJavaScript(`function grade(n) {
  switch (n) {
    case 1: return "one";
    default: return "many";
  }
}
console.log(grade(1), grade(9));`);
check("switch works", r17.output[0]?.text === "one many", r17.output[0]?.text);

/* ------------------------------------------------------------------ */
section("8. Hidden globals");

const r18 = runJavaScript(`typeof fetch === "undefined" ? console.log("blocked") : console.log("REACHABLE");`);
check("fetch is hidden from user code", r18.output[0]?.text === "blocked", r18.output[0]?.text);

/* ------------------------------------------------------------------ */
section("9. Deep structures reach far enough to draw");

/** Follows `.next` through a recorded value and counts how many nodes we got. */
function chainLength(snapshot) {
  let count = 0;
  let current = snapshot;

  while (current && current.kind === "object") {
    count++;
    const next = current.entries.find(([key]) => key === "next");
    current = next ? next[1] : null;
  }

  return count;
}

const r19 = runJavaScript(`function Node(v) { this.value = v; this.next = null; }
let head = new Node(0);
let tail = head;
for (let i = 1; i < 12; i++) { tail.next = new Node(i); tail = tail.next; }
console.log("built");`);

const headStep19 = r19.steps.at(-1);
check("12-node linked list is walked end to end",
  chainLength(headStep19.stack[0].locals.head) >= 12,
  `reached ${chainLength(headStep19.stack[0].locals.head)} nodes`);

const r20 = runJavaScript(`function Node(v) { this.value = v; this.left = null; this.right = null; }
function build(depth) {
  if (depth === 0) return null;
  const node = new Node(depth);
  node.left = build(depth - 1);
  node.right = build(depth - 1);
  return node;
}
const root = build(6);
console.log("built");`);
check("a 63-node tree completes", r20.status === "completed", r20.status);

// A structure far bigger than the budget must still finish quickly rather than
// walking forever — the node budget is what guarantees that.
const wideStart = Date.now();
const r21 = runJavaScript(`const rows = [];
for (let i = 0; i < 300; i++) rows.push({ a: { b: { c: i } } });
console.log(rows.length);`);
const wideMs = Date.now() - wideStart;
check("300 nested objects complete", r21.status === "completed", r21.status);
check("and do so quickly (node budget holds)", wideMs < 4000, `took ${wideMs}ms`);
check("output still correct", r21.output[0]?.text === "300", r21.output[0]?.text);

/* ------------------------------------------------------------------ */
section("10. The visualiser reads those structures correctly");

const r22 = runJavaScript(`const nums = [3, 1, 4];
const grid = [[1, 2], [3, 4]];
const seen = new Map([["a", 1]]);
const tags = new Set([1, 2]);
function Node(v) { this.value = v; this.next = null; }
const list = new Node(1);
list.next = new Node(2);
function TreeNode(v) { this.value = v; this.left = null; this.right = null; }
const tree = new TreeNode(1);
tree.left = new TreeNode(2);
let i = 1;
let total = 2;
console.log("ready");`);

check("sample program ran", r22.status === "completed", r22.status);

const finalLocals = r22.steps.at(-1).stack[0].locals;

const expectedShapes = [
  ["nums", SHAPE.ARRAY],
  ["grid", SHAPE.MATRIX],
  ["seen", SHAPE.MAP],
  ["tags", SHAPE.SET],
  ["list", SHAPE.LINKED_LIST],
  ["tree", SHAPE.TREE],
  ["i", SHAPE.PRIMITIVE],
];

for (const [name, expected] of expectedShapes) {
  const actual = detectShape(finalLocals[name]);
  check(`${name} reads as ${expected}`, actual === expected, `got ${actual}`);
}

// Pointers: `i` is an index name holding 1, so it belongs on cell 1.
// `total` is also 2 and in range, but its name is not an index name — drawing
// it on a cell would be a confidently wrong picture, so it must be ignored.
const pointers = findPointers(finalLocals, 3, "nums");
check("`i` is found as a pointer at cell 1", pointers.get(1)?.includes("i"), JSON.stringify([...pointers]));
check("`total` is NOT treated as a pointer", ![...pointers.values()].flat().includes("total"), JSON.stringify([...pointers]));

const r23 = runJavaScript(`const nums = [1, 2, 3, 4];
let left = 0;
let right = nums.length;
console.log("ready");`);
const bounds = r23.steps.at(-1).stack[0].locals;
const boundPointers = findPointers(bounds, 4, "nums");
check("a pointer parked one past the end is kept", boundPointers.get(4)?.includes("right"), JSON.stringify([...boundPointers]));
check("and left sits on cell 0", boundPointers.get(0)?.includes("left"), JSON.stringify([...boundPointers]));

/* ------------------------------------------------------------------ */
section("11. The narration says the right thing");

/** Renders the narrator's tokens back into a plain sentence, for comparing. */
const toSentence = (tokens) => tokens.map((token) => token.v).join("");

const twoSumLines = twoSum.split("\n");
const sentences = r1.steps.map((step, index) =>
  toSentence(
    narrateStep({
      step,
      previousStep: r1.steps[index - 1] ?? null,
      sourceLines: twoSumLines,
    }),
  ),
);

check(
  "describes the call with its arguments",
  sentences.includes("Called twoSum with nums = [3, 1, 4, 1, 5] and target = 9."),
  sentences.find((s) => s.startsWith("Called")),
);
check(
  "describes the return value",
  sentences.includes("twoSum returned [2, 4]."),
  sentences.find((s) => s.includes("returned")),
);
check(
  "describes a variable being declared",
  sentences.some((s) => /^need starts at 6\./.test(s)),
  sentences.find((s) => s.includes("starts at")),
);
check(
  "describes a variable changing",
  sentences.some((s) => s.includes("i goes from 0 to 1")),
  sentences.find((s) => s.includes("goes from")),
);
check("every step got a sentence", sentences.every((s) => s.length > 0));

// When nothing changed, the line's own syntax is described instead.
const quietStep = {
  kind: "step",
  line: 1,
  stack: [{ name: "(main)", line: 1, locals: {} }],
};
check(
  "falls back to describing the line",
  toSentence(
    narrateStep({
      step: quietStep,
      previousStep: { ...quietStep, line: 0 },
      sourceLines: ["if (x > 1) {"],
    }),
  ) === "Checking a condition.",
);
check(
  "and knows a loop from a condition",
  toSentence(
    narrateStep({
      step: quietStep,
      previousStep: { ...quietStep, line: 0 },
      sourceLines: ["for (let i = 0; i < n; i++) {"],
    }),
  ) === "Starting a loop.",
);

// A big structure should be summarised, not printed into the middle of a
// sentence — the diagram above already shows it.
const bigBefore = { kind: "step", line: 2, stack: [{ name: "f", line: 2, locals: { rows: { kind: "array", length: 0, items: [] } } }] };
const bigAfter = {
  kind: "step",
  line: 3,
  stack: [{ name: "f", line: 3, locals: { rows: { kind: "array", length: 12, items: Array.from({ length: 12 }, (_, n) => ({ kind: "number", value: n * 1111 })) } } }],
};
check(
  "summarises a large structure instead of printing it",
  toSentence(narrateStep({ step: bigAfter, previousStep: bigBefore, sourceLines: [] })) ===
    "rows was updated.",
  toSentence(narrateStep({ step: bigAfter, previousStep: bigBefore, sourceLines: [] })),
);

/* ------------------------------------------------------------------ */
section("12. Run Code mode (record: false)");

const runOnly = (code) => runJavaScript(code, { record: false });

const r24 = runOnly(`const nums = [5, 3, 8];
nums.sort((a, b) => a - b);
console.log(nums.join(","));`);
check("output is captured", r24.output[0]?.text === "3,5,8", r24.output[0]?.text);
check("no steps are recorded", r24.steps.length === 0, `${r24.steps.length} steps`);
check("but work is still counted", r24.stepCount > 0, `${r24.stepCount}`);

// The dry run step cap is 20,000. Run Code must not be held to it, or the
// button would be useless for any real workload.
const heavy = `let total = 0;
for (let i = 0; i < 200000; i++) { total += i; }
console.log(total);`;

const r25 = runOnly(heavy);
check("a 200k-iteration loop completes", r25.status === "completed", r25.status);
check("with the right answer", r25.output[0]?.text === "19999900000", r25.output[0]?.text);
check("and used far more than the dry run cap", r25.stepCount > 20000, `${r25.stepCount}`);

const r26 = runJavaScript(heavy);
check("the same loop DOES hit the cap when recording", r26.status === "step-limit", r26.status);

// Errors must be just as good without recording — same engine, same lines.
const r27 = runOnly(`const x = 1;
x.foo.bar;`);
check("runtime errors still caught", r27.status === "error", r27.status);
check("with the correct line number", r27.error?.line === 2, `line ${r27.error?.line}`);
check("and a real message", /TypeError/.test(r27.error?.message ?? ""), r27.error?.message);

const r28 = runOnly("function ( {");
check("syntax errors still caught", r28.status === "syntax-error", r28.status);

// The clock is the guard in this mode, not the step count.
const r29 = runOnly("while (true) {}");
check(
  "an endless loop is still stopped",
  r29.status === "time-limit" || r29.status === "step-limit",
  r29.status,
);

/* ------------------------------------------------------------------ */
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
