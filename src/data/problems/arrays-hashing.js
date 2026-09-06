/**
 * arrays-hashing.js — the first pattern: counting things and looking them up.
 *
 * Every solution here is written to be READ, not to be short. Clever one-liners
 * are miserable to step through, and stepping through is the entire point of
 * this site. Named variables, one idea per line.
 *
 * Each `solution` ends with a console.log so it does something when you run it,
 * and `expectedOutput` is what that line should print. `npm run check:problems`
 * runs every one of them through the real engine and compares — so a wrong
 * solution in here is a failing check, not a surprise for whoever opens it.
 */

export const arraysHashing = [
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    summary:
      "Decide whether any value shows up more than once in an array. The whole trick is that a Set answers 'have I seen this?' instantly.",
    solution: `// Contains Duplicate
// Walk the array once, remembering everything seen so far.

function hasDuplicate(nums) {
  const seen = new Set();

  for (const number of nums) {
    if (seen.has(number)) {
      return true;
    }
    seen.add(number);
  }

  return false;
}

console.log(hasDuplicate([1, 2, 3, 1]));
`,
    expectedOutput: "true",
  },

  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    summary:
      "Two words are anagrams when they use exactly the same letters the same number of times. Count the letters in one, then spend them on the other.",
    solution: `// Valid Anagram
// Count letters in the first word, subtract them using the second.

function isAnagram(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  const counts = new Map();

  for (const letter of first) {
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }

  for (const letter of second) {
    const remaining = counts.get(letter);

    if (!remaining) {
      return false;
    }

    counts.set(letter, remaining - 1);
  }

  return true;
}

console.log(isAnagram("anagram", "nagaram"));
`,
    expectedOutput: "true",
  },

  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    summary:
      "Find the two positions whose values add up to a target. Instead of trying every pair, remember each number as you pass it and ask whether its partner has already gone by.",
    solution: `// Two Sum
// For each number, look for the one that would complete the pair.

function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];

    if (seen.has(need)) {
      return [seen.get(need), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
    expectedOutput: "[0, 1]",
  },

  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    summary:
      "Gather words that are anagrams of each other. Any two anagrams share a signature — their letters in sorted order — so that signature can be the key.",
    solution: `// Group Anagrams
// Words with the same sorted letters belong together.

function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const signature = word.split("").sort().join("");

    if (!groups.has(signature)) {
      groups.set(signature, []);
    }

    groups.get(signature).push(word);
  }

  return [...groups.values()];
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
`,
    expectedOutput: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]',
  },

  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    summary:
      "Return the k values that appear most often. Sorting works, but there is a neater way: a number can appear at most n times, so use the count itself as a bucket index.",
    solution: `// Top K Frequent Elements
// Count each value, then read the counts back from the highest down.

function topKFrequent(nums, k) {
  const counts = new Map();

  for (const number of nums) {
    counts.set(number, (counts.get(number) ?? 0) + 1);
  }

  // buckets[c] holds every number that appeared exactly c times.
  const buckets = [];
  for (let i = 0; i <= nums.length; i++) {
    buckets.push([]);
  }

  for (const [number, count] of counts) {
    buckets[count].push(number);
  }

  const answer = [];

  for (let count = buckets.length - 1; count > 0; count--) {
    for (const number of buckets[count]) {
      answer.push(number);

      if (answer.length === k) {
        return answer;
      }
    }
  }

  return answer;
}

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));
`,
    expectedOutput: "[1, 2]",
  },

  {
    id: "encode-and-decode-strings",
    title: "Encode and Decode Strings",
    difficulty: "Medium",
    summary:
      "Turn a list of strings into one string and back again. Any separator you choose could appear inside a word, so instead write each word's length in front of it.",
    solution: `// Encode and Decode Strings
// Prefix every word with its length, so no separator can be ambiguous.

function encode(words) {
  let result = "";

  for (const word of words) {
    result += word.length + "#" + word;
  }

  return result;
}

function decode(text) {
  const words = [];
  let i = 0;

  while (i < text.length) {
    // Read digits up to the "#" to learn how long the next word is.
    let hash = i;
    while (text[hash] !== "#") {
      hash++;
    }

    const length = Number(text.slice(i, hash));
    words.push(text.slice(hash + 1, hash + 1 + length));

    i = hash + 1 + length;
  }

  return words;
}

const encoded = encode(["neet", "code", "love", "you"]);
console.log(decode(encoded));
`,
    expectedOutput: '["neet", "code", "love", "you"]',
  },

  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    summary:
      "For each position, multiply every other number together — without using division. Do it in two passes: everything to the left, then everything to the right.",
    solution: `// Product of Array Except Self
// answer[i] = (everything before i) x (everything after i)

function productExceptSelf(nums) {
  const answer = [];

  // First pass: what is the product of everything to my left?
  let runningLeft = 1;
  for (let i = 0; i < nums.length; i++) {
    answer[i] = runningLeft;
    runningLeft = runningLeft * nums[i];
  }

  // Second pass: multiply in everything to my right.
  let runningRight = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    answer[i] = answer[i] * runningRight;
    runningRight = runningRight * nums[i];
  }

  return answer;
}

console.log(productExceptSelf([1, 2, 3, 4]));
`,
    expectedOutput: "[24, 12, 8, 6]",
  },

  {
    id: "valid-sudoku",
    title: "Valid Sudoku",
    difficulty: "Medium",
    summary:
      "Check a part-filled Sudoku board for rule breaks. Nothing needs solving — just confirm no digit repeats in any row, column, or three-by-three box.",
    solution: `// Valid Sudoku
// One Set per row, per column, and per 3x3 box.

function isValidSudoku(board) {
  const rows = new Map();
  const columns = new Map();
  const boxes = new Map();

  function seenBefore(store, key, digit) {
    if (!store.has(key)) {
      store.set(key, new Set());
    }

    if (store.get(key).has(digit)) {
      return true;
    }

    store.get(key).add(digit);
    return false;
  }

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const digit = board[row][column];

      if (digit === ".") {
        continue;
      }

      // Which 3x3 box this square belongs to.
      const box = Math.floor(row / 3) * 3 + Math.floor(column / 3);

      if (
        seenBefore(rows, row, digit) ||
        seenBefore(columns, column, digit) ||
        seenBefore(boxes, box, digit)
      ) {
        return false;
      }
    }
  }

  return true;
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
    expectedOutput: "true",
  },

  {
    id: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    summary:
      "Find the longest run of consecutive numbers hiding in an unsorted array. The insight: only start counting from a number that has no left-hand neighbour, so every run is walked exactly once.",
    solution: `// Longest Consecutive Sequence
// Only start counting at the beginning of a run.

function longestConsecutive(nums) {
  const values = new Set(nums);
  let longest = 0;

  for (const number of values) {
    // If number - 1 exists, this is the middle of a run, not the start.
    if (values.has(number - 1)) {
      continue;
    }

    let length = 1;
    while (values.has(number + length)) {
      length++;
    }

    longest = Math.max(longest, length);
  }

  return longest;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
`,
    expectedOutput: "4",
  },
];
