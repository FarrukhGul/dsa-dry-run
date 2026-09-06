/**
 * statements/math-geometry.js — the questions for the maths and geometry pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const mathGeometryStatements = {
  "rotate-image": {
    description:
      "Turn a square grid ninety degrees clockwise, changing the grid itself rather than building a new one.",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1], [8,5,2], [9,6,3]]",
        explanation: "The first column becomes the first row, reversed.",
      },
      {
        input: "matrix = [[1]]",
        output: "[[1]]",
        explanation: "A single square is unchanged.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 20", "Rotate in place."],
    starter: `// Rotate Image
// Turn the square grid 90 degrees clockwise, in place.

function rotate(matrix) {
  // Your code here.
}

console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
`,
  },

  "spiral-matrix": {
    description:
      "Return every value in the grid, read in a spiral: along the top, down the right, back along the bottom, up the left, and inwards.",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
        explanation: "Round the outside, then the middle.",
      },
      {
        input: "matrix = [[1,2],[3,4]]",
        output: "[1, 2, 4, 3]",
        explanation: "One loop covers it.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 10"],
    starter: `// Spiral Matrix
// Return every value, read in a spiral from the outside in.

function spiralOrder(matrix) {
  // Your code here.
}

console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
`,
  },

  "set-matrix-zeroes": {
    description:
      "Wherever the grid holds a zero, set that entire row and column to zero. Modify the grid itself. The trap is that the zeroes you write look exactly like the ones you found.",
    examples: [
      {
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        output: "[[1,0,1], [0,0,0], [1,0,1]]",
        explanation: "The middle row and column are cleared.",
      },
      {
        input: "matrix = [[0,1],[1,1]]",
        output: "[[0,0], [0,1]]",
        explanation: "The top-left zero clears the first row and column.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 200", "Modify in place."],
    starter: `// Set Matrix Zeroes
// Every zero clears its whole row and column. In place.

function setZeroes(matrix) {
  // Your code here.
}

console.log(setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
`,
  },

  "happy-number": {
    description:
      "Replace a number by the sum of the squares of its digits, over and over. If it reaches 1 the number is happy; if it settles into a loop that never reaches 1, it is not. Decide which.",
    examples: [
      {
        input: "n = 19",
        output: "true",
        explanation: "19 leads to 82, 68, 100, then 1.",
      },
      {
        input: "n = 2",
        output: "false",
        explanation: "It falls into a loop that never reaches 1.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 2,147,483,647"],
    starter: `// Happy Number
// Repeatedly sum the squares of the digits. Does it reach 1?

function isHappy(n) {
  // Your code here.
}

console.log(isHappy(19));
`,
  },

  "plus-one": {
    description:
      "A number is stored as an array of digits, most significant first. Add one to it and return the resulting digits.",
    examples: [
      {
        input: "digits = [1,2,3]",
        output: "[1, 2, 4]",
        explanation: "123 plus one is 124.",
      },
      {
        input: "digits = [9,9]",
        output: "[1, 0, 0]",
        explanation: "99 plus one needs an extra digit.",
      },
    ],
    constraints: ["1 \u2264 digits.length \u2264 100", "No leading zeros."],
    starter: `// Plus One
// Add one to a number stored as an array of digits.

function plusOne(digits) {
  // Your code here.
}

console.log(plusOne([1, 2, 3]));
`,
  },

  "pow-x-n": {
    description:
      "Raise a number to an integer power. The power may be negative, and multiplying n times is too slow when n is large.",
    examples: [
      {
        input: "x = 2, n = 10",
        output: "1024",
        explanation: "Two to the tenth.",
      },
      {
        input: "x = 2, n = -2",
        output: "0.25",
        explanation: "A negative power is one over the positive one.",
      },
    ],
    constraints: ["-2^31 \u2264 n < 2^31", "n may be negative."],
    starter: `// Pow(x, n)
// Raise x to the power n. n may be negative.

function myPow(x, n) {
  // Your code here.
}

console.log(myPow(2, 10));
`,
  },

  "multiply-strings": {
    description:
      "Two non-negative numbers are given as strings. Return their product as a string, without converting them to numbers or using any big-integer library.",
    examples: [
      {
        input: "a = \"123\", b = \"456\"",
        output: "56088",
        explanation: "Ordinary long multiplication.",
      },
      {
        input: "a = \"2\", b = \"3\"",
        output: "6",
        explanation: "A single digit each.",
      },
    ],
    constraints: ["1 \u2264 lengths \u2264 200", "No converting to numbers."],
    starter: `// Multiply Strings
// Multiply two numbers given as strings, without converting them.

function multiply(a, b) {
  // Your code here.
}

console.log(multiply("123", "456"));
`,
  },

  "detect-squares": {
    description:
      "Build a structure that stores points and can count, for a given point, how many axis-aligned squares it forms with three stored points. Points may be added more than once, and each copy counts.",
    examples: [
      {
        input: "add [3,10], [11,2], [3,2], then count [11,10]",
        output: "1",
        explanation: "Those four corners form one square.",
      },
    ],
    constraints: ["Up to 5,000 calls.", "Squares must have sides parallel to the axes."],
    starter: `// Detect Squares
// Count axis-aligned squares formed with three stored points.

class DetectSquares {
  constructor() {
    // Your code here.
  }

  add(point) {
    // Your code here.
  }

  count(point) {
    // Your code here.
  }
}

const detector = new DetectSquares();
detector.add([3, 10]);
detector.add([11, 2]);
detector.add([3, 2]);
console.log(detector.count([11, 10]));
`,
  },

};
