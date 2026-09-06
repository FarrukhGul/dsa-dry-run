/**
 * statements/backtracking.js — the questions for the backtracking pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const backtrackingStatements = {
  "subsets": {
    description:
      "Return every possible subset of the given numbers, including the empty one and the whole set. All values are distinct, so no subset can repeat. Any order is accepted.",
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
        explanation: "Eight subsets \u2014 two to the power of three.",
      },
      {
        input: "nums = [0]",
        output: "[[], [0]]",
        explanation: "Either take it or leave it.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10", "All values differ."],
    starter: `// Subsets
// Return every possible subset.

function subsets(nums) {
  // Your code here.
}

console.log(subsets([1, 2, 3]));
`,
  },

  "combination-sum": {
    description:
      "Given distinct candidate numbers and a target, return every combination adding to it. Each candidate may be reused as many times as you like, and two combinations differ only by which numbers they use, not the order.",
    examples: [
      {
        input: "candidates = [2,3,6,7], target = 7",
        output: "[[2,2,3], [7]]",
        explanation: "2+2+3 is 7, and so is 7 by itself.",
      },
      {
        input: "candidates = [2], target = 1",
        output: "[]",
        explanation: "Nothing adds to 1.",
      },
    ],
    constraints: ["1 \u2264 candidates.length \u2264 30", "Candidates are distinct and positive."],
    starter: `// Combination Sum
// Every combination adding to target. Numbers may be reused.

function combinationSum(candidates, target) {
  // Your code here.
}

console.log(combinationSum([2, 3, 6, 7], 7));
`,
  },

  "permutations": {
    description:
      "Return every possible ordering of the given distinct numbers. Any order of the results is accepted.",
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]",
        explanation: "Six orderings \u2014 three factorial.",
      },
      {
        input: "nums = [1]",
        output: "[[1]]",
        explanation: "One number, one ordering.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 6", "All values differ."],
    starter: `// Permutations
// Return every ordering of the numbers.

function permute(nums) {
  // Your code here.
}

console.log(permute([1, 2, 3]));
`,
  },

  "subsets-ii": {
    description:
      "Subsets again, but the input may contain repeated values and the output may not contain a repeated subset. Sorting first makes the duplicates sit next to each other, which is what lets you skip them.",
    examples: [
      {
        input: "nums = [1,2,2]",
        output: "[[], [1], [1,2], [1,2,2], [2], [2,2]]",
        explanation: "Only one [1,2] is reported, even though either 2 could make it.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10", "Values may repeat."],
    starter: `// Subsets II
// Every subset, with no subset reported twice.

function subsetsWithDup(nums) {
  // Your code here.
}

console.log(subsetsWithDup([1, 2, 2]));
`,
  },

  "combination-sum-ii": {
    description:
      "Reach the target using each number in the list at most once. The list may contain repeated values, but no combination may be reported twice.",
    examples: [
      {
        input: "candidates = [10,1,2,7,6,1,5], target = 8",
        output: "[[1,1,6], [1,2,5], [1,7], [2,6]]",
        explanation: "Both 1s may be used together, but [1,7] is reported once even though either 1 could make it.",
      },
    ],
    constraints: ["1 \u2264 candidates.length \u2264 100", "Each number may be used once."],
    starter: `// Combination Sum II
// Each number used at most once; no combination repeated.

function combinationSum2(candidates, target) {
  // Your code here.
}

console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));
`,
  },

  "word-search": {
    description:
      "Decide whether a word can be traced through a grid of letters by moving between horizontally or vertically neighbouring squares, without using any square twice.",
    examples: [
      {
        input: "board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = \"ABCCED\"",
        output: "true",
        explanation: "The path runs right along the top, then down and back.",
      },
      {
        input: "the same board, word = \"ABCB\"",
        output: "false",
        explanation: "That would need the B twice.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 6", "A square may not be reused within one word."],
    starter: `// Word Search
// Can the word be traced through neighbouring squares, no reuse?

function exist(board, word) {
  // Your code here.
}

const board = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];

console.log(exist(board, "ABCCED"));
`,
  },

  "palindrome-partitioning": {
    description:
      "Cut the string into pieces so that every piece reads the same backwards, and return every way of doing it.",
    examples: [
      {
        input: "text = \"aab\"",
        output: "[[\"a\",\"a\",\"b\"], [\"aa\",\"b\"]]",
        explanation: "Both cuts leave only palindromes.",
      },
      {
        input: "text = \"a\"",
        output: "[[\"a\"]]",
        explanation: "A single character is already a palindrome.",
      },
    ],
    constraints: ["1 \u2264 text.length \u2264 16", "Lowercase letters."],
    starter: `// Palindrome Partitioning
// Every way of cutting the string into palindromes.

function partition(text) {
  // Your code here.
}

console.log(partition("aab"));
`,
  },

  "letter-combinations-of-a-phone-number": {
    description:
      "On an old phone keypad, 2 means abc, 3 means def, and so on up to 9. Given a string of digits, return every word they could spell. Return an empty list for an empty input.",
    examples: [
      {
        input: "digits = \"23\"",
        output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        explanation: "Three letters for the 2, times three for the 3.",
      },
      {
        input: "digits = \"\"",
        output: "[]",
        explanation: "Nothing to spell.",
      },
    ],
    constraints: ["0 \u2264 digits.length \u2264 4", "Digits are 2 to 9."],
    starter: `// Letter Combinations of a Phone Number
// Every word the digits could spell on a phone keypad.

function letterCombinations(digits) {
  // Your code here.
}

console.log(letterCombinations("23"));
`,
  },

  "n-queens": {
    description:
      "Place n queens on an n by n board so that no two attack each other \u2014 no shared row, column, or diagonal. Return every arrangement, each as the column each row's queen occupies.",
    examples: [
      {
        input: "n = 4",
        output: "[[1,3,0,2], [2,0,3,1]]",
        explanation: "Two arrangements exist. The first puts row 0's queen in column 1, row 1's in column 3, and so on.",
      },
      {
        input: "n = 1",
        output: "[[0]]",
        explanation: "One queen on a one-square board.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 9"],
    starter: `// N-Queens
// Every safe arrangement, as the column each row's queen occupies.

function solveNQueens(n) {
  // Your code here.
}

console.log(solveNQueens(4));
`,
  },

};
