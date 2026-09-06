/**
 * statements/bit-manipulation.js — the questions for the bit manipulation pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const bitManipulationStatements = {
  "single-number": {
    description:
      "Every value in the array appears exactly twice except one, which appears once. Find it, using constant extra memory.",
    examples: [
      {
        input: "nums = [2,2,1]",
        output: "1",
        explanation: "The 2s pair up, leaving 1.",
      },
      {
        input: "nums = [4,1,2,1,2]",
        output: "4",
        explanation: "Everything else pairs off.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 30,000", "Constant extra memory."],
    starter: `// Single Number
// Every value appears twice except one. Find it, constant memory.

function singleNumber(nums) {
  // Your code here.
}

console.log(singleNumber([2, 2, 1]));
`,
  },

  "number-of-1-bits": {
    description:
      "Count the 1 bits in the binary form of a number \u2014 sometimes called its Hamming weight.",
    examples: [
      {
        input: "n = 11",
        output: "3",
        explanation: "Eleven is 1011 in binary, which has three 1s.",
      },
      {
        input: "n = 128",
        output: "1",
        explanation: "128 is a single 1 followed by seven 0s.",
      },
    ],
    constraints: ["0 \u2264 n < 2^32"],
    starter: `// Number of 1 Bits
// Count the 1s in the number's binary form.

function hammingWeight(n) {
  // Your code here.
}

console.log(hammingWeight(11));
`,
  },

  "counting-bits": {
    description:
      "For every number from 0 up to n, count its 1 bits, and return all the counts as an array. Doing each independently works; reusing earlier answers is better.",
    examples: [
      {
        input: "n = 5",
        output: "[0, 1, 1, 2, 1, 2]",
        explanation: "0 has none, 1 has one, 2 has one, 3 has two, and so on.",
      },
      {
        input: "n = 2",
        output: "[0, 1, 1]",
        explanation: "Just the first three.",
      },
    ],
    constraints: ["0 \u2264 n \u2264 100,000"],
    starter: `// Counting Bits
// Count the 1 bits of every number from 0 to n.

function countBits(n) {
  // Your code here.
}

console.log(countBits(5));
`,
  },

  "reverse-bits": {
    description:
      "Reverse the order of the 32 bits of an unsigned integer and return the result.",
    examples: [
      {
        input: "n = 43261596",
        output: "964176192",
        explanation: "Its 32 bits, read back to front, spell the answer.",
      },
    ],
    constraints: ["The input is treated as 32 bits, unsigned."],
    starter: `// Reverse Bits
// Reverse the order of the 32 bits.

function reverseBits(n) {
  // Your code here.
}

console.log(reverseBits(43261596));
`,
  },

  "missing-number": {
    description:
      "An array holds n distinct values taken from the range 0 to n, so exactly one is missing. Find it.",
    examples: [
      {
        input: "nums = [3,0,1]",
        output: "2",
        explanation: "The range is 0 to 3, and 2 is absent.",
      },
      {
        input: "nums = [0,1]",
        output: "2",
        explanation: "The range is 0 to 2 here.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10,000", "All values are distinct."],
    starter: `// Missing Number
// One value from 0..n is absent. Find it.

function missingNumber(nums) {
  // Your code here.
}

console.log(missingNumber([3, 0, 1]));
`,
  },

  "sum-of-two-integers": {
    description:
      "Add two integers without using the plus or minus operators. Bitwise operations are the way in: one of them adds without carrying, and another finds the carries.",
    examples: [
      {
        input: "a = 2, b = 3",
        output: "5",
        explanation: "Ordinary addition, by an unusual route.",
      },
      {
        input: "a = -2, b = 3",
        output: "1",
        explanation: "Negative numbers work too, since the bits already encode them.",
      },
    ],
    constraints: ["-1,000 \u2264 a, b \u2264 1,000", "No + or - operators."],
    starter: `// Sum of Two Integers
// Add without using + or -.

function getSum(a, b) {
  // Your code here.
}

console.log(getSum(2, 3));
`,
  },

  "reverse-integer": {
    description:
      "Reverse the digits of a signed integer, keeping its sign. If the reversed value would not fit in a signed 32-bit integer, return 0 instead.",
    examples: [
      {
        input: "x = 123",
        output: "321",
        explanation: "Digits reversed.",
      },
      {
        input: "x = 1534236469",
        output: "0",
        explanation: "Reversed it would overflow 32 bits.",
      },
    ],
    constraints: ["-2^31 \u2264 x \u2264 2^31 - 1", "Return 0 on overflow."],
    starter: `// Reverse Integer
// Reverse the digits, keeping the sign. Return 0 if it overflows 32 bits.

function reverse(x) {
  // Your code here.
}

console.log(reverse(123));
`,
  },

};
