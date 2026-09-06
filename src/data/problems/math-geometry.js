/**
 * math-geometry.js — rotations, spirals, and arithmetic that needs care.
 *
 * Less pattern, more careful bookkeeping. The grid view earns its keep here:
 * rotating a matrix in place is much easier to trust when you can watch the
 * four corners move round each other.
 */

export const mathGeometry = [
  {
    id: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    summary:
      "Turn a square grid ninety degrees, in place. Two Easy moves beat one Hard one: flip it along the diagonal, then mirror each row.",
    solution: `// Rotate Image
// Transpose (flip along the diagonal), then reverse each row.

function rotate(matrix) {
  const n = matrix.length;

  // Transpose: swap each square with its mirror across the diagonal.
  for (let row = 0; row < n; row++) {
    for (let column = row + 1; column < n; column++) {
      const swap = matrix[row][column];
      matrix[row][column] = matrix[column][row];
      matrix[column][row] = swap;
    }
  }

  // Then mirror each row left to right.
  for (let row = 0; row < n; row++) {
    matrix[row].reverse();
  }

  return matrix;
}

console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
`,
    expectedOutput: "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]",
  },

  {
    id: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    summary:
      "Read a grid in a spiral. Keep four walls — top, bottom, left, right — and pull each one inwards after walking along it.",
    solution: `// Spiral Matrix
// Four walls closing inwards, one edge walked at a time.

function spiralOrder(matrix) {
  const answer = [];

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column++) {
      answer.push(matrix[top][column]);
    }
    top++;

    for (let row = top; row <= bottom; row++) {
      answer.push(matrix[row][right]);
    }
    right--;

    // These two need guarding, or a single row would be read twice.
    if (top <= bottom) {
      for (let column = right; column >= left; column--) {
        answer.push(matrix[bottom][column]);
      }
      bottom--;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        answer.push(matrix[row][left]);
      }
      left++;
    }
  }

  return answer;
}

console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
`,
    expectedOutput: "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
  },

  {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    summary:
      "Blank the whole row and column of every zero. The trap is doing it as you go — the zeroes you write look exactly like the ones you found, so note them first.",
    solution: `// Set Matrix Zeroes
// Note every row and column to blank BEFORE changing anything.

function setZeroes(matrix) {
  const rowsToClear = new Set();
  const columnsToClear = new Set();

  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[0].length; column++) {
      if (matrix[row][column] === 0) {
        rowsToClear.add(row);
        columnsToClear.add(column);
      }
    }
  }

  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[0].length; column++) {
      if (rowsToClear.has(row) || columnsToClear.has(column)) {
        matrix[row][column] = 0;
      }
    }
  }

  return matrix;
}

console.log(setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
`,
    expectedOutput: "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]",
  },

  {
    id: "happy-number",
    title: "Happy Number",
    difficulty: "Easy",
    summary:
      "Repeatedly replace a number by the sum of its squared digits. Some reach one; the rest loop forever — so this is really cycle detection wearing a disguise.",
    solution: `// Happy Number
// Really a cycle detection problem: unhappy numbers loop.

function squaredDigitSum(n) {
  let total = 0;

  while (n > 0) {
    const digit = n % 10;
    total += digit * digit;
    n = Math.floor(n / 10);
  }

  return total;
}

function isHappy(n) {
  const seen = new Set();

  while (n !== 1) {
    if (seen.has(n)) {
      return false; // been here before, so it loops forever
    }

    seen.add(n);
    n = squaredDigitSum(n);
  }

  return true;
}

console.log(isHappy(19));
`,
    expectedOutput: "true",
  },

  {
    id: "plus-one",
    title: "Plus One",
    difficulty: "Easy",
    summary:
      "Add one to a number held as an array of digits. Work from the right; a nine becomes zero and carries, anything else just goes up and you are done.",
    solution: `// Plus One
// From the right: 9 becomes 0 and carries, anything else ends it.

function plusOne(digits) {
  const answer = [...digits];

  for (let i = answer.length - 1; i >= 0; i--) {
    if (answer[i] < 9) {
      answer[i]++;
      return answer;
    }

    answer[i] = 0; // carried
  }

  // Every digit was a nine, as in 999 becoming 1000.
  return [1, ...answer];
}

console.log(plusOne([1, 2, 3]));
`,
    expectedOutput: "[1, 2, 4]",
  },

  {
    id: "pow-x-n",
    title: "Pow(x, n)",
    difficulty: "Medium",
    summary:
      "Raise a number to a power without multiplying n times. Squaring halves the exponent each round, so it takes about log n steps instead.",
    solution: `// Pow(x, n)
// Squaring halves the exponent, so this takes about log(n) steps.

function myPow(x, n) {
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }

  let result = 1;
  let base = x;
  let power = n;

  while (power > 0) {
    // An odd power means one copy of the base has to be taken out.
    if (power % 2 === 1) {
      result = result * base;
    }

    base = base * base;
    power = Math.floor(power / 2);
  }

  return result;
}

console.log(myPow(2, 10));
`,
    expectedOutput: "1024",
  },

  {
    id: "multiply-strings",
    title: "Multiply Strings",
    difficulty: "Medium",
    summary:
      "Multiply two numbers given as strings, without converting them. Long multiplication: digit i times digit j always lands in positions i+j and i+j+1.",
    solution: `// Multiply Strings
// Long multiplication. Digits i and j always land at i+j and i+j+1.

function multiply(a, b) {
  if (a === "0" || b === "0") {
    return "0";
  }

  const digits = new Array(a.length + b.length).fill(0);

  // Both read right to left.
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      const product = Number(a[i]) * Number(b[j]);

      const low = i + j + 1;
      const high = i + j;

      const total = product + digits[low];
      digits[low] = total % 10;
      digits[high] += Math.floor(total / 10);
    }
  }

  // Drop any leading zero created by the extra slot.
  const text = digits.join("");
  return text[0] === "0" ? text.slice(1) : text;
}

console.log(multiply("123", "456"));
`,
    expectedOutput: "56088",
  },

  {
    id: "detect-squares",
    title: "Detect Squares",
    difficulty: "Medium",
    summary:
      "Count axis-aligned squares that can be made with a stored set of points. Pick a point diagonally opposite the query, and the other two corners are then completely determined.",
    solution: `// Detect Squares
// Choose the diagonal corner, and the other two corners are decided.

class DetectSquares {
  constructor() {
    this.counts = new Map(); // "x,y" -> how many times added
  }

  add(point) {
    const key = point[0] + "," + point[1];
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
  }

  countAt(x, y) {
    return this.counts.get(x + "," + y) ?? 0;
  }

  count(point) {
    const [queryX, queryY] = point;
    let squares = 0;

    for (const key of this.counts.keys()) {
      const [x, y] = key.split(",").map(Number);

      // Must be a proper diagonal: different row, different column,
      // and the same distance in each.
      if (Math.abs(x - queryX) !== Math.abs(y - queryY)) continue;
      if (x === queryX || y === queryY) continue;

      // The other two corners are then fixed.
      squares +=
        this.countAt(x, y) * this.countAt(queryX, y) * this.countAt(x, queryY);
    }

    return squares;
  }
}

const detector = new DetectSquares();
detector.add([3, 10]);
detector.add([11, 2]);
detector.add([3, 2]);
console.log(detector.count([11, 10]));
`,
    expectedOutput: "1",
  },
];
