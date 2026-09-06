/**
 * statements/dp-1d.js — the questions for one-dimensional dynamic programming.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const dp1dStatements = {
  "climbing-stairs": {
    description:
      "Climb a staircase of n steps, taking either one or two at a time. Count the distinct ways to reach the top.",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "One and one, or two.",
      },
      {
        input: "n = 5",
        output: "8",
        explanation: "Eight distinct routes to the fifth step.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 45"],
    starter: `// Climbing Stairs
// Count the ways to climb n steps, 1 or 2 at a time.

function climbStairs(n) {
  // Your code here.
}

console.log(climbStairs(5));
`,
  },

  "min-cost-climbing-stairs": {
    description:
      "Each step charges a toll. You may start at step 0 or step 1, and climb one or two steps at a time. Return the cheapest way to get past the top.",
    examples: [
      {
        input: "cost = [10,15,20]",
        output: "15",
        explanation: "Start at step 1, pay 15, and jump two to the top.",
      },
      {
        input: "cost = [1,100,1,1,1,100,1,1,100,1]",
        output: "6",
        explanation: "Hop over each 100.",
      },
    ],
    constraints: ["2 \u2264 cost.length \u2264 1,000"],
    starter: `// Min Cost Climbing Stairs
// Cheapest way past the top, starting at step 0 or 1.

function minCostClimbingStairs(cost) {
  // Your code here.
}

console.log(minCostClimbingStairs([10, 15, 20]));
`,
  },

  "house-robber": {
    description:
      "Houses stand in a row, each holding some money. You cannot rob two adjacent houses. Return the most you can take.",
    examples: [
      {
        input: "nums = [2,7,9,3,1]",
        output: "12",
        explanation: "Rob houses 0, 2 and 4 for 2 + 9 + 1.",
      },
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob the first and third.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 100"],
    starter: `// House Robber
// Most money without robbing two adjacent houses.

function rob(houses) {
  // Your code here.
}

console.log(rob([2, 7, 9, 3, 1]));
`,
  },

  "house-robber-ii": {
    description:
      "The same street, but arranged in a circle, so the first and last houses are neighbours too. Return the most you can take.",
    examples: [
      {
        input: "nums = [2,3,2]",
        output: "3",
        explanation: "Robbing both 2s is not allowed, since they are now adjacent.",
      },
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "First and third, as before.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 100"],
    starter: `// House Robber II
// The houses form a circle: first and last are adjacent.

function rob(houses) {
  // Your code here.
}

console.log(rob([2, 3, 2]));
`,
  },

  "longest-palindromic-substring": {
    description:
      "Return the longest contiguous stretch of the string that reads the same backwards. If two are equally long, either is fine.",
    examples: [
      {
        input: "text = \"babad\"",
        output: "bab",
        explanation: "\"aba\" is equally long and also accepted.",
      },
      {
        input: "text = \"cbbd\"",
        output: "bb",
        explanation: "The only two-character palindrome.",
      },
    ],
    constraints: ["1 \u2264 text.length \u2264 1,000"],
    starter: `// Longest Palindromic Substring
// Return the longest stretch reading the same both ways.

function longestPalindrome(text) {
  // Your code here.
}

console.log(longestPalindrome("babad"));
`,
  },

  "palindromic-substrings": {
    description:
      "Count how many contiguous stretches of the string are palindromes. Single characters count, and identical stretches at different positions count separately.",
    examples: [
      {
        input: "text = \"abc\"",
        output: "3",
        explanation: "Just the three single letters.",
      },
      {
        input: "text = \"aaa\"",
        output: "6",
        explanation: "a, a, a, aa, aa and aaa.",
      },
    ],
    constraints: ["1 \u2264 text.length \u2264 1,000"],
    starter: `// Palindromic Substrings
// Count every palindromic stretch, including single characters.

function countSubstrings(text) {
  // Your code here.
}

console.log(countSubstrings("aaa"));
`,
  },

  "decode-ways": {
    description:
      "Letters map to numbers, A being 1 through Z being 26. Given a string of digits, count how many ways it could be decoded back into letters. A leading zero decodes to nothing.",
    examples: [
      {
        input: "digits = \"226\"",
        output: "3",
        explanation: "It could be 2 2 6, 22 6, or 2 26.",
      },
      {
        input: "digits = \"06\"",
        output: "0",
        explanation: "Nothing starts with a zero.",
      },
    ],
    constraints: ["1 \u2264 digits.length \u2264 100", "Digits only."],
    starter: `// Decode Ways
// Count how many ways the digits decode into letters (A=1 .. Z=26).

function numDecodings(digits) {
  // Your code here.
}

console.log(numDecodings("226"));
`,
  },

  "coin-change": {
    description:
      "Given coin values and a total, return the fewest coins adding to it, or -1 if it cannot be made. You have unlimited coins of each value.",
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "5 + 5 + 1.",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Odd totals are impossible with only 2s.",
      },
    ],
    constraints: ["1 \u2264 coins.length \u2264 300", "0 \u2264 amount \u2264 10,000"],
    starter: `// Coin Change
// Fewest coins making the amount, or -1.

function coinChange(coins, amount) {
  // Your code here.
}

console.log(coinChange([1, 2, 5], 11));
`,
  },

  "maximum-product-subarray": {
    description:
      "Return the largest product of any contiguous run of numbers. Negative values are the difficulty: two of them multiply back to a positive.",
    examples: [
      {
        input: "nums = [2,3,-2,4]",
        output: "6",
        explanation: "2 x 3 is the best run.",
      },
      {
        input: "nums = [-2,0,-1]",
        output: "0",
        explanation: "Any run spanning the 0 gives 0, which beats the negatives.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 20,000"],
    starter: `// Maximum Product Subarray
// Largest product of any contiguous run. Mind the negatives.

function maxProduct(nums) {
  // Your code here.
}

console.log(maxProduct([2, 3, -2, 4]));
`,
  },

  "word-break": {
    description:
      "Decide whether the string can be cut into a sequence of words from the given dictionary. Words may be reused as often as you like.",
    examples: [
      {
        input: "text = \"leetcode\", dict = [\"leet\",\"code\"]",
        output: "true",
        explanation: "It splits cleanly into the two words.",
      },
      {
        input: "text = \"catsandog\", dict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
        output: "false",
        explanation: "No cutting uses up the whole string.",
      },
    ],
    constraints: ["1 \u2264 text.length \u2264 300", "Dictionary words may be reused."],
    starter: `// Word Break
// Can the string be cut into dictionary words?

function wordBreak(text, wordDict) {
  // Your code here.
}

console.log(wordBreak("leetcode", ["leet", "code"]));
`,
  },

  "longest-increasing-subsequence": {
    description:
      "Return the length of the longest strictly increasing subsequence. The values need not be adjacent \u2014 you may skip as many as you like, but not reorder them.",
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4",
        explanation: "2, 3, 7, 101 is four long.",
      },
      {
        input: "nums = [7,7,7,7]",
        output: "1",
        explanation: "Strictly increasing, so equal values do not extend a run.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 2,500"],
    starter: `// Longest Increasing Subsequence
// Longest strictly increasing subsequence, values need not be adjacent.

function lengthOfLIS(nums) {
  // Your code here.
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
`,
  },

  "partition-equal-subset-sum": {
    description:
      "Decide whether the numbers can be split into two groups with equal totals. Every number must go into one group or the other.",
    examples: [
      {
        input: "nums = [1,5,11,5]",
        output: "true",
        explanation: "[1,5,5] and [11] both total 11.",
      },
      {
        input: "nums = [1,2,3,5]",
        output: "false",
        explanation: "The total is 11, which is odd, so it cannot split evenly.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 200", "1 \u2264 values \u2264 100"],
    starter: `// Partition Equal Subset Sum
// Can the numbers split into two groups of equal total?

function canPartition(nums) {
  // Your code here.
}

console.log(canPartition([1, 5, 11, 5]));
`,
  },

};
