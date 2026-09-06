/**
 * backtracking.js — try a choice, explore, undo it, try the next.
 *
 * Every one of these has the same skeleton, and the undo step is the part
 * people forget. Watch the call stack panel: it grows as choices are made and
 * shrinks as they are taken back, which is the algorithm made visible.
 */

export const backtracking = [
  {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    summary:
      "List every possible subset. At each position you either take the number or you do not, so the choices form a binary tree of depth n.",
    solution: `// Subsets
// Every subset, built by choosing a starting point and extending it.

function subsets(nums) {
  const answer = [];
  const current = [];

  function explore(start) {
    // Whatever we have built so far is itself a valid subset.
    answer.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      explore(i + 1);
      current.pop(); // undo, and try the next number instead
    }
  }

  explore(0);
  return answer;
}

console.log(subsets([1, 2, 3]));
`,
    expectedOutput: "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
  },

  {
    id: "combination-sum",
    title: "Combination Sum",
    difficulty: "Medium",
    summary:
      "Find every combination adding to a target, reusing numbers freely. Recursing from the same index rather than the next one is what allows the reuse.",
    solution: `// Combination Sum
// Numbers may repeat, so recurse from i rather than i + 1.

function combinationSum(candidates, target) {
  const answer = [];
  const current = [];

  function explore(start, remaining) {
    if (remaining === 0) {
      answer.push([...current]);
      return;
    }

    if (remaining < 0) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      explore(i, remaining - candidates[i]);
      current.pop();
    }
  }

  explore(0, target);
  return answer;
}

console.log(combinationSum([2, 3, 6, 7], 7));
`,
    expectedOutput: "[[2, 2, 3], [7]]",
  },

  {
    id: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    summary:
      "Every ordering of the numbers. At each position, try each number not already placed.",
    solution: `// Permutations
// At each slot, try every number that is not already used.

function permute(nums) {
  const answer = [];
  const current = [];
  const used = new Array(nums.length).fill(false);

  function explore() {
    if (current.length === nums.length) {
      answer.push([...current]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue;
      }

      used[i] = true;
      current.push(nums[i]);

      explore();

      current.pop();
      used[i] = false;
    }
  }

  explore();
  return answer;
}

console.log(permute([1, 2, 3]));
`,
    expectedOutput:
      "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
  },

  {
    id: "subsets-ii",
    title: "Subsets II",
    difficulty: "Medium",
    summary:
      "Subsets again, but the input may repeat and the output may not. Sort first, then at each level skip a value identical to the one just tried.",
    solution: `// Subsets II
// Sort, then skip a repeat of the value already tried at this level.

function subsetsWithDup(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = [];
  const current = [];

  function explore(start) {
    answer.push([...current]);

    for (let i = start; i < sorted.length; i++) {
      // Same value already tried in this position: it would repeat a subset.
      if (i > start && sorted[i] === sorted[i - 1]) {
        continue;
      }

      current.push(sorted[i]);
      explore(i + 1);
      current.pop();
    }
  }

  explore(0);
  return answer;
}

console.log(subsetsWithDup([1, 2, 2]));
`,
    expectedOutput: "[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]",
  },

  {
    id: "combination-sum-ii",
    title: "Combination Sum II",
    difficulty: "Medium",
    summary:
      "Reach the target using each number at most once, with no repeated combinations. Same duplicate-skipping trick as Subsets II, plus moving to the next index.",
    solution: `// Combination Sum II
// Each number used once, and no combination reported twice.

function combinationSum2(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);
  const answer = [];
  const current = [];

  function explore(start, remaining) {
    if (remaining === 0) {
      answer.push([...current]);
      return;
    }

    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) {
        continue;
      }

      // Sorted, so everything after this is too big as well.
      if (sorted[i] > remaining) {
        break;
      }

      current.push(sorted[i]);
      explore(i + 1, remaining - sorted[i]);
      current.pop();
    }
  }

  explore(0, target);
  return answer;
}

console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));
`,
    expectedOutput: "[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]",
  },

  {
    id: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    summary:
      "Can a word be traced through neighbouring letters without reusing a square? Mark each square as you step onto it and unmark it on the way back out.",
    solution: `// Word Search
// Mark a square while standing on it, unmark it when backing out.

function exist(board, word) {
  const rows = board.length;
  const columns = board[0].length;

  function explore(row, column, index) {
    if (index === word.length) {
      return true;
    }

    if (row < 0 || column < 0 || row >= rows || column >= columns) {
      return false;
    }

    if (board[row][column] !== word[index]) {
      return false;
    }

    const letter = board[row][column];
    board[row][column] = "#"; // in use

    const found =
      explore(row + 1, column, index + 1) ||
      explore(row - 1, column, index + 1) ||
      explore(row, column + 1, index + 1) ||
      explore(row, column - 1, index + 1);

    board[row][column] = letter; // put it back

    return found;
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (explore(row, column, 0)) {
        return true;
      }
    }
  }

  return false;
}

const board = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];

console.log(exist(board, "ABCCED"));
`,
    expectedOutput: "true",
  },

  {
    id: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    summary:
      "Cut a string so every piece reads the same backwards, in all possible ways. Try every cut point, and only recurse when the piece before it is a palindrome.",
    solution: `// Palindrome Partitioning
// Try each cut; only continue when the piece before it is a palindrome.

function isPalindrome(text, from, to) {
  while (from < to) {
    if (text[from] !== text[to]) {
      return false;
    }
    from++;
    to--;
  }
  return true;
}

function partition(text) {
  const answer = [];
  const current = [];

  function explore(start) {
    if (start === text.length) {
      answer.push([...current]);
      return;
    }

    for (let end = start; end < text.length; end++) {
      if (!isPalindrome(text, start, end)) {
        continue;
      }

      current.push(text.slice(start, end + 1));
      explore(end + 1);
      current.pop();
    }
  }

  explore(0);
  return answer;
}

console.log(partition("aab"));
`,
    expectedOutput: '[["a", "a", "b"], ["aa", "b"]]',
  },

  {
    id: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    summary:
      "Spell out every word an old phone keypad could produce. One digit per level, one letter per branch.",
    solution: `// Letter Combinations of a Phone Number
// One digit per level of the recursion, one letter per branch.

function letterCombinations(digits) {
  if (digits.length === 0) {
    return [];
  }

  const keypad = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };

  const answer = [];

  function explore(index, current) {
    if (index === digits.length) {
      answer.push(current);
      return;
    }

    for (const letter of keypad[digits[index]]) {
      explore(index + 1, current + letter);
    }
  }

  explore(0, "");
  return answer;
}

console.log(letterCombinations("23"));
`,
    expectedOutput: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]',
  },

  {
    id: "n-queens",
    title: "N-Queens",
    difficulty: "Hard",
    summary:
      "Place n queens on an n-by-n board so none attack another. Go row by row, and remember which columns and diagonals are already taken — a diagonal is identified by row minus column, or row plus column.",
    solution: `// N-Queens
// One queen per row. A diagonal is identified by row-column or row+column.

function solveNQueens(n) {
  const solutions = [];
  const queenAt = []; // queenAt[row] = column

  const usedColumns = new Set();
  const usedDownDiagonals = new Set(); // row - column
  const usedUpDiagonals = new Set();   // row + column

  function placeRow(row) {
    if (row === n) {
      solutions.push([...queenAt]);
      return;
    }

    for (let column = 0; column < n; column++) {
      const down = row - column;
      const up = row + column;

      if (
        usedColumns.has(column) ||
        usedDownDiagonals.has(down) ||
        usedUpDiagonals.has(up)
      ) {
        continue;
      }

      usedColumns.add(column);
      usedDownDiagonals.add(down);
      usedUpDiagonals.add(up);
      queenAt.push(column);

      placeRow(row + 1);

      queenAt.pop();
      usedColumns.delete(column);
      usedDownDiagonals.delete(down);
      usedUpDiagonals.delete(up);
    }
  }

  placeRow(0);
  return solutions;
}

console.log(solveNQueens(4));
`,
    expectedOutput: "[[1, 3, 0, 2], [2, 0, 3, 1]]",
  },
];
