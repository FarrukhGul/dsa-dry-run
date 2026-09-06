/**
 * statements/two-pointers.js — the questions for the two-pointer pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const twoPointersStatements = {
  "valid-palindrome": {
    description:
      "Decide whether a phrase reads the same forwards and backwards, ignoring anything that is not a letter or digit, and treating upper and lower case as the same. Building a cleaned copy of the string works, but you can do it without one.",
    examples: [
      {
        input: 'text = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: 'Stripped down it reads "amanaplanacanalpanama", the same both ways.',
      },
      {
        input: 'text = "race a car"',
        output: "false",
        explanation: '"raceacar" reversed is "racaecar", which is different.',
      },
    ],
    constraints: ["1 ≤ text.length ≤ 200,000", "Any printable characters."],
    starter: `// Valid Palindrome
// Ignore punctuation and case. Return true if it reads the same both ways.

function isPalindrome(text) {
  // Your code here.
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
`,
  },

  "two-sum-ii": {
    description:
      "Two Sum again, except the array is already sorted in increasing order. Return the two positions that add up to the target, counting from 1 rather than 0. Being sorted is the whole gift here — it tells you which way to move.",
    examples: [
      {
        input: "numbers = [2, 7, 11, 15], target = 9",
        output: "[1, 2]",
        explanation: "2 + 7 is 9. The positions are 1-based, so 1 and 2.",
      },
      {
        input: "numbers = [2, 3, 4], target = 6",
        output: "[1, 3]",
        explanation: "2 + 4 is 6.",
      },
    ],
    constraints: [
      "2 ≤ numbers.length ≤ 30,000",
      "The array is sorted; exactly one pair works.",
    ],
    starter: `// Two Sum II - Input Array Is Sorted
// Return the two 1-based positions that add up to target.

function twoSum(numbers, target) {
  // Your code here.
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
  },

  "3sum": {
    description:
      "Find every distinct triple of values that adds up to zero. Triples that use the same values count as one answer however they are ordered, so the awkward part is avoiding duplicates rather than finding the triples.",
    examples: [
      {
        input: "nums = [-1, 0, 1, 2, -1, -4]",
        output: "[[-1, -1, 2], [-1, 0, 1]]",
        explanation:
          "Both add to zero. -1 appears twice in the input, but each triple is reported once.",
      },
      {
        input: "nums = [0, 1, 1]",
        output: "[]",
        explanation: "No three of these add to zero.",
      },
    ],
    constraints: ["3 ≤ nums.length ≤ 3,000", "Values may repeat."],
    starter: `// 3Sum
// Return every distinct triple that adds up to zero.

function threeSum(nums) {
  // Your code here.
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]));
`,
  },

  "container-with-most-water": {
    description:
      "Each number is the height of a vertical line. Pick two lines so that the water held between them is as much as possible. The amount is the distance between them multiplied by whichever line is shorter.",
    examples: [
      {
        input: "heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        output: "49",
        explanation:
          "The lines at positions 1 and 8 are 7 apart, and the shorter is 7, so 7 x 7 = 49.",
      },
      {
        input: "heights = [1, 1]",
        output: "1",
        explanation: "One apart, and one tall.",
      },
    ],
    constraints: ["2 ≤ heights.length ≤ 100,000", "Heights are not negative."],
    starter: `// Container With Most Water
// Return the most water two lines can hold between them.

function maxArea(heights) {
  // Your code here.
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
`,
  },

  "trapping-rain-water": {
    description:
      "The numbers describe the heights of bars sitting side by side. After rain, water collects in the dips. Work out the total. The water above any single bar is decided by the tallest bar to its left and the tallest to its right.",
    examples: [
      {
        input: "heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        output: "6",
        explanation:
          "Six units settle in the dips between the taller bars.",
      },
      {
        input: "heights = [4, 2, 0, 3, 2, 5]",
        output: "9",
        explanation: "The deep valley in the middle holds most of it.",
      },
    ],
    constraints: ["1 ≤ heights.length ≤ 20,000", "Heights are not negative."],
    starter: `// Trapping Rain Water
// Return how many units of water collect between the bars.

function trap(heights) {
  // Your code here.
}

console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));
`,
  },
};
