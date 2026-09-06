/**
 * sliding-window.js — a range that grows and shrinks as it moves along.
 *
 * The shape is always the same: `right` extends the window, and while the
 * window breaks some rule, `left` pulls it back in. Worth stepping through
 * slowly the first time — the rhythm is the whole pattern.
 */

export const slidingWindow = [
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    summary:
      "Buy on one day, sell on a later one, make as much as possible. Keep the cheapest price seen so far and ask what selling today would earn.",
    solution: `// Best Time to Buy and Sell Stock
// Remember the cheapest day so far; every day, ask what selling now would make.

function maxProfit(prices) {
  let cheapest = Infinity;
  let best = 0;

  for (const price of prices) {
    if (price < cheapest) {
      cheapest = price;
    } else {
      best = Math.max(best, price - cheapest);
    }
  }

  return best;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));
`,
    expectedOutput: "5",
  },

  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    summary:
      "Find the longest stretch with no repeated character. Extend the window to the right, and whenever a duplicate appears, drag the left edge past its previous copy.",
    solution: `// Longest Substring Without Repeating Characters
// Grow to the right; on a repeat, pull the left edge in.

function lengthOfLongestSubstring(text) {
  const window = new Set();
  let left = 0;
  let longest = 0;

  for (let right = 0; right < text.length; right++) {
    while (window.has(text[right])) {
      window.delete(text[left]);
      left++;
    }

    window.add(text[right]);
    longest = Math.max(longest, right - left + 1);
  }

  return longest;
}

console.log(lengthOfLongestSubstring("abcabcbb"));
`,
    expectedOutput: "3",
  },

  {
    id: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    summary:
      "You may change up to k characters. How long can you make a run of one letter? A window is valid while the characters that are not the most common one number k or fewer.",
    solution: `// Longest Repeating Character Replacement
// Valid while (window size - count of its most common letter) <= k.

function characterReplacement(text, k) {
  const counts = new Map();
  let left = 0;
  let mostCommon = 0;
  let longest = 0;

  for (let right = 0; right < text.length; right++) {
    const letter = text[right];
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
    mostCommon = Math.max(mostCommon, counts.get(letter));

    // Too many letters would need changing: shrink from the left.
    while (right - left + 1 - mostCommon > k) {
      counts.set(text[left], counts.get(text[left]) - 1);
      left++;
    }

    longest = Math.max(longest, right - left + 1);
  }

  return longest;
}

console.log(characterReplacement("AABABBA", 1));
`,
    expectedOutput: "4",
  },

  {
    id: "permutation-in-string",
    title: "Permutation in String",
    difficulty: "Medium",
    summary:
      "Does the second string contain any rearrangement of the first? Slide a window of exactly the right length and compare letter counts.",
    solution: `// Permutation in String
// A fixed-width window; compare its letter counts to the pattern's.

function countsOf(text) {
  const counts = new Map();
  for (const letter of text) {
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return counts;
}

function sameCounts(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const [letter, count] of a) {
    if (b.get(letter) !== count) {
      return false;
    }
  }
  return true;
}

function checkInclusion(pattern, text) {
  if (pattern.length > text.length) {
    return false;
  }

  const need = countsOf(pattern);
  const window = countsOf(text.slice(0, pattern.length));

  if (sameCounts(need, window)) {
    return true;
  }

  for (let right = pattern.length; right < text.length; right++) {
    // Add the new letter on the right.
    const entering = text[right];
    window.set(entering, (window.get(entering) ?? 0) + 1);

    // Drop the one falling off the left.
    const leaving = text[right - pattern.length];
    window.set(leaving, window.get(leaving) - 1);
    if (window.get(leaving) === 0) {
      window.delete(leaving);
    }

    if (sameCounts(need, window)) {
      return true;
    }
  }

  return false;
}

console.log(checkInclusion("ab", "eidbaooo"));
`,
    expectedOutput: "true",
  },

  {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    summary:
      "Find the shortest stretch containing every character of a pattern, counts included. Grow until the window is valid, then shrink from the left for as long as it stays valid.",
    solution: `// Minimum Window Substring
// Grow until valid, then shrink while still valid, recording the best.

function minWindow(text, pattern) {
  if (pattern.length > text.length) {
    return "";
  }

  const need = new Map();
  for (const letter of pattern) {
    need.set(letter, (need.get(letter) ?? 0) + 1);
  }

  const window = new Map();
  let satisfied = 0;
  let left = 0;
  let bestLength = Infinity;
  let bestStart = 0;

  for (let right = 0; right < text.length; right++) {
    const entering = text[right];
    window.set(entering, (window.get(entering) ?? 0) + 1);

    if (need.has(entering) && window.get(entering) === need.get(entering)) {
      satisfied++;
    }

    while (satisfied === need.size) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }

      const leaving = text[left];
      window.set(leaving, window.get(leaving) - 1);

      if (need.has(leaving) && window.get(leaving) < need.get(leaving)) {
        satisfied--;
      }

      left++;
    }
  }

  return bestLength === Infinity
    ? ""
    : text.slice(bestStart, bestStart + bestLength);
}

console.log(minWindow("ADOBECODEBANC", "ABC"));
`,
    expectedOutput: "BANC",
  },

  {
    id: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    summary:
      "Report the largest value in every window of size k. Keep a queue of indices whose values are decreasing — the front is always the current maximum.",
    solution: `// Sliding Window Maximum
// A deque of indices, kept in decreasing order of their values.

function maxSlidingWindow(nums, k) {
  const answer = [];
  const indices = []; // holds indices, values decreasing

  for (let right = 0; right < nums.length; right++) {
    // Anything smaller than the newcomer can never be a maximum again.
    while (
      indices.length > 0 &&
      nums[indices[indices.length - 1]] < nums[right]
    ) {
      indices.pop();
    }

    indices.push(right);

    // Drop the front if it has fallen out of the window.
    if (indices[0] <= right - k) {
      indices.shift();
    }

    if (right >= k - 1) {
      answer.push(nums[indices[0]]);
    }
  }

  return answer;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
`,
    expectedOutput: "[3, 3, 5, 5, 6, 7]",
  },
];
