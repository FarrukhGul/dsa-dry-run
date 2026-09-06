/**
 * statements/dp-2d.js — the questions for two-dimensional dynamic programming.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const dp2dStatements = {
  "unique-paths": {
    description:
      "A robot starts at the top-left of a grid and must reach the bottom-right, moving only right or down. Count the distinct routes.",
    examples: [
      {
        input: "rows = 3, columns = 7",
        output: "28",
        explanation: "Twenty-eight ways down and across.",
      },
      {
        input: "rows = 3, columns = 2",
        output: "3",
        explanation: "Three routes on a narrow grid.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 100"],
    starter: `// Unique Paths
// Count routes from top-left to bottom-right, moving only right or down.

function uniquePaths(rows, columns) {
  // Your code here.
}

console.log(uniquePaths(3, 7));
`,
  },

  "longest-common-subsequence": {
    description:
      "Return the length of the longest sequence appearing in both strings in the same order. The characters need not be adjacent, but they may not be reordered.",
    examples: [
      {
        input: "a = \"abcde\", b = \"ace\"",
        output: "3",
        explanation: "\"ace\" appears in both, in order.",
      },
      {
        input: "a = \"abc\", b = \"def\"",
        output: "0",
        explanation: "Nothing is shared.",
      },
    ],
    constraints: ["1 \u2264 lengths \u2264 1,000", "Lowercase letters."],
    starter: `// Longest Common Subsequence
// Longest sequence appearing in both, in order.

function longestCommonSubsequence(a, b) {
  // Your code here.
}

console.log(longestCommonSubsequence("abcde", "ace"));
`,
  },

  "best-time-to-buy-and-sell-stock-with-cooldown": {
    description:
      "Trade as often as you like, but after selling you must wait a full day before buying again, and you may hold only one share at a time. Return the largest total profit.",
    examples: [
      {
        input: "prices = [1,2,3,0,2]",
        output: "3",
        explanation: "Buy at 1, sell at 2, rest, buy at 0, sell at 2.",
      },
      {
        input: "prices = [1]",
        output: "0",
        explanation: "Nothing to trade.",
      },
    ],
    constraints: ["1 \u2264 prices.length \u2264 5,000", "One share at a time."],
    starter: `// Best Time to Buy and Sell Stock with Cooldown
// Trade freely, but rest one day after every sale.

function maxProfit(prices) {
  // Your code here.
}

console.log(maxProfit([1, 2, 3, 0, 2]));
`,
  },

  "coin-change-ii": {
    description:
      "Given coin values and a total, count how many distinct combinations add to it. Order does not matter, so 1+2 and 2+1 are the same combination.",
    examples: [
      {
        input: "amount = 5, coins = [1,2,5]",
        output: "4",
        explanation: "5; 2+2+1; 2+1+1+1; 1+1+1+1+1.",
      },
      {
        input: "amount = 3, coins = [2]",
        output: "0",
        explanation: "Odd totals are impossible.",
      },
    ],
    constraints: ["1 \u2264 coins.length \u2264 300", "0 \u2264 amount \u2264 5,000"],
    starter: `// Coin Change II
// Count the distinct combinations making the amount.

function change(amount, coins) {
  // Your code here.
}

console.log(change(5, [1, 2, 5]));
`,
  },

  "target-sum": {
    description:
      "Put a plus or a minus in front of every number, then add them up. Count how many arrangements of signs produce the target.",
    examples: [
      {
        input: "nums = [1,1,1,1,1], target = 3",
        output: "5",
        explanation: "Five ways to choose which single number is negative.",
      },
      {
        input: "nums = [1], target = 1",
        output: "1",
        explanation: "Only the plus works.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 20", "0 \u2264 sum of nums \u2264 1,000"],
    starter: `// Target Sum
// Count sign arrangements that add up to target.

function findTargetSumWays(nums, target) {
  // Your code here.
}

console.log(findTargetSumWays([1, 1, 1, 1, 1], 3));
`,
  },

  "interleaving-string": {
    description:
      "Decide whether the third string can be formed by shuffling the first two together, each keeping its own characters in their original order.",
    examples: [
      {
        input: "a = \"aabcc\", b = \"dbbca\", target = \"aadbbcbcac\"",
        output: "true",
        explanation: "Taking characters alternately from each, in order, builds it.",
      },
      {
        input: "the same a and b, target = \"aadbbbaccc\"",
        output: "false",
        explanation: "No shuffle produces that.",
      },
    ],
    constraints: ["0 \u2264 lengths \u2264 100", "Each string keeps its own order."],
    starter: `// Interleaving String
// Can the third be made by shuffling the first two, each keeping order?

function isInterleave(a, b, target) {
  // Your code here.
}

console.log(isInterleave("aabcc", "dbbca", "aadbbcbcac"));
`,
  },

  "longest-increasing-path-in-a-matrix": {
    description:
      "Find the longest path through a grid where each step must go to a strictly larger neighbour. You may move up, down, left or right, but not diagonally.",
    examples: [
      {
        input: "matrix = [[9,9,4],[6,6,8],[2,1,1]]",
        output: "4",
        explanation: "The path 1, 2, 6, 9 rises four squares.",
      },
      {
        input: "matrix = [[1]]",
        output: "1",
        explanation: "A single square is a path of one.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 200", "Each step must strictly increase."],
    starter: `// Longest Increasing Path in a Matrix
// Longest strictly increasing walk, moving in four directions.

function longestIncreasingPath(matrix) {
  // Your code here.
}

console.log(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]));
`,
  },

  "distinct-subsequences": {
    description:
      "Count how many ways the second string appears inside the first as a subsequence \u2014 that is, by deleting some characters from the first without reordering the rest.",
    examples: [
      {
        input: "source = \"rabbbit\", target = \"rabbit\"",
        output: "3",
        explanation: "The three b's give three ways to pick two of them.",
      },
      {
        input: "source = \"babgbag\", target = \"bag\"",
        output: "5",
        explanation: "Five different sets of positions spell bag.",
      },
    ],
    constraints: ["1 \u2264 lengths \u2264 1,000"],
    starter: `// Distinct Subsequences
// Count how many ways target appears in source as a subsequence.

function numDistinct(source, target) {
  // Your code here.
}

console.log(numDistinct("rabbbit", "rabbit"));
`,
  },

  "edit-distance": {
    description:
      "Return the fewest single-character operations \u2014 insert, delete, or replace \u2014 that turn the first word into the second.",
    examples: [
      {
        input: "a = \"horse\", b = \"ros\"",
        output: "3",
        explanation: "Replace h with r, delete r, delete e.",
      },
      {
        input: "a = \"intention\", b = \"execution\"",
        output: "5",
        explanation: "Five edits is the minimum.",
      },
    ],
    constraints: ["0 \u2264 lengths \u2264 500", "Lowercase letters."],
    starter: `// Edit Distance
// Fewest inserts, deletes or replacements turning a into b.

function minDistance(a, b) {
  // Your code here.
}

console.log(minDistance("horse", "ros"));
`,
  },

  "burst-balloons": {
    description:
      "Balloons each hold a number. Bursting one earns its two current neighbours multiplied together, and its neighbours then become adjacent. Missing edges count as 1. Return the most coins obtainable.",
    examples: [
      {
        input: "balloons = [3,1,5,8]",
        output: "167",
        explanation: "Bursting in the order 1, 5, 3, 8 earns the most.",
      },
      {
        input: "balloons = [1,5]",
        output: "10",
        explanation: "Burst 1 for 5, then 5 for 5.",
      },
    ],
    constraints: ["1 \u2264 balloons.length \u2264 300", "0 \u2264 values \u2264 100"],
    starter: `// Burst Balloons
// Bursting earns left x this x right. Return the most coins.

function maxCoins(balloons) {
  // Your code here.
}

console.log(maxCoins([3, 1, 5, 8]));
`,
  },

  "regular-expression-matching": {
    description:
      "Match a string against a pattern where a full stop matches any single character and a star means zero or more of whatever came before it. The whole string must match, not just part of it.",
    examples: [
      {
        input: "text = \"aa\", pattern = \"a*\"",
        output: "true",
        explanation: "The star repeats the a.",
      },
      {
        input: "text = \"ab\", pattern = \".*\"",
        output: "true",
        explanation: "Dot-star means any character, any number of times.",
      },
    ],
    constraints: ["1 \u2264 lengths \u2264 20", "A star always follows a valid character."],
    starter: `// Regular Expression Matching
// "." is any character, "*" is zero or more of the previous one.

function isMatch(text, pattern) {
  // Your code here.
}

console.log(isMatch("aa", "a*"));
`,
  },

};
