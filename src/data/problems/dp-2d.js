/**
 * dp-2d.js — the same idea as 1-D, on a grid of subproblems.
 *
 * Almost all of these compare two sequences, and the grid holds "the answer
 * for the first i of one and the first j of the other". The grid view fills in
 * as you step, which makes the recurrence much easier to believe.
 */

export const dp2d = [
  {
    id: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    summary:
      "Count the routes across a grid moving only right or down. The ways to reach a square are the ways to reach the one above plus the one to its left.",
    solution: `// Unique Paths
// Ways to a square = ways from above + ways from the left.

function uniquePaths(rows, columns) {
  // One row of the grid at a time is enough: we only need the row above.
  let above = new Array(columns).fill(1);

  for (let row = 1; row < rows; row++) {
    const current = new Array(columns).fill(1);

    for (let column = 1; column < columns; column++) {
      current[column] = current[column - 1] + above[column];
    }

    above = current;
  }

  return above[columns - 1];
}

console.log(uniquePaths(3, 7));
`,
    expectedOutput: "28",
  },

  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    summary:
      "The longest sequence appearing in both strings, in order but not necessarily together. If the two current characters match, they are worth one plus the rest; if not, drop one and try again.",
    solution: `// Longest Common Subsequence
// Matching characters add one; otherwise drop one side and take the best.

function longestCommonSubsequence(a, b) {
  // grid[i][j] = the answer for a.slice(i) and b.slice(j)
  const grid = [];
  for (let i = 0; i <= a.length; i++) {
    grid.push(new Array(b.length + 1).fill(0));
  }

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        grid[i][j] = 1 + grid[i + 1][j + 1];
      } else {
        grid[i][j] = Math.max(grid[i + 1][j], grid[i][j + 1]);
      }
    }
  }

  return grid[0][0];
}

console.log(longestCommonSubsequence("abcde", "ace"));
`,
    expectedOutput: "3",
  },

  {
    id: "best-time-to-buy-and-sell-stock-with-cooldown",
    title: "Buy and Sell Stock with Cooldown",
    difficulty: "Medium",
    summary:
      "Trade freely, but you must sit out a day after every sale. Two running totals do it: the best if you currently hold a share, and the best if you do not.",
    solution: `// Best Time to Buy and Sell Stock with Cooldown
// Track the best while holding a share and the best while not.

function maxProfit(prices) {
  let holding = -Infinity;   // best total while holding a share
  let free = 0;              // best total, free to buy today
  let cooling = 0;           // best total, sold yesterday so resting

  for (const price of prices) {
    const previousHolding = holding;
    const previousFree = free;
    const previousCooling = cooling;

    // Keep holding, or buy today (only allowed if not cooling down).
    holding = Math.max(previousHolding, previousFree - price);

    // Sell today, which forces a rest tomorrow.
    cooling = previousHolding + price;

    // Stay free, or come off yesterday's cooldown.
    free = Math.max(previousFree, previousCooling);
  }

  return Math.max(free, cooling);
}

console.log(maxProfit([1, 2, 3, 0, 2]));
`,
    expectedOutput: "3",
  },

  {
    id: "coin-change-ii",
    title: "Coin Change II",
    difficulty: "Medium",
    summary:
      "Count the combinations making an amount, not the fewest coins. Looping over coins on the outside is what stops the same combination being counted in different orders.",
    solution: `// Coin Change II
// Coins on the OUTSIDE loop, so each combination is counted once.

function change(amount, coins) {
  const ways = new Array(amount + 1).fill(0);
  ways[0] = 1; // one way to make nothing

  for (const coin of coins) {
    for (let total = coin; total <= amount; total++) {
      ways[total] += ways[total - coin];
    }
  }

  return ways[amount];
}

console.log(change(5, [1, 2, 5]));
`,
    expectedOutput: "4",
  },

  {
    id: "target-sum",
    title: "Target Sum",
    difficulty: "Medium",
    summary:
      "Put a plus or minus in front of every number to hit a target; count the ways. Track how many ways lead to each running total as the numbers are used up.",
    solution: `// Target Sum
// Count how many ways reach each running total.

function findTargetSumWays(nums, target) {
  // totals: running total -> how many ways to reach it
  let totals = new Map([[0, 1]]);

  for (const number of nums) {
    const next = new Map();

    for (const [sum, count] of totals) {
      for (const signed of [sum + number, sum - number]) {
        next.set(signed, (next.get(signed) ?? 0) + count);
      }
    }

    totals = next;
  }

  return totals.get(target) ?? 0;
}

console.log(findTargetSumWays([1, 1, 1, 1, 1], 3));
`,
    expectedOutput: "5",
  },

  {
    id: "interleaving-string",
    title: "Interleaving String",
    difficulty: "Medium",
    summary:
      "Can two strings be shuffled together to make a third, each keeping its own order? The grid answers 'using i of the first and j of the second, can we build that much?'",
    solution: `// Interleaving String
// grid[i][j]: can a.slice(i) and b.slice(j) build the rest of the target?

function isInterleave(a, b, target) {
  if (a.length + b.length !== target.length) {
    return false;
  }

  const grid = [];
  for (let i = 0; i <= a.length; i++) {
    grid.push(new Array(b.length + 1).fill(false));
  }

  grid[a.length][b.length] = true; // both used up, target used up

  for (let i = a.length; i >= 0; i--) {
    for (let j = b.length; j >= 0; j--) {
      if (i < a.length && a[i] === target[i + j] && grid[i + 1][j]) {
        grid[i][j] = true;
      }

      if (j < b.length && b[j] === target[i + j] && grid[i][j + 1]) {
        grid[i][j] = true;
      }
    }
  }

  return grid[0][0];
}

console.log(isInterleave("aabcc", "dbbca", "aadbbcbcac"));
`,
    expectedOutput: "true",
  },

  {
    id: "longest-increasing-path-in-a-matrix",
    title: "Longest Increasing Path in a Matrix",
    difficulty: "Hard",
    summary:
      "The longest strictly rising walk through a grid. Because the path must increase it can never loop, so a plain memoised search works — each square's answer is computed once.",
    solution: `// Longest Increasing Path in a Matrix
// Strictly increasing means no cycles, so memoised DFS is enough.

function longestIncreasingPath(matrix) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const known = new Map();

  function longestFrom(row, column) {
    const key = row + "," + column;
    if (known.has(key)) {
      return known.get(key);
    }

    let best = 1;

    const neighbours = [
      [row + 1, column],
      [row - 1, column],
      [row, column + 1],
      [row, column - 1],
    ];

    for (const [r, c] of neighbours) {
      if (r < 0 || c < 0 || r >= rows || c >= columns) continue;
      if (matrix[r][c] <= matrix[row][column]) continue;

      best = Math.max(best, 1 + longestFrom(r, c));
    }

    known.set(key, best);
    return best;
  }

  let answer = 0;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      answer = Math.max(answer, longestFrom(row, column));
    }
  }

  return answer;
}

console.log(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]));
`,
    expectedOutput: "4",
  },

  {
    id: "distinct-subsequences",
    title: "Distinct Subsequences",
    difficulty: "Hard",
    summary:
      "How many ways can the second string be found inside the first as a subsequence? When characters match you may either use the match or skip past it — and both count.",
    solution: `// Distinct Subsequences
// On a match you may use it OR skip it, and both are counted.

function numDistinct(source, target) {
  const grid = [];
  for (let i = 0; i <= source.length; i++) {
    grid.push(new Array(target.length + 1).fill(0));
  }

  // An empty target is found exactly once in anything.
  for (let i = 0; i <= source.length; i++) {
    grid[i][target.length] = 1;
  }

  for (let i = source.length - 1; i >= 0; i--) {
    for (let j = target.length - 1; j >= 0; j--) {
      // Always an option: skip this source character.
      grid[i][j] = grid[i + 1][j];

      if (source[i] === target[j]) {
        grid[i][j] += grid[i + 1][j + 1];
      }
    }
  }

  return grid[0][0];
}

console.log(numDistinct("rabbbit", "rabbit"));
`,
    expectedOutput: "3",
  },

  {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Medium",
    summary:
      "The fewest insertions, deletions or replacements turning one word into another. Matching characters cost nothing; otherwise take the cheapest of the three moves and add one.",
    solution: `// Edit Distance
// A match is free. Otherwise: insert, delete or replace, whichever is cheapest.

function minDistance(a, b) {
  const grid = [];
  for (let i = 0; i <= a.length; i++) {
    grid.push(new Array(b.length + 1).fill(0));
  }

  // Turning something into nothing costs one delete per character.
  for (let i = 0; i <= a.length; i++) grid[i][b.length] = a.length - i;
  for (let j = 0; j <= b.length; j++) grid[a.length][j] = b.length - j;

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        grid[i][j] = grid[i + 1][j + 1];
      } else {
        grid[i][j] =
          1 +
          Math.min(
            grid[i + 1][j],     // delete from a
            grid[i][j + 1],     // insert into a
            grid[i + 1][j + 1], // replace
          );
      }
    }
  }

  return grid[0][0];
}

console.log(minDistance("horse", "ros"));
`,
    expectedOutput: "3",
  },

  {
    id: "burst-balloons",
    title: "Burst Balloons",
    difficulty: "Hard",
    summary:
      "Burst balloons for coins, where each is worth its neighbours multiplied together. The trick is to think backwards: decide which balloon is burst LAST in a range, because then its neighbours are known.",
    solution: `// Burst Balloons
// Ask which balloon is burst LAST in a range — then its neighbours are fixed.

function maxCoins(balloons) {
  // Imaginary 1s at each end simplify the edges.
  const values = [1, ...balloons, 1];
  const n = values.length;

  // best[left][right] = coins from bursting everything strictly between them.
  const best = [];
  for (let i = 0; i < n; i++) {
    best.push(new Array(n).fill(0));
  }

  // Widen the gap between left and right a step at a time.
  for (let gap = 2; gap < n; gap++) {
    for (let left = 0; left + gap < n; left++) {
      const right = left + gap;

      for (let last = left + 1; last < right; last++) {
        const coins =
          values[left] * values[last] * values[right] +
          best[left][last] +
          best[last][right];

        best[left][right] = Math.max(best[left][right], coins);
      }
    }
  }

  return best[0][n - 1];
}

console.log(maxCoins([3, 1, 5, 8]));
`,
    expectedOutput: "167",
  },

  {
    id: "regular-expression-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    summary:
      "Match a string against a pattern where a full stop is any character and a star repeats the one before it, zero or more times. The star is the whole difficulty: it can match nothing, or match and stay.",
    solution: `// Regular Expression Matching
// A star may match nothing, or match one character and stay available.

function isMatch(text, pattern) {
  const grid = [];
  for (let i = 0; i <= text.length; i++) {
    grid.push(new Array(pattern.length + 1).fill(false));
  }

  grid[text.length][pattern.length] = true; // both used up

  for (let i = text.length; i >= 0; i--) {
    for (let j = pattern.length - 1; j >= 0; j--) {
      const matchesHere =
        i < text.length && (pattern[j] === text[i] || pattern[j] === ".");

      if (pattern[j + 1] === "*") {
        // Either skip the star pair entirely...
        grid[i][j] = grid[i][j + 2];

        // ...or use it once and keep it available.
        if (matchesHere) {
          grid[i][j] = grid[i][j] || grid[i + 1][j];
        }
      } else if (matchesHere) {
        grid[i][j] = grid[i + 1][j + 1];
      }
    }
  }

  return grid[0][0];
}

console.log(isMatch("aa", "a*"));
`,
    expectedOutput: "true",
  },
];
