/**
 * dp-1d.js — build the answer from the answers to smaller versions.
 *
 * Dynamic programming is the pattern that most rewards stepping through. The
 * array view fills in one cell at a time as you press Next, and the recurrence
 * stops being an equation and becomes something you can watch happen.
 */

export const dp1d = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    summary:
      "Count the ways to climb n steps taking one or two at a time. The ways to reach a step are the ways to reach the two below it — which is Fibonacci wearing a hat.",
    solution: `// Climbing Stairs
// Ways to reach a step = ways to the one below + ways to the two below.

function climbStairs(n) {
  let twoBack = 1;
  let oneBack = 1;

  for (let step = 2; step <= n; step++) {
    const ways = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = ways;
  }

  return oneBack;
}

console.log(climbStairs(5));
`,
    expectedOutput: "8",
  },

  {
    id: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    summary:
      "Each step charges a toll; reach the top for as little as possible. Work backwards — the cost of standing on a step is its own toll plus the cheaper of the two ahead.",
    solution: `// Min Cost Climbing Stairs
// Work backwards: cost here = my toll + cheaper of the next two.

function minCostClimbingStairs(cost) {
  const steps = [...cost, 0]; // a free step past the end, the "top"

  for (let i = steps.length - 3; i >= 0; i--) {
    steps[i] = steps[i] + Math.min(steps[i + 1], steps[i + 2]);
  }

  return Math.min(steps[0], steps[1]);
}

console.log(minCostClimbingStairs([10, 15, 20]));
`,
    expectedOutput: "15",
  },

  {
    id: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    summary:
      "Take as much as possible without robbing two houses in a row. At each house the choice is simple: skip it, or take it and add whatever was best two houses back.",
    solution: `// House Robber
// At each house: skip it, or take it plus the best from two back.

function rob(houses) {
  let twoBack = 0;
  let oneBack = 0;

  for (const money of houses) {
    const best = Math.max(oneBack, twoBack + money);
    twoBack = oneBack;
    oneBack = best;
  }

  return oneBack;
}

console.log(rob([2, 7, 9, 3, 1]));
`,
    expectedOutput: "12",
  },

  {
    id: "house-robber-ii",
    title: "House Robber II",
    difficulty: "Medium",
    summary:
      "The same street, now a circle — so the first and last houses are neighbours. Run the straight-line version twice, once without the first house and once without the last.",
    solution: `// House Robber II
// A circle: the first and last cannot both be robbed. So try it both ways.

function robLine(houses) {
  let twoBack = 0;
  let oneBack = 0;

  for (const money of houses) {
    const best = Math.max(oneBack, twoBack + money);
    twoBack = oneBack;
    oneBack = best;
  }

  return oneBack;
}

function rob(houses) {
  if (houses.length === 1) {
    return houses[0];
  }

  const withoutLast = robLine(houses.slice(0, houses.length - 1));
  const withoutFirst = robLine(houses.slice(1));

  return Math.max(withoutLast, withoutFirst);
}

console.log(rob([2, 3, 2]));
`,
    expectedOutput: "3",
  },

  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    summary:
      "Find the longest stretch that reads the same both ways. Every palindrome has a centre, so try each one and push outwards — remembering that even-length ones sit between two characters.",
    solution: `// Longest Palindromic Substring
// Try every centre and expand outwards from it.

function longestPalindrome(text) {
  let bestStart = 0;
  let bestLength = 0;

  function expand(left, right) {
    while (left >= 0 && right < text.length && text[left] === text[right]) {
      left--;
      right++;
    }

    // The loop overshoots by one on each side.
    const length = right - left - 1;

    if (length > bestLength) {
      bestLength = length;
      bestStart = left + 1;
    }
  }

  for (let centre = 0; centre < text.length; centre++) {
    expand(centre, centre);     // odd length, centred on a character
    expand(centre, centre + 1); // even length, centred between two
  }

  return text.slice(bestStart, bestStart + bestLength);
}

console.log(longestPalindrome("babad"));
`,
    expectedOutput: "bab",
  },

  {
    id: "palindromic-substrings",
    title: "Palindromic Substrings",
    difficulty: "Medium",
    summary:
      "Count every palindromic stretch, including single characters. The same expand-from-each-centre idea, counting instead of measuring.",
    solution: `// Palindromic Substrings
// Same centres, but counting every palindrome rather than the longest.

function countSubstrings(text) {
  let count = 0;

  function expand(left, right) {
    while (left >= 0 && right < text.length && text[left] === text[right]) {
      count++;
      left--;
      right++;
    }
  }

  for (let centre = 0; centre < text.length; centre++) {
    expand(centre, centre);
    expand(centre, centre + 1);
  }

  return count;
}

console.log(countSubstrings("aaa"));
`,
    expectedOutput: "6",
  },

  {
    id: "decode-ways",
    title: "Decode Ways",
    difficulty: "Medium",
    summary:
      "Digits map to letters, 1 to 26, so a string of digits may decode several ways. Ways to decode from a position depend on taking one digit or two — with zero as the awkward case.",
    solution: `// Decode Ways
// From each position: take one digit, or two if they make 10 to 26.

function numDecodings(digits) {
  // ways[i] = how many ways to decode from position i onwards.
  const ways = new Array(digits.length + 1).fill(0);
  ways[digits.length] = 1; // one way to decode nothing: stop

  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] === "0") {
      ways[i] = 0; // nothing starts with zero
      continue;
    }

    ways[i] = ways[i + 1];

    // Can we also take two digits here?
    if (i + 1 < digits.length) {
      const pair = Number(digits[i] + digits[i + 1]);
      if (pair <= 26) {
        ways[i] += ways[i + 2];
      }
    }
  }

  return ways[0];
}

console.log(numDecodings("226"));
`,
    expectedOutput: "3",
  },

  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    summary:
      "The fewest coins making a given amount. Build up every amount from zero: each one is one coin more than the best way to make what is left after taking a coin.",
    solution: `// Coin Change
// Best for an amount = 1 + best for (amount - coin), over every coin.

function coinChange(coins, amount) {
  const fewest = new Array(amount + 1).fill(Infinity);
  fewest[0] = 0; // no coins needed to make nothing

  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin > total) continue;

      fewest[total] = Math.min(fewest[total], 1 + fewest[total - coin]);
    }
  }

  return fewest[amount] === Infinity ? -1 : fewest[amount];
}

console.log(coinChange([1, 2, 5], 11));
`,
    expectedOutput: "3",
  },

  {
    id: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    summary:
      "The largest product of any run of numbers. Negatives are the catch — the most negative product can become the largest the moment another negative arrives, so track both extremes.",
    solution: `// Maximum Product Subarray
// Track the biggest AND the smallest: a negative flips them.

function maxProduct(nums) {
  let biggest = nums[0];
  let smallest = nums[0];
  let answer = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const number = nums[i];

    // Work these out together, from the previous values.
    const candidates = [number, biggest * number, smallest * number];

    biggest = Math.max(...candidates);
    smallest = Math.min(...candidates);

    answer = Math.max(answer, biggest);
  }

  return answer;
}

console.log(maxProduct([2, 3, -2, 4]));
`,
    expectedOutput: "6",
  },

  {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    summary:
      "Can a string be cut into dictionary words? Work backwards: a position is reachable if some word starts there and the position after it is reachable too.",
    solution: `// Word Break
// Position i works if a word starts there and the rest works too.

function wordBreak(text, wordDict) {
  const reachable = new Array(text.length + 1).fill(false);
  reachable[text.length] = true; // the end is always reachable

  for (let start = text.length - 1; start >= 0; start--) {
    for (const word of wordDict) {
      const fits =
        start + word.length <= text.length &&
        text.slice(start, start + word.length) === word;

      if (fits && reachable[start + word.length]) {
        reachable[start] = true;
        break;
      }
    }
  }

  return reachable[0];
}

console.log(wordBreak("leetcode", ["leet", "code"]));
`,
    expectedOutput: "true",
  },

  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    summary:
      "The longest rising run, not necessarily adjacent. For each position, ask how long a run ending here can be, by looking at every smaller number before it.",
    solution: `// Longest Increasing Subsequence
// longest[i] = the best run ending at i.

function lengthOfLIS(nums) {
  const longest = new Array(nums.length).fill(1);
  let answer = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        longest[i] = Math.max(longest[i], longest[j] + 1);
      }
    }

    answer = Math.max(answer, longest[i]);
  }

  return answer;
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
`,
    expectedOutput: "4",
  },

  {
    id: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    summary:
      "Can the numbers be split into two halves of equal total? That is really asking whether some subset adds to half the total — a knapsack in disguise.",
    solution: `// Partition Equal Subset Sum
// Really: can any subset add up to half the total?

function canPartition(nums) {
  let total = 0;
  for (const number of nums) {
    total += number;
  }

  if (total % 2 !== 0) {
    return false; // an odd total cannot split evenly
  }

  const target = total / 2;

  // Which sums are reachable using the numbers seen so far.
  let reachable = new Set([0]);

  for (const number of nums) {
    const next = new Set(reachable);

    for (const sum of reachable) {
      next.add(sum + number);
    }

    reachable = next;
  }

  return reachable.has(target);
}

console.log(canPartition([1, 5, 11, 5]));
`,
    expectedOutput: "true",
  },
];
