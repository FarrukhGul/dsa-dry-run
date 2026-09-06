/**
 * statements/sliding-window.js — the questions for the sliding window pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const slidingWindowStatements = {
  "best-time-to-buy-and-sell-stock": {
    description:
      "Each number is a share price on one day. Buy on one day and sell on a later one, and return the largest profit possible. If no trade makes money, return zero.",
    examples: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy on day 1 for 1, sell on day 4 for 6.",
      },
      {
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
        explanation: "Prices only fall, so the best move is not to trade.",
      },
    ],
    constraints: ["1 ≤ prices.length ≤ 100,000", "You may make one trade only."],
    starter: `// Best Time to Buy and Sell Stock
// Buy once and sell later. Return the largest profit, or 0.

function maxProfit(prices) {
  // Your code here.
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));
`,
  },

  "longest-substring-without-repeating": {
    description:
      "Find the length of the longest stretch of the string that contains no repeated character. The stretch has to be contiguous — you cannot skip characters in the middle.",
    examples: [
      {
        input: 'text = "abcabcbb"',
        output: "3",
        explanation: '"abc" is the longest run with no repeats.',
      },
      {
        input: 'text = "bbbbb"',
        output: "1",
        explanation: 'Only "b" itself has no repeat.',
      },
    ],
    constraints: ["0 ≤ text.length ≤ 50,000", "Any characters."],
    starter: `// Longest Substring Without Repeating Characters
// Return the length of the longest run with no repeated character.

function lengthOfLongestSubstring(text) {
  // Your code here.
}

console.log(lengthOfLongestSubstring("abcabcbb"));
`,
  },

  "longest-repeating-character-replacement": {
    description:
      "You may change up to k characters to anything you like. Return the longest run of a single repeated letter you can produce. The question is really: how big can a window get before it needs more than k changes?",
    examples: [
      {
        input: 'text = "AABABBA", k = 1',
        output: "4",
        explanation:
          'Changing one B gives "AAAA" across four positions.',
      },
      {
        input: 'text = "ABAB", k = 2',
        output: "4",
        explanation: "Change both B's, and all four match.",
      },
    ],
    constraints: [
      "1 ≤ text.length ≤ 100,000",
      "0 ≤ k ≤ text.length; uppercase letters only.",
    ],
    starter: `// Longest Repeating Character Replacement
// With up to k changes, return the longest run of one repeated letter.

function characterReplacement(text, k) {
  // Your code here.
}

console.log(characterReplacement("AABABBA", 1));
`,
  },

  "permutation-in-string": {
    description:
      "Return true if the second string contains any rearrangement of the first as a contiguous stretch. Since a rearrangement has exactly the same letters in any order, only the letter counts matter — not their order.",
    examples: [
      {
        input: 'pattern = "ab", text = "eidbaooo"',
        output: "true",
        explanation: '"ba" appears, which is a rearrangement of "ab".',
      },
      {
        input: 'pattern = "ab", text = "eidboaoo"',
        output: "false",
        explanation: "The a and b never sit next to each other.",
      },
    ],
    constraints: ["1 ≤ lengths ≤ 10,000", "Lowercase letters only."],
    starter: `// Permutation in String
// Return true if text contains any rearrangement of pattern.

function checkInclusion(pattern, text) {
  // Your code here.
}

console.log(checkInclusion("ab", "eidbaooo"));
`,
  },

  "minimum-window-substring": {
    description:
      "Find the shortest stretch of the first string that contains every character of the second, counts included — so a pattern with two a's needs two a's. Return an empty string if no such stretch exists.",
    examples: [
      {
        input: 'text = "ADOBECODEBANC", pattern = "ABC"',
        output: "BANC",
        explanation: "The shortest stretch holding an A, a B and a C.",
      },
      {
        input: 'text = "a", pattern = "aa"',
        output: "(empty)",
        explanation: "Two a's are needed but only one exists.",
      },
    ],
    constraints: [
      "1 ≤ lengths ≤ 100,000",
      "Upper and lower case English letters.",
    ],
    starter: `// Minimum Window Substring
// Return the shortest stretch of text containing all of pattern.

function minWindow(text, pattern) {
  // Your code here.
}

console.log(minWindow("ADOBECODEBANC", "ABC"));
`,
  },

  "sliding-window-maximum": {
    description:
      "A window of size k slides along the array one position at a time. Report the largest value inside it at every position. Rechecking all k values each time is too slow — the trick is remembering which earlier values could still matter.",
    examples: [
      {
        input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3",
        output: "[3, 3, 5, 5, 6, 7]",
        explanation:
          "The first window is [1, 3, -1] with maximum 3; the last is [3, 6, 7] with maximum 7.",
      },
      {
        input: "nums = [1], k = 1",
        output: "[1]",
        explanation: "One window, one value.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 100,000", "1 ≤ k ≤ nums.length"],
    starter: `// Sliding Window Maximum
// Return the largest value in every window of size k.

function maxSlidingWindow(nums, k) {
  // Your code here.
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
`,
  },
};
