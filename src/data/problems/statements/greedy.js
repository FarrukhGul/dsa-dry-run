/**
 * statements/greedy.js — the questions for the greedy pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const greedyStatements = {
  "maximum-subarray": {
    description:
      "Return the largest total any contiguous run of numbers can reach. At least one number must be taken, so an all-negative array answers with its least bad value.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The run 4, -1, 2, 1 totals 6.",
      },
      {
        input: "nums = [-1]",
        output: "-1",
        explanation: "One number, so it is forced.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 100,000"],
    starter: `// Maximum Subarray
// Largest total of any contiguous run. At least one number.

function maxSubArray(nums) {
  // Your code here.
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
`,
  },

  "jump-game": {
    description:
      "Each number says the furthest you may jump forward from that position. Starting at the first, decide whether the last is reachable.",
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
        explanation: "Jump one to position 1, then three to the end.",
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
        explanation: "Everything leads to the 0, which goes nowhere.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10,000"],
    starter: `// Jump Game
// Each value is the furthest you may jump. Can you reach the end?

function canJump(nums) {
  // Your code here.
}

console.log(canJump([2, 3, 1, 1, 4]));
`,
  },

  "jump-game-ii": {
    description:
      "The same jumps, but now the end is always reachable. Return the fewest jumps needed to get there.",
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "2",
        explanation: "One to position 1, then three to the end.",
      },
      {
        input: "nums = [2,3,0,1,4]",
        output: "2",
        explanation: "Same count by a different route.",
      },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10,000", "The end is always reachable."],
    starter: `// Jump Game II
// Fewest jumps to reach the end.

function jump(nums) {
  // Your code here.
}

console.log(jump([2, 3, 1, 1, 4]));
`,
  },

  "gas-station": {
    description:
      "Petrol stations sit in a circle. At each you gain some fuel and spend some driving to the next. Return the station to start from to get all the way round, or -1 if none works. The answer is unique when it exists.",
    examples: [
      {
        input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        output: "3",
        explanation: "Starting at station 3 is the only way round.",
      },
      {
        input: "gas = [2,3,4], cost = [3,4,3]",
        output: "-1",
        explanation: "There is not enough fuel overall.",
      },
    ],
    constraints: ["1 \u2264 stations \u2264 100,000", "The answer is unique if it exists."],
    starter: `// Gas Station
// Which station can you start from and get all the way round? -1 if none.

function canCompleteCircuit(gas, cost) {
  // Your code here.
}

console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));
`,
  },

  "hand-of-straights": {
    description:
      "Decide whether a hand of cards can be dealt entirely into groups of a given size, each group being consecutive numbers.",
    examples: [
      {
        input: "hand = [1,2,3,6,2,3,4,7,8], groupSize = 3",
        output: "true",
        explanation: "[1,2,3], [2,3,4] and [6,7,8].",
      },
      {
        input: "hand = [1,2,3,4,5], groupSize = 4",
        output: "false",
        explanation: "Five cards do not divide into fours.",
      },
    ],
    constraints: ["1 \u2264 hand.length \u2264 10,000", "Every card must be used."],
    starter: `// Hand of Straights
// Can the hand be dealt into consecutive groups of groupSize?

function isNStraightHand(hand, groupSize) {
  // Your code here.
}

console.log(isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3));
`,
  },

  "merge-triplets-to-form-target": {
    description:
      "Merging two triplets keeps the larger value in each of the three positions. Decide whether the target triplet can be produced by merging some of the given ones.",
    examples: [
      {
        input: "triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]",
        output: "true",
        explanation: "Merging the first and third gives exactly the target.",
      },
      {
        input: "triplets = [[3,4,5],[4,5,6]], target = [3,2,5]",
        output: "false",
        explanation: "Nothing can bring the middle value down to 2.",
      },
    ],
    constraints: ["1 \u2264 triplets.length \u2264 100,000", "Merging keeps the larger of each position."],
    starter: `// Merge Triplets to Form Target Triplet
// Merging keeps the larger value in each position. Can target be made?

function mergeTriplets(triplets, target) {
  // Your code here.
}

console.log(mergeTriplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]));
`,
  },

  "partition-labels": {
    description:
      "Cut the string into as many pieces as possible, so that no letter appears in more than one piece. Return the sizes of the pieces in order.",
    examples: [
      {
        input: "text = \"ababcbacadefegdehijhklij\"",
        output: "[9, 7, 8]",
        explanation: "The first nine characters contain every a, b and c.",
      },
      {
        input: "text = \"eccbbbbdec\"",
        output: "[10]",
        explanation: "The e at the end forces it all into one piece.",
      },
    ],
    constraints: ["1 \u2264 text.length \u2264 500", "Lowercase letters."],
    starter: `// Partition Labels
// Cut into as many pieces as possible, no letter spanning two.

function partitionLabels(text) {
  // Your code here.
}

console.log(partitionLabels("ababcbacadefegdehijhklij"));
`,
  },

  "valid-parenthesis-string": {
    description:
      "A string of round brackets and stars, where each star may count as an opening bracket, a closing one, or nothing at all. Decide whether some reading of it is properly balanced.",
    examples: [
      {
        input: "text = \"(*))\"",
        output: "true",
        explanation: "Treat the star as an opening bracket.",
      },
      {
        input: "text = \"(]\"",
        output: "false",
        explanation: "Nothing can balance that.",
      },
    ],
    constraints: ["1 \u2264 text.length \u2264 100", "Characters are (, ) and *."],
    starter: `// Valid Parenthesis String
// A "*" may be "(", ")" or nothing. Can it be balanced?

function checkValidString(text) {
  // Your code here.
}

console.log(checkValidString("(*))"));
`,
  },

};
