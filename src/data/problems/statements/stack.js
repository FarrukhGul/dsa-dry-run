/**
 * statements/stack.js — the questions for the stack pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const stackStatements = {
  "valid-parentheses": {
    description:
      "Given a string of brackets — round, square and curly — decide whether every one is closed by the right kind, in the right order. Nesting must be respected, so \"([)]\" is wrong even though the counts match.",
    examples: [
      {
        input: 'text = "()[]{}"',
        output: "true",
        explanation: "Each pair opens and closes immediately.",
      },
      {
        input: 'text = "([)]"',
        output: "false",
        explanation: "The round bracket closes while the square one is still open.",
      },
    ],
    constraints: ["1 ≤ text.length ≤ 10,000", "Brackets only."],
    starter: `// Valid Parentheses
// Return true if every bracket closes correctly and in order.

function isValid(text) {
  // Your code here.
}

console.log(isValid("()[]{}"));
`,
  },

  "min-stack": {
    description:
      "Build a stack supporting push, pop, top, and one more: getMin, which returns the smallest value currently in it. All four must run in constant time, so scanning for the minimum is not allowed.",
    examples: [
      {
        input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
        output: "-3, then 0, then -2",
        explanation:
          "getMin is -3 while it is in the stack; after popping it, the smallest left is -2.",
      },
    ],
    constraints: [
      "All four operations must be constant time.",
      "pop and top are never called on an empty stack.",
    ],
    starter: `// Min Stack
// A stack that can also report its smallest value instantly.

class MinStack {
  constructor() {
    // Your code here.
  }

  push(value) {
    // Your code here.
  }

  pop() {
    // Your code here.
  }

  top() {
    // Your code here.
  }

  getMin() {
    // Your code here.
  }
}

const stack = new MinStack();
stack.push(-2);
stack.push(0);
stack.push(-3);
console.log(stack.getMin());
stack.pop();
console.log(stack.top());
console.log(stack.getMin());
`,
  },

  "evaluate-reverse-polish-notation": {
    description:
      "Work out an arithmetic expression written with each operator after its two operands, so \"2 1 +\" means 2 + 1. Division truncates towards zero. The four operators are plus, minus, times and divide.",
    examples: [
      {
        input: 'tokens = ["2", "1", "+", "3", "*"]',
        output: "9",
        explanation: "2 + 1 is 3, and 3 x 3 is 9.",
      },
      {
        input: 'tokens = ["4", "13", "5", "/", "+"]',
        output: "6",
        explanation: "13 / 5 truncates to 2, and 4 + 2 is 6.",
      },
    ],
    constraints: [
      "1 ≤ tokens.length ≤ 10,000",
      "The expression is always valid.",
    ],
    starter: `// Evaluate Reverse Polish Notation
// Work out the expression. Division truncates towards zero.

function evalRPN(tokens) {
  // Your code here.
}

console.log(evalRPN(["2", "1", "+", "3", "*"]));
`,
  },

  "generate-parentheses": {
    description:
      "Given a number n, produce every well-formed string of n pairs of brackets. Well-formed means every opening bracket is eventually closed, and no closing bracket appears before its partner.",
    examples: [
      {
        input: "n = 3",
        output: '["((()))", "(()())", "(())()", "()(())", "()()()"]',
        explanation: "There are exactly five valid arrangements of three pairs.",
      },
      {
        input: "n = 1",
        output: '["()"]',
        explanation: "One pair can only be arranged one way.",
      },
    ],
    constraints: ["1 ≤ n ≤ 8"],
    starter: `// Generate Parentheses
// Return every well-formed arrangement of n pairs of brackets.

function generateParenthesis(n) {
  // Your code here.
}

console.log(generateParenthesis(3));
`,
  },

  "daily-temperatures": {
    description:
      "For each day, say how many days you must wait for a warmer one. If no warmer day ever comes, the answer for that day is zero.",
    examples: [
      {
        input: "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
        output: "[1, 1, 4, 2, 1, 1, 0, 0]",
        explanation:
          "Day 0 warms up the very next day. Day 2 waits four days for 76. The last two never warm up.",
      },
    ],
    constraints: ["1 ≤ temperatures.length ≤ 100,000", "30 ≤ values ≤ 100"],
    starter: `// Daily Temperatures
// For each day, how many days until a warmer one? 0 if never.

function dailyTemperatures(temperatures) {
  // Your code here.
}

console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
`,
  },

  "car-fleet": {
    description:
      "Cars head towards a target at different speeds from different positions, and none may overtake. A faster car catching a slower one joins it and they travel on together as one fleet. Count how many fleets reach the target.",
    examples: [
      {
        input: "target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]",
        output: "3",
        explanation:
          "The cars at 10 and 8 meet and become one fleet; 0 and 3 do too; 5 arrives alone.",
      },
    ],
    constraints: ["1 ≤ number of cars ≤ 100,000", "All positions differ."],
    starter: `// Car Fleet
// Cars cannot overtake. Count how many fleets reach the target.

function carFleet(target, position, speed) {
  // Your code here.
}

console.log(carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]));
`,
  },

  "largest-rectangle-in-histogram": {
    description:
      "The numbers are the heights of bars standing side by side, each one unit wide. Find the area of the largest rectangle that fits entirely under them. A rectangle may span several bars, but its height is limited by the shortest bar it covers.",
    examples: [
      {
        input: "heights = [2, 1, 5, 6, 2, 3]",
        output: "10",
        explanation:
          "The bars of height 5 and 6 give a rectangle 2 wide and 5 tall.",
      },
      {
        input: "heights = [2, 4]",
        output: "4",
        explanation: "The single bar of height 4 beats a 2-wide, 2-tall rectangle.",
      },
    ],
    constraints: ["1 ≤ heights.length ≤ 100,000", "Heights are not negative."],
    starter: `// Largest Rectangle in Histogram
// Return the area of the largest rectangle fitting under the bars.

function largestRectangleArea(heights) {
  // Your code here.
}

console.log(largestRectangleArea([2, 1, 5, 6, 2, 3]));
`,
  },
};
