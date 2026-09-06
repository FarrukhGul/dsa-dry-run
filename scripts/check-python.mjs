/**
 * check-python.mjs — exercises the Python engine outside the browser.
 *
 * Run it with:  npm run check:python
 *
 * Pyodide runs under Node as well as in a browser, which is the only reason
 * this file can exist — and it is worth a great deal. The Python engine can be
 * verified rather than hoped about, the same way the JavaScript one is.
 */

import { runPython } from "../src/features/dry-run/engines/python/runPython.js";

// Under Node the runtime comes from node_modules; in the browser it is served
// from /pyodide/.
const indexURL = "./node_modules/pyodide/";

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

const printed = (result) => result.output.map((line) => line.text).join("\n");

console.log("\nStarting CPython…");

/* ------------------------------------------------------------------ */
console.log("\n1. A real program, traced");

const twoSum = `def two_sum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        need = target - value
        if need in seen:
            return [seen[need], i]
        seen[value] = i
    return []

print(two_sum([2, 7, 11, 15], 9))`;

const r1 = await runPython(twoSum, { indexURL });
check("completed", r1.status === "completed", r1.status);
check("printed the right answer", printed(r1) === "[0, 1]", printed(r1));
check("recorded steps", r1.steps.length > 10, `got ${r1.steps.length}`);

const inside = r1.steps.find((s) => s.depth === 2);
check("call stack has two frames inside the function", !!inside);
check("frame named two_sum", inside?.stack[1]?.name === "two_sum", inside?.stack[1]?.name);
check(
  "captured seen as a dict",
  r1.steps.some((s) => s.stack[1]?.locals?.seen?.kind === "map"),
);
check(
  "captured nums as a list",
  r1.steps.some((s) => s.stack[1]?.locals?.nums?.kind === "array"),
);

const returned = r1.steps.find((s) => s.kind === "return" && s.value?.kind === "array");
check(
  "recorded the returned list",
  returned?.value?.items?.map((i) => i.value).join(",") === "0,1",
  JSON.stringify(returned?.value),
);

/* ------------------------------------------------------------------ */
console.log("\n2. Python is really Python");

const r2 = await runPython("print(2 ** 100)", { indexURL });
check(
  "arbitrary precision integers",
  printed(r2) === "1267650600228229401496703205376",
  printed(r2),
);

const r3 = await runPython("print(7 // 2, -7 // 2, 7 % 3, -7 % 3)", { indexURL });
check("floor division and modulo follow Python", printed(r3) === "3 -4 1 2", printed(r3));

const r4 = await runPython("print([x * x for x in range(5) if x % 2 == 0])", { indexURL });
check("list comprehensions", printed(r4) === "[0, 4, 16]", printed(r4));

/* ------------------------------------------------------------------ */
console.log("\n3. Runaway code is stopped");

const r5 = await runPython("while True:\n    x = 1", { indexURL });
check("endless loop hits the step limit", r5.status === "step-limit", r5.status);

const r6 = await runPython("def f():\n    return f()\nf()", { indexURL });
check("runaway recursion is stopped", r6.status === "depth-limit", r6.status);

/* ------------------------------------------------------------------ */
console.log("\n4. Errors are reported, not thrown");

const r7 = await runPython("x = 1\nx.nope", { indexURL });
check("runtime error caught", r7.status === "error", r7.status);
check("names the error", /AttributeError/.test(r7.error?.message ?? ""), r7.error?.message);
check("has a line number", r7.error?.line === 2, `line ${r7.error?.line}`);

const r8 = await runPython("def broken(\n", { indexURL });
check("syntax error caught", r8.status === "syntax-error", r8.status);
check("syntax error has a message", !!r8.error?.message, r8.error?.message);

/* ------------------------------------------------------------------ */
console.log("\n5. Structures the visualiser can draw");

const r9 = await runPython(`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
print("built")`, { indexURL });

const last = r9.steps[r9.steps.length - 1];
const headSnapshot = last.stack[0].locals.head;
check("class instance recorded as an object", headSnapshot?.kind === "object", headSnapshot?.kind);
check("with its class name", headSnapshot?.className === "Node", headSnapshot?.className);

function chainLength(snapshot) {
  let count = 0;
  let current = snapshot;
  while (current && current.kind === "object") {
    count++;
    current = current.entries.find(([k]) => k === "next")?.[1] ?? null;
  }
  return count;
}
check("linked list walked end to end", chainLength(headSnapshot) === 3, `${chainLength(headSnapshot)} nodes`);

const r10 = await runPython("a = {'x': 1}\na['self'] = a\nprint('done')", { indexURL });
check("a self-referencing dict does not hang", r10.status === "completed", r10.status);

/* ------------------------------------------------------------------ */
console.log("\n6. Run Code mode");

const r11 = await runPython("total = 0\nfor i in range(50000):\n    total += i\nprint(total)", {
  indexURL,
  record: false,
});
check("a 50,000-turn loop completes without recording", r11.status === "completed", r11.status);
check("with the right answer", printed(r11) === "1249975000", printed(r11));
check("and recorded no steps", r11.steps.length === 0, `${r11.steps.length} steps`);

/* ------------------------------------------------------------------ */
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
