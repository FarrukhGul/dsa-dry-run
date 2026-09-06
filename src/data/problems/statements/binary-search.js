/**
 * statements/binary-search.js — the questions for the binary search pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const binarySearchStatements = {
  "binary-search": {
    description:
      "Find a target in a sorted array and return its position, or -1 if it is not there. It must run in logarithmic time, which rules out simply scanning from one end.",
    examples: [
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
        explanation: "9 sits at position 4.",
      },
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        output: "-1",
        explanation: "2 is not in the array.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10,000",
      "The array is sorted and all values differ.",
    ],
    starter: `// Binary Search
// Return the position of target, or -1.

function search(nums, target) {
  // Your code here.
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));
`,
  },

  "search-a-2d-matrix": {
    description:
      "A grid where each row is sorted, and the first value of every row is greater than the last value of the row above. Decide whether a target is present, in logarithmic time — which means you may not search row by row.",
    examples: [
      {
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        output: "true",
        explanation: "3 sits in the first row.",
      },
      {
        input: "The same matrix, target = 13",
        output: "false",
        explanation: "13 would fall between 11 and 16, but is not there.",
      },
    ],
    constraints: ["1 ≤ rows, columns ≤ 100", "Every value is different."],
    starter: `// Search a 2D Matrix
// Return true if target is in the grid. Logarithmic time.

function searchMatrix(matrix, target) {
  // Your code here.
}

const matrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];

console.log(searchMatrix(matrix, 3));
`,
  },

  "koko-eating-bananas": {
    description:
      "There are piles of bananas and a fixed number of hours. Each hour you pick one pile and eat up to a chosen speed from it; if the pile is smaller than that, the rest of the hour is wasted. Find the slowest speed that still finishes every pile in time.",
    examples: [
      {
        input: "piles = [3, 6, 7, 11], h = 8",
        output: "4",
        explanation:
          "At speed 4 the piles take 1, 2, 2 and 3 hours: eight in total.",
      },
      {
        input: "piles = [30, 11, 23, 4, 20], h = 5",
        output: "30",
        explanation: "With only five hours, the biggest pile must go in one.",
      },
    ],
    constraints: [
      "1 ≤ piles.length ≤ h ≤ 1,000,000,000",
      "Only one pile per hour.",
    ],
    starter: `// Koko Eating Bananas
// Return the slowest speed that clears every pile within h hours.

function minEatingSpeed(piles, h) {
  // Your code here.
}

console.log(minEatingSpeed([3, 6, 7, 11], 8));
`,
  },

  "find-minimum-in-rotated-sorted-array": {
    description:
      "A sorted array has been rotated some number of times, so it now wraps around — [1,2,3,4] might have become [3,4,1,2]. Find the smallest value in logarithmic time.",
    examples: [
      {
        input: "nums = [3, 4, 5, 1, 2]",
        output: "1",
        explanation: "The array wraps between 5 and 1.",
      },
      {
        input: "nums = [11, 13, 15, 17]",
        output: "11",
        explanation: "Rotated all the way round, so it is simply sorted.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 5,000", "All values differ."],
    starter: `// Find Minimum in Rotated Sorted Array
// Return the smallest value, in logarithmic time.

function findMin(nums) {
  // Your code here.
}

console.log(findMin([3, 4, 5, 1, 2]));
`,
  },

  "search-in-rotated-sorted-array": {
    description:
      "The same rotated array, but now find a particular value and return its position, or -1. Still logarithmic time. The useful observation is that whichever way you cut it, one side of the middle is always properly sorted.",
    examples: [
      {
        input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
        output: "4",
        explanation: "0 sits at position 4.",
      },
      {
        input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
        output: "-1",
        explanation: "3 is not present.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 5,000", "All values differ."],
    starter: `// Search in Rotated Sorted Array
// Return the position of target, or -1. Logarithmic time.

function search(nums, target) {
  // Your code here.
}

console.log(search([4, 5, 6, 7, 0, 1, 2], 0));
`,
  },

  "time-based-key-value-store": {
    description:
      "Store values against a key and a timestamp, then look up the value a key had at a given moment — meaning the newest value stored at or before that time. Timestamps always arrive in increasing order for a given key.",
    examples: [
      {
        input: 'set("foo","bar",1), get("foo",3), set("foo","bar2",4), get("foo",5)',
        output: "bar, then bar2",
        explanation:
          'At time 3 the only value so far was "bar". By time 5, "bar2" had replaced it.',
      },
    ],
    constraints: [
      "Timestamps are strictly increasing per key.",
      'Return "" when nothing was stored at or before that time.',
    ],
    starter: `// Time Based Key-Value Store
// Return the newest value stored at or before the given timestamp.

class TimeMap {
  constructor() {
    // Your code here.
  }

  set(key, value, timestamp) {
    // Your code here.
  }

  get(key, timestamp) {
    // Your code here.
  }
}

const store = new TimeMap();
store.set("foo", "bar", 1);
console.log(store.get("foo", 3));
store.set("foo", "bar2", 4);
console.log(store.get("foo", 5));
`,
  },

  "median-of-two-sorted-arrays": {
    description:
      "Two sorted arrays are given. Find the median of all their values combined, without merging them — the whole point is doing it in logarithmic time. With an even total, the median is the average of the middle two.",
    examples: [
      {
        input: "nums1 = [1, 3], nums2 = [2]",
        output: "2",
        explanation: "Together they are [1, 2, 3], so the middle value is 2.",
      },
      {
        input: "nums1 = [1, 2], nums2 = [3, 4]",
        output: "2.5",
        explanation: "Together [1,2,3,4]; the middle two average to 2.5.",
      },
    ],
    constraints: [
      "0 ≤ each length ≤ 1,000",
      "Both arrays are sorted; at least one is non-empty.",
    ],
    starter: `// Median of Two Sorted Arrays
// Return the median of both arrays combined, in logarithmic time.

function findMedianSortedArrays(nums1, nums2) {
  // Your code here.
}

console.log(findMedianSortedArrays([1, 3], [2]));
`,
  },
};
