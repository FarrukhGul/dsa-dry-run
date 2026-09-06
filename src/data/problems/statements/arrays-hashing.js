/**
 * statements/arrays-hashing.js — the questions, kept apart from the answers.
 *
 * WHY THIS IS A SEPARATE FILE
 *
 * The solution files next door are the answers. These are the questions. Since
 * the whole point of "solve it myself" is that you can read one without seeing
 * the other, keeping them in different files is not just tidiness — it is the
 * same separation the interface makes.
 *
 * Keyed by problem id. Merged in by data/problems/index.js.
 *
 *   description   two to four sentences, shown beside the editor
 *   examples      input, output, and WHY — the part that makes it click
 *   constraints   what sizes to expect
 *   starter       the stub for solve mode: helpers and the example call kept,
 *                 only the function you are asked to write left empty
 *
 * ⚠️ Every word here is our own. LeetCode's problem statements are
 * copyrighted, so nothing is copied from them.
 */

export const arraysHashingStatements = {
  "contains-duplicate": {
    description:
      "You are given an array of numbers. Return true if any value appears at least twice, and false if every value is distinct. Comparing every pair works but is far too slow on a large array — the interesting question is how to answer it in a single pass.",
    examples: [
      {
        input: "nums = [1, 2, 3, 1]",
        output: "true",
        explanation: "The value 1 appears at both the start and the end.",
      },
      {
        input: "nums = [1, 2, 3, 4]",
        output: "false",
        explanation: "Every value is different, so nothing is repeated.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 100,000", "Values may be negative."],
    starter: `// Contains Duplicate
// Return true if any value appears more than once.

function hasDuplicate(nums) {
  // Your code here.
}

console.log(hasDuplicate([1, 2, 3, 1]));
`,
  },

  "valid-anagram": {
    description:
      "Given two strings, decide whether the second is a rearrangement of the first. They must use the same letters exactly the same number of times, so 'aab' and 'aba' match but 'aab' and 'abb' do not. Sorting both and comparing works; counting letters is faster.",
    examples: [
      {
        input: 'first = "anagram", second = "nagaram"',
        output: "true",
        explanation: "Both use three a's, one n, one g, one r and one m.",
      },
      {
        input: 'first = "rat", second = "car"',
        output: "false",
        explanation: "The first has a t where the second has a c.",
      },
    ],
    constraints: [
      "1 ≤ length ≤ 50,000",
      "Lowercase English letters only.",
    ],
    starter: `// Valid Anagram
// Return true if the second string is a rearrangement of the first.

function isAnagram(first, second) {
  // Your code here.
}

console.log(isAnagram("anagram", "nagaram"));
`,
  },

  "two-sum": {
    description:
      "Given an array of numbers and a target, return the positions of the two values that add up to that target. Exactly one pair will work, and you may not use the same position twice. The obvious approach checks every pair; the good one makes a single pass.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] is 2 + 7, which is 9.",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation:
          "2 + 4 is 6. Note 3 + 3 is not allowed — that is one position used twice.",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10,000",
      "Exactly one valid pair exists.",
    ],
    starter: `// Two Sum
// Return the two positions whose values add up to target.

function twoSum(nums, target) {
  // Your code here.
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
  },

  "group-anagrams": {
    description:
      "Given a list of words, group together the ones that are anagrams of each other. Each group may come back in any order, and so may the groups themselves. The key idea is finding something two anagrams always share, so it can be used to look their group up.",
    examples: [
      {
        input: 'words = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]',
        explanation:
          "eat, tea and ate all sort to aet. tan and nat both sort to ant. bat is alone.",
      },
    ],
    constraints: [
      "1 ≤ words.length ≤ 10,000",
      "Words are lowercase, and may be empty.",
    ],
    starter: `// Group Anagrams
// Group the words that are anagrams of each other.

function groupAnagrams(words) {
  // Your code here.
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
`,
  },

  "top-k-frequent-elements": {
    description:
      "Given an array and a number k, return the k values that appear most frequently. Counting them is the easy half; the interesting half is finding the top k without sorting every count, since a value can appear at most n times.",
    examples: [
      {
        input: "nums = [1, 1, 1, 2, 2, 3], k = 2",
        output: "[1, 2]",
        explanation:
          "1 appears three times and 2 appears twice, so those are the top two.",
      },
      {
        input: "nums = [7], k = 1",
        output: "[7]",
        explanation: "Only one value exists, so it is the most frequent.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 100,000",
      "k is between 1 and the number of distinct values.",
    ],
    starter: `// Top K Frequent Elements
// Return the k values that appear most often.

function topKFrequent(nums, k) {
  // Your code here.
}

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));
`,
  },

  "encode-and-decode-strings": {
    description:
      "Write two functions: one that joins a list of strings into a single string, and one that splits it back into exactly the original list. The catch is that the words may contain any characters at all, so no separator is safe on its own.",
    examples: [
      {
        input: 'words = ["neet", "code", "love", "you"]',
        output: '["neet", "code", "love", "you"]',
        explanation:
          "Encoding gives 4#neet4#code4#love3#you, and decoding that returns the original list.",
      },
      {
        input: 'words = ["", "a#b"]',
        output: '["", "a#b"]',
        explanation:
          "An empty word and a word containing the separator both survive, because the length says how far to read.",
      },
    ],
    constraints: [
      "0 ≤ words.length ≤ 200",
      "Words may contain any characters, including # and digits.",
    ],
    starter: `// Encode and Decode Strings
// Join the list into one string, and split it back again.

function encode(words) {
  // Your code here.
}

function decode(text) {
  // Your code here.
}

const encoded = encode(["neet", "code", "love", "you"]);
console.log(decode(encoded));
`,
  },

  "product-of-array-except-self": {
    description:
      "Return an array where each position holds the product of every other number in the input. You may not use division, which rules out multiplying everything and dividing — and division would break on a zero anyway.",
    examples: [
      {
        input: "nums = [1, 2, 3, 4]",
        output: "[24, 12, 8, 6]",
        explanation:
          "Position 0 is 2 x 3 x 4 = 24. Position 1 is 1 x 3 x 4 = 12, and so on.",
      },
      {
        input: "nums = [-1, 1, 0, -3, 3]",
        output: "[0, 0, 9, 0, 0]",
        explanation:
          "Only the position holding the zero avoids being multiplied by it.",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 100,000",
      "Division is not allowed.",
    ],
    starter: `// Product of Array Except Self
// answer[i] = the product of every number EXCEPT nums[i]. No division.

function productExceptSelf(nums) {
  // Your code here.
}

console.log(productExceptSelf([1, 2, 3, 4]));
`,
  },

  "valid-sudoku": {
    description:
      "Given a nine by nine Sudoku board where empty squares are marked with a full stop, decide whether what has been filled in so far is legal. A board is legal when no digit repeats within any row, any column, or any of the nine three-by-three boxes. You are not asked to solve it.",
    examples: [
      {
        input: "A board whose first row is 5 3 . . 7 . . . .",
        output: "true",
        explanation:
          "No row, column or box holds the same digit twice, so it is legal so far.",
      },
      {
        input: "The same board with the top-left 5 changed to 8",
        output: "false",
        explanation:
          "That top-left box would then hold two 8s, breaking the box rule.",
      },
    ],
    constraints: [
      "The board is always 9 by 9.",
      'Squares hold the digits 1 to 9, or "." for empty.',
    ],
    starter: `// Valid Sudoku
// Return true if no digit repeats in any row, column or 3x3 box.

function isValidSudoku(board) {
  // Your code here.
}

const board = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];

console.log(isValidSudoku(board));
`,
  },

  "longest-consecutive-sequence": {
    description:
      "Given an unsorted array, find the length of the longest run of consecutive integers it contains. The numbers need not be adjacent in the array — only their values matter. Sorting solves it, but there is a way to do it in roughly one pass.",
    examples: [
      {
        input: "nums = [100, 4, 200, 1, 3, 2]",
        output: "4",
        explanation: "The run 1, 2, 3, 4 is four long. 100 and 200 stand alone.",
      },
      {
        input: "nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
        output: "9",
        explanation: "0 through 8 are all present — nine consecutive values.",
      },
    ],
    constraints: [
      "0 ≤ nums.length ≤ 100,000",
      "Values may repeat and may be negative.",
    ],
    starter: `// Longest Consecutive Sequence
// Return the length of the longest run of consecutive values.

function longestConsecutive(nums) {
  // Your code here.
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
`,
  },
};
