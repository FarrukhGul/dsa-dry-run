/**
 * stack.js — last in, first out.
 *
 * Stacks turn up whenever the thing you need is the most recent unfinished
 * one: an unclosed bracket, the last warmer day, the bar that has not yet met
 * something shorter than it.
 */

export const stack = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    summary:
      "Check that every bracket closes in the right order. Push each opener; when a closer arrives it must match whatever is on top.",
    solution: `// Valid Parentheses
// Push openers. A closer must match the most recent unclosed opener.

function isValid(text) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const open = [];

  for (const character of text) {
    if (character === "(" || character === "[" || character === "{") {
      open.push(character);
      continue;
    }

    if (open.pop() !== pairs[character]) {
      return false;
    }
  }

  return open.length === 0;
}

console.log(isValid("()[]{}"));
`,
    expectedOutput: "true",
  },

  {
    id: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    summary:
      "A stack that can also report its smallest value instantly. Keep a second stack holding the minimum as it stood at each push.",
    solution: `// Min Stack
// A parallel stack remembering the minimum at each level.

class MinStack {
  constructor() {
    this.values = [];
    this.minimums = [];
  }

  push(value) {
    this.values.push(value);

    const smallestSoFar =
      this.minimums.length === 0
        ? value
        : Math.min(value, this.minimums[this.minimums.length - 1]);

    this.minimums.push(smallestSoFar);
  }

  pop() {
    this.minimums.pop();
    return this.values.pop();
  }

  top() {
    return this.values[this.values.length - 1];
  }

  getMin() {
    return this.minimums[this.minimums.length - 1];
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
    expectedOutput: "-3\n0\n-2",
  },

  {
    id: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    summary:
      "Work out an expression written with the operator after its operands. Push numbers; when an operator appears, pop the last two and push the result.",
    solution: `// Evaluate Reverse Polish Notation
// Numbers go on the stack; an operator consumes the top two.

function evalRPN(tokens) {
  const numbers = [];

  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      const right = numbers.pop();
      const left = numbers.pop();

      if (token === "+") numbers.push(left + right);
      if (token === "-") numbers.push(left - right);
      if (token === "*") numbers.push(left * right);
      // Division truncates towards zero, not downwards.
      if (token === "/") numbers.push(Math.trunc(left / right));
    } else {
      numbers.push(Number(token));
    }
  }

  return numbers[0];
}

console.log(evalRPN(["2", "1", "+", "3", "*"]));
`,
    expectedOutput: "9",
  },

  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    summary:
      "List every well-formed arrangement of n pairs of brackets. Two rules keep it honest: never open more than n, and never close more than you have opened.",
    solution: `// Generate Parentheses
// Build the string one bracket at a time, obeying two rules.

function generateParenthesis(n) {
  const answer = [];

  function build(current, opened, closed) {
    if (current.length === n * 2) {
      answer.push(current);
      return;
    }

    if (opened < n) {
      build(current + "(", opened + 1, closed);
    }

    if (closed < opened) {
      build(current + ")", opened, closed + 1);
    }
  }

  build("", 0, 0);
  return answer;
}

console.log(generateParenthesis(3));
`,
    expectedOutput: '["((()))", "(()())", "(())()", "()(())", "()()()"]',
  },

  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    summary:
      "For each day, how long until it gets warmer? Keep a stack of days still waiting for their warmer day; a hot day settles all the cooler ones behind it.",
    solution: `// Daily Temperatures
// A stack of days still waiting for something warmer.

function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const waiting = []; // indices of days with no warmer day yet

  for (let day = 0; day < temperatures.length; day++) {
    while (
      waiting.length > 0 &&
      temperatures[waiting[waiting.length - 1]] < temperatures[day]
    ) {
      const earlier = waiting.pop();
      answer[earlier] = day - earlier;
    }

    waiting.push(day);
  }

  return answer;
}

console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
`,
    expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]",
  },

  {
    id: "car-fleet",
    title: "Car Fleet",
    difficulty: "Medium",
    summary:
      "Cars cannot overtake, so a faster car stuck behind a slower one joins its fleet. Sort by position and work backwards: a car that would arrive no later than the one ahead has caught it.",
    solution: `// Car Fleet
// Work from the car nearest the target backwards.

function carFleet(target, position, speed) {
  const cars = [];

  for (let i = 0; i < position.length; i++) {
    cars.push({ position: position[i], speed: speed[i] });
  }

  // Nearest the target first.
  cars.sort((a, b) => b.position - a.position);

  let fleets = 0;
  let slowestAhead = 0;

  for (const car of cars) {
    const arrival = (target - car.position) / car.speed;

    // Arriving later than everything ahead means starting a new fleet.
    if (arrival > slowestAhead) {
      fleets++;
      slowestAhead = arrival;
    }
  }

  return fleets;
}

console.log(carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]));
`,
    expectedOutput: "3",
  },

  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    summary:
      "Find the biggest rectangle that fits under a row of bars. Keep a stack of increasing heights; when a shorter bar arrives, every taller bar behind it has just found its right edge.",
    solution: `// Largest Rectangle in Histogram
// A stack of increasing bars. A shorter bar closes off the taller ones.

function largestRectangleArea(heights) {
  const pending = []; // { start, height }, heights increasing
  let best = 0;

  for (let i = 0; i < heights.length; i++) {
    let start = i;

    while (
      pending.length > 0 &&
      pending[pending.length - 1].height > heights[i]
    ) {
      const bar = pending.pop();
      best = Math.max(best, bar.height * (i - bar.start));

      // This bar could have extended back to where the taller one began.
      start = bar.start;
    }

    pending.push({ start, height: heights[i] });
  }

  // Anything still pending runs all the way to the end.
  for (const bar of pending) {
    best = Math.max(best, bar.height * (heights.length - bar.start));
  }

  return best;
}

console.log(largestRectangleArea([2, 1, 5, 6, 2, 3]));
`,
    expectedOutput: "10",
  },
];
