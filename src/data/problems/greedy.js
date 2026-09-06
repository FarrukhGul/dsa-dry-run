/**
 * greedy.js — take the best option now and never look back.
 *
 * The Hard part of a greedy algorithm is never the code; it is believing it
 * works. Each summary here says WHY looking ahead turns out to be unnecessary,
 * because that is the part worth learning.
 */

export const greedy = [
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    summary:
      "The highest-scoring run of consecutive numbers. Kadane's insight: if the run so far has gone negative, it can only hold you back — drop it and start fresh.",
    solution: `// Maximum Subarray
// If the running total goes negative, it can only hurt. Start again.

function maxSubArray(nums) {
  let best = nums[0];
  let running = 0;

  for (const number of nums) {
    if (running < 0) {
      running = 0; // carrying a negative forward never helps
    }

    running += number;
    best = Math.max(best, running);
  }

  return best;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
`,
    expectedOutput: "6",
  },

  {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    summary:
      "Each number says how far you may jump from that spot. Can you reach the end? Work backwards: shrink the goal to any square that can reach it.",
    solution: `// Jump Game
// Work backwards, pulling the goal towards the start.

function canJump(nums) {
  let goal = nums.length - 1;

  for (let i = nums.length - 2; i >= 0; i--) {
    if (i + nums[i] >= goal) {
      goal = i; // this square can reach the goal, so it becomes the goal
    }
  }

  return goal === 0;
}

console.log(canJump([2, 3, 1, 1, 4]));
`,
    expectedOutput: "true",
  },

  {
    id: "jump-game-ii",
    title: "Jump Game II",
    difficulty: "Medium",
    summary:
      "Now count the fewest jumps. Think of it as levels: everything reachable in one jump is level one, and the far edge of a level is where the next jump must be taken.",
    solution: `// Jump Game II
// Treat it as levels: the edge of one level forces the next jump.

function jump(nums) {
  let jumps = 0;
  let currentEnd = 0;  // edge of the level we are inside
  let furthest = 0;    // furthest anything in this level can reach

  for (let i = 0; i < nums.length - 1; i++) {
    furthest = Math.max(furthest, i + nums[i]);

    if (i === currentEnd) {
      // Reached the edge: a jump has to happen here.
      jumps++;
      currentEnd = furthest;
    }
  }

  return jumps;
}

console.log(jump([2, 3, 1, 1, 4]));
`,
    expectedOutput: "2",
  },

  {
    id: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    summary:
      "Find the station to start from to get all the way round. If the total gas covers the total cost a solution exists, and any point where the tank runs dry rules out every station before it.",
    solution: `// Gas Station
// Running dry rules out every station from the last start up to here.

function canCompleteCircuit(gas, cost) {
  let total = 0;
  for (let i = 0; i < gas.length; i++) {
    total += gas[i] - cost[i];
  }

  if (total < 0) {
    return -1; // not enough fuel in the whole loop
  }

  let start = 0;
  let tank = 0;

  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];

    if (tank < 0) {
      // Nowhere from start to i works, so try the next station.
      start = i + 1;
      tank = 0;
    }
  }

  return start;
}

console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));
`,
    expectedOutput: "3",
  },

  {
    id: "hand-of-straights",
    title: "Hand of Straights",
    difficulty: "Medium",
    summary:
      "Can the cards be dealt into consecutive groups of a given size? The smallest card left has no choice — it must start a group — and that removes all the guesswork.",
    solution: `// Hand of Straights
// The smallest card left must start a group. No choice, no guessing.

function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) {
    return false;
  }

  const counts = new Map();
  for (const card of hand) {
    counts.set(card, (counts.get(card) ?? 0) + 1);
  }

  const values = [...counts.keys()].sort((a, b) => a - b);

  for (const start of values) {
    const needed = counts.get(start);
    if (needed === 0) continue;

    // This card must begin a run, so the next few must exist too.
    for (let card = start; card < start + groupSize; card++) {
      if ((counts.get(card) ?? 0) < needed) {
        return false;
      }

      counts.set(card, counts.get(card) - needed);
    }
  }

  return true;
}

console.log(isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3));
`,
    expectedOutput: "true",
  },

  {
    id: "merge-triplets-to-form-target",
    title: "Merge Triplets to Form Target",
    difficulty: "Medium",
    summary:
      "Merging keeps the larger value in each position, so any triplet exceeding the target anywhere is poison and must be ignored. Among the rest, just check each position can be reached.",
    solution: `// Merge Triplets to Form Target Triplet
// Any triplet that overshoots anywhere can never be used at all.

function mergeTriplets(triplets, target) {
  const reached = [false, false, false];

  for (const triplet of triplets) {
    // Using this would push some position past the target, permanently.
    if (
      triplet[0] > target[0] ||
      triplet[1] > target[1] ||
      triplet[2] > target[2]
    ) {
      continue;
    }

    for (let i = 0; i < 3; i++) {
      if (triplet[i] === target[i]) {
        reached[i] = true;
      }
    }
  }

  return reached[0] && reached[1] && reached[2];
}

console.log(mergeTriplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]));
`,
    expectedOutput: "true",
  },

  {
    id: "partition-labels",
    title: "Partition Labels",
    difficulty: "Medium",
    summary:
      "Cut a string so no letter appears in two pieces. Note where each letter last occurs; a piece can end only once you have passed the last occurrence of everything in it.",
    solution: `// Partition Labels
// A piece can end only once every letter in it has been seen for the last time.

function partitionLabels(text) {
  const lastSeen = new Map();

  for (let i = 0; i < text.length; i++) {
    lastSeen.set(text[i], i);
  }

  const sizes = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < text.length; i++) {
    end = Math.max(end, lastSeen.get(text[i]));

    if (i === end) {
      sizes.push(end - start + 1);
      start = i + 1;
    }
  }

  return sizes;
}

console.log(partitionLabels("ababcbacadefegdehijhklij"));
`,
    expectedOutput: "[9, 7, 8]",
  },

  {
    id: "valid-parenthesis-string",
    title: "Valid Parenthesis String",
    difficulty: "Medium",
    summary:
      "A star may be an opening bracket, a closing one, or nothing. Rather than trying every combination, track the range of open brackets that is still possible.",
    solution: `// Valid Parenthesis String
// Track the RANGE of possible open-bracket counts, not a single number.

function checkValidString(text) {
  let fewestOpen = 0;
  let mostOpen = 0;

  for (const character of text) {
    if (character === "(") {
      fewestOpen++;
      mostOpen++;
    } else if (character === ")") {
      fewestOpen--;
      mostOpen--;
    } else {
      // A star could close one, or open one.
      fewestOpen--;
      mostOpen++;
    }

    if (mostOpen < 0) {
      return false; // too many closers, whatever the stars did
    }

    // Never fewer than zero open brackets.
    fewestOpen = Math.max(fewestOpen, 0);
  }

  return fewestOpen === 0;
}

console.log(checkValidString("(*))"));
`,
    expectedOutput: "true",
  },
];
