/**
 * binary-search.js — halve the search space, every step.
 *
 * Worth stepping through carefully: almost every bug in binary search is an
 * off-by-one in the boundary update, and watching `left`, `mid` and `right`
 * move under the cells is the fastest way to see it.
 */

export const binarySearch = [
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    summary:
      "Find a value in a sorted array. Look at the middle, throw away the half it cannot be in, repeat.",
    solution: `// Binary Search
// Check the middle, discard the half that cannot contain the target.

function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    // Written this way rather than (left + right) / 2 so that very large
    // indices cannot overflow. A good habit, even in JavaScript.
    const middle = left + Math.floor((right - left) / 2);

    if (nums[middle] === target) {
      return middle;
    }

    if (nums[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));
`,
    expectedOutput: "4",
  },

  {
    id: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    summary:
      "A grid whose rows are sorted, and each row starts after the last one ends. That makes it one long sorted list — so treat the index as a row and column pair.",
    solution: `// Search a 2D Matrix
// The grid is really one sorted list, folded into rows.

function searchMatrix(matrix, target) {
  const rows = matrix.length;
  const columns = matrix[0].length;

  let left = 0;
  let right = rows * columns - 1;

  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);

    // Unfold the flat index back into a position on the grid.
    const value = matrix[Math.floor(middle / columns)][middle % columns];

    if (value === target) {
      return true;
    }

    if (value < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return false;
}

const matrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];

console.log(searchMatrix(matrix, 3));
`,
    expectedOutput: "true",
  },

  {
    id: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    summary:
      "Find the slowest eating speed that still finishes in time. You are not searching an array here — you are searching the answer itself, between 1 and the largest pile.",
    solution: `// Koko Eating Bananas
// Binary search over the ANSWER: the speed, not the array.

function hoursNeeded(piles, speed) {
  let hours = 0;

  for (const pile of piles) {
    hours += Math.ceil(pile / speed);
  }

  return hours;
}

function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);
  let slowest = right;

  while (left <= right) {
    const speed = left + Math.floor((right - left) / 2);

    if (hoursNeeded(piles, speed) <= h) {
      // Fast enough — but maybe slower would do too.
      slowest = speed;
      right = speed - 1;
    } else {
      left = speed + 1;
    }
  }

  return slowest;
}

console.log(minEatingSpeed([3, 6, 7, 11], 8));
`,
    expectedOutput: "4",
  },

  {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    summary:
      "A sorted array has been rotated; find the smallest value. Compare the middle with the right end to work out which half still holds the wrap-around point.",
    solution: `// Find Minimum in Rotated Sorted Array
// The smallest value sits exactly where the array wraps around.

function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);

    if (nums[middle] > nums[right]) {
      // The wrap must be to the right of middle.
      left = middle + 1;
    } else {
      // Middle could itself be the smallest, so keep it.
      right = middle;
    }
  }

  return nums[left];
}

console.log(findMin([3, 4, 5, 1, 2]));
`,
    expectedOutput: "1",
  },

  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    summary:
      "Find a value in a rotated sorted array. One half either side of the middle is always properly sorted — work out which, then decide whether the target lies in it.",
    solution: `// Search in Rotated Sorted Array
// One side of the middle is always sorted. Use that side to decide.

function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);

    if (nums[middle] === target) {
      return middle;
    }

    if (nums[left] <= nums[middle]) {
      // The left half is sorted.
      if (target >= nums[left] && target < nums[middle]) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    } else {
      // Then the right half must be sorted.
      if (target > nums[middle] && target <= nums[right]) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }
  }

  return -1;
}

console.log(search([4, 5, 6, 7, 0, 1, 2], 0));
`,
    expectedOutput: "4",
  },

  {
    id: "time-based-key-value-store",
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    summary:
      "Store values against a timestamp, and read back the newest value at or before a given time. Values arrive in order, so each key's history is already sorted — binary search it.",
    solution: `// Time Based Key-Value Store
// Each key keeps a sorted history; getting a value is a binary search.

class TimeMap {
  constructor() {
    this.history = new Map();
  }

  set(key, value, timestamp) {
    if (!this.history.has(key)) {
      this.history.set(key, []);
    }

    this.history.get(key).push({ value, timestamp });
  }

  get(key, timestamp) {
    const entries = this.history.get(key) ?? [];
    let answer = "";

    let left = 0;
    let right = entries.length - 1;

    while (left <= right) {
      const middle = left + Math.floor((right - left) / 2);

      if (entries[middle].timestamp <= timestamp) {
        // Good enough — but look right for something newer.
        answer = entries[middle].value;
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }

    return answer;
  }
}

const store = new TimeMap();
store.set("foo", "bar", 1);
console.log(store.get("foo", 3));
store.set("foo", "bar2", 4);
console.log(store.get("foo", 5));
`,
    expectedOutput: "bar\nbar2",
  },

  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    summary:
      "Find the median of two sorted arrays without merging them. Binary search the cut point in the smaller array — the cut in the other one follows from it.",
    solution: `// Median of Two Sorted Arrays
// Search for where to cut the smaller array; the other cut follows.

function findMedianSortedArrays(nums1, nums2) {
  // Always binary search the shorter array.
  let a = nums1;
  let b = nums2;
  if (a.length > b.length) {
    a = nums2;
    b = nums1;
  }

  const total = a.length + b.length;
  const half = Math.floor(total / 2);

  let left = 0;
  let right = a.length;

  while (true) {
    const cutA = Math.floor((left + right) / 2);
    const cutB = half - cutA;

    // The values either side of each cut. Infinities stand in for "nothing".
    const leftA = cutA > 0 ? a[cutA - 1] : -Infinity;
    const rightA = cutA < a.length ? a[cutA] : Infinity;
    const leftB = cutB > 0 ? b[cutB - 1] : -Infinity;
    const rightB = cutB < b.length ? b[cutB] : Infinity;

    if (leftA <= rightB && leftB <= rightA) {
      // Cuts are correct.
      if (total % 2 === 1) {
        return Math.min(rightA, rightB);
      }
      return (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
    }

    if (leftA > rightB) {
      right = cutA - 1;
    } else {
      left = cutA + 1;
    }
  }
}

console.log(findMedianSortedArrays([1, 3], [2]));
`,
    expectedOutput: "2",
  },
];
