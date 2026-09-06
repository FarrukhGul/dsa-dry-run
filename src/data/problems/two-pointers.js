/**
 * two-pointers.js — two indices walking an array, usually towards each other.
 *
 * These are the problems the array view was built for: press Next and watch
 * `left` and `right` close in on each other under the cells.
 */

export const twoPointers = [
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    summary:
      "Decide whether a phrase reads the same backwards, ignoring punctuation and capitals. Walk in from both ends and compare.",
    solution: `// Valid Palindrome
// Skip anything that is not a letter or digit, then compare both ends.

function isAlphanumeric(character) {
  return /[a-z0-9]/i.test(character);
}

function isPalindrome(text) {
  let left = 0;
  let right = text.length - 1;

  while (left < right) {
    while (left < right && !isAlphanumeric(text[left])) {
      left++;
    }
    while (left < right && !isAlphanumeric(text[right])) {
      right--;
    }

    if (text[left].toLowerCase() !== text[right].toLowerCase()) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
`,
    expectedOutput: "true",
  },

  {
    id: "two-sum-ii",
    title: "Two Sum II — Sorted Input",
    difficulty: "Medium",
    summary:
      "Two Sum again, but the array is sorted — which changes everything. If the pair is too small move the left pointer up, if too large move the right one down.",
    solution: `// Two Sum II - Input Array Is Sorted
// Sorted input means the sum tells you which pointer to move.

function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      // The answer is 1-based for this problem.
      return [left + 1, right + 1];
    }

    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
    expectedOutput: "[1, 2]",
  },

  {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    summary:
      "Find every unique triple that sums to zero. Fix one number, then the rest is Two Sum on a sorted array — the work is in skipping duplicates.",
    solution: `// 3Sum
// Sort, fix the first number, then two-pointer the remainder.

function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    // Skip a repeated first number, or we would repeat its triples.
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];

      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        answer.push([sorted[i], sorted[left], sorted[right]]);
        left++;

        // Skip repeats of the number we just used.
        while (left < right && sorted[left] === sorted[left - 1]) {
          left++;
        }
      }
    }
  }

  return answer;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]));
`,
    expectedOutput: "[[-1, -1, 2], [-1, 0, 1]]",
  },

  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    summary:
      "Pick two lines that hold the most water between them. Start as wide as possible, then always move the shorter side inwards — the taller one can never be the reason you improve.",
    solution: `// Container With Most Water
// Start wide, and always move whichever side is shorter.

function maxArea(heights) {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;

  while (left < right) {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]);
    best = Math.max(best, width * height);

    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--;
    }
  }

  return best;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
`,
    expectedOutput: "49",
  },

  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    summary:
      "Work out how much rain collects between the bars. Water above any bar is decided by the tallest bar on each side — so track the best seen so far from both directions at once.",
    solution: `// Trapping Rain Water
// Water above a bar = min(tallest left, tallest right) - its own height.

function trap(heights) {
  if (heights.length === 0) {
    return 0;
  }

  let left = 0;
  let right = heights.length - 1;
  let leftMax = heights[left];
  let rightMax = heights[right];
  let water = 0;

  while (left < right) {
    // Move whichever side has the smaller wall: that side's answer is
    // already decided, because the other wall is definitely taller.
    if (leftMax < rightMax) {
      left++;
      leftMax = Math.max(leftMax, heights[left]);
      water += leftMax - heights[left];
    } else {
      right--;
      rightMax = Math.max(rightMax, heights[right]);
      water += rightMax - heights[right];
    }
  }

  return water;
}

console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));
`,
    expectedOutput: "6",
  },
];
