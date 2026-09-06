/**
 * bit-manipulation.js — thinking in ones and zeroes.
 *
 * Two facts unlock most of these. XOR cancels a value against itself, so
 * anything paired up disappears. And `n & (n - 1)` clears the lowest set bit,
 * which turns counting bits into counting loop turns.
 */

export const bitManipulation = [
  {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    summary:
      "Every value appears twice except one. XOR the lot together — each pair cancels itself out and only the loner survives.",
    solution: `// Single Number
// XOR cancels equal values, so every pair vanishes.

function singleNumber(nums) {
  let answer = 0;

  for (const number of nums) {
    answer = answer ^ number;
  }

  return answer;
}

console.log(singleNumber([2, 2, 1]));
`,
    expectedOutput: "1",
  },

  {
    id: "number-of-1-bits",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    summary:
      "Count the ones in a number's binary form. Checking all 32 positions works, but n & (n - 1) clears the lowest one directly — so the loop runs once per set bit.",
    solution: `// Number of 1 Bits
// n & (n - 1) removes the lowest set bit, so we loop once per 1.

function hammingWeight(n) {
  let count = 0;
  let value = n;

  while (value !== 0) {
    value = value & (value - 1);
    count++;
  }

  return count;
}

console.log(hammingWeight(11));
`,
    expectedOutput: "3",
  },

  {
    id: "counting-bits",
    title: "Counting Bits",
    difficulty: "Easy",
    summary:
      "Count the ones in every number from 0 to n. Rather than counting each separately, reuse earlier answers: n has the same count as n with its lowest bit cleared, plus one.",
    solution: `// Counting Bits
// counts[n] = counts[n with its lowest 1 removed] + 1

function countBits(n) {
  const counts = new Array(n + 1).fill(0);

  for (let value = 1; value <= n; value++) {
    counts[value] = counts[value & (value - 1)] + 1;
  }

  return counts;
}

console.log(countBits(5));
`,
    expectedOutput: "[0, 1, 1, 2, 1, 2]",
  },

  {
    id: "reverse-bits",
    title: "Reverse Bits",
    difficulty: "Easy",
    summary:
      "Flip a 32-bit number back to front. Take a bit off one end and push it onto the other, thirty-two times.",
    solution: `// Reverse Bits
// Pull a bit off the right, push it onto the left. Thirty-two times.

function reverseBits(n) {
  let result = 0;
  let value = n;

  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (value & 1);
    value = value >>> 1;
  }

  // JavaScript's bit operators work on SIGNED 32-bit numbers, so the result
  // can come out negative. >>> 0 reads the same bits as unsigned.
  return result >>> 0;
}

console.log(reverseBits(43261596));
`,
    expectedOutput: "964176192",
  },

  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    summary:
      "One number from 0 to n is absent. XOR every index together with every value: everything present cancels, leaving the one that is not.",
    solution: `// Missing Number
// XOR all the indices and all the values: only the missing one survives.

function missingNumber(nums) {
  let answer = nums.length; // the index that has no value

  for (let i = 0; i < nums.length; i++) {
    answer = answer ^ i ^ nums[i];
  }

  return answer;
}

console.log(missingNumber([3, 0, 1]));
`,
    expectedOutput: "2",
  },

  {
    id: "sum-of-two-integers",
    title: "Sum of Two Integers",
    difficulty: "Medium",
    summary:
      "Add two numbers without using plus. XOR adds each column while ignoring carries, and AND shifted left is exactly the carries — repeat until nothing carries.",
    solution: `// Sum of Two Integers
// XOR adds without carrying; AND shifted left IS the carry.

function getSum(a, b) {
  let sum = a;
  let carry = b;

  while (carry !== 0) {
    // Where both have a 1, a carry moves one column left.
    const nextCarry = (sum & carry) << 1;

    // Where exactly one has a 1, the answer is 1.
    sum = sum ^ carry;

    carry = nextCarry;
  }

  return sum;
}

console.log(getSum(2, 3));
`,
    expectedOutput: "5",
  },

  {
    id: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Medium",
    summary:
      "Reverse a number's digits, returning zero if the result will not fit in 32 bits. Peel digits off the end with modulo and build the answer up as you go.",
    solution: `// Reverse Integer
// Peel digits off the end, checking the 32-bit limit before it is passed.

function reverse(x) {
  const LIMIT = 2147483647; // 2^31 - 1
  const negative = x < 0;

  let remaining = Math.abs(x);
  let reversed = 0;

  while (remaining > 0) {
    const digit = remaining % 10;
    remaining = Math.floor(remaining / 10);

    // Check BEFORE multiplying, or the overflow has already happened.
    if (reversed > Math.floor(LIMIT / 10)) {
      return 0;
    }

    reversed = reversed * 10 + digit;
  }

  if (reversed > LIMIT) {
    return 0;
  }

  return negative ? -reversed : reversed;
}

console.log(reverse(123));
`,
    expectedOutput: "321",
  },
];
