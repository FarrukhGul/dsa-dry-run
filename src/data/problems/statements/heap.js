/**
 * statements/heap.js — the questions for the heap pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const heapStatements = {
  "kth-largest-element-in-a-stream": {
    description:
      "Numbers keep arriving. After each one, report the kth largest seen so far. You are given a starting batch, and each later addition returns the current answer.",
    examples: [
      {
        input: "k = 3, start [4,5,8,2], then add 3, 5, 10",
        output: "4, 5, 5",
        explanation:
          "After adding 3 the third largest is 4; after 5 it is 5; after 10 it is still 5.",
      },
    ],
    constraints: ["1 ≤ k ≤ 10,000", "There are always at least k values."],
    starter: `// Kth Largest Element in a Stream
// After each addition, return the kth largest seen so far.

class KthLargest {
  constructor(k, nums) {
    // Your code here.
  }

  add(value) {
    // Your code here.
  }
}

const stream = new KthLargest(3, [4, 5, 8, 2]);
console.log(stream.add(3));
console.log(stream.add(5));
console.log(stream.add(10));
`,
  },

  "last-stone-weight": {
    description:
      "Repeatedly take the two heaviest stones and smash them together. Equal stones destroy each other; otherwise the lighter is destroyed and the heavier is reduced by its weight. Return the weight of the last stone, or zero if none survives.",
    examples: [
      {
        input: "stones = [2, 7, 4, 1, 8, 1]",
        output: "1",
        explanation:
          "8 and 7 leave 1; 4 and 2 leave 2; 2 and 1 leave 1; then 1 and 1 destroy each other, leaving 1.",
      },
    ],
    constraints: ["1 ≤ stones.length ≤ 30", "1 ≤ weight ≤ 1,000"],
    starter: `// Last Stone Weight
// Smash the two heaviest repeatedly. Return the last stone, or 0.

function lastStoneWeight(stones) {
  // Your code here.
}

console.log(lastStoneWeight([2, 7, 4, 1, 8, 1]));
`,
  },

  "k-closest-points-to-origin": {
    description:
      "Given points on a plane, return the k nearest to the origin. Distance is the ordinary straight-line one, though you may not need to compute it exactly.",
    examples: [
      {
        input: "points = [[1,3],[-2,2],[5,8],[0,1]], k = 2",
        output: "[[0, 1], [-2, 2]]",
        explanation:
          "Their squared distances are 1 and 8, the two smallest.",
      },
    ],
    constraints: ["1 ≤ k ≤ points.length ≤ 10,000", "Any order is accepted."],
    starter: `// K Closest Points to Origin
// Return the k points nearest to (0, 0).

function kClosest(points, k) {
  // Your code here.
}

console.log(kClosest([[1, 3], [-2, 2], [5, 8], [0, 1]], 2));
`,
  },

  "kth-largest-element-in-an-array": {
    description:
      "Return the kth largest value in an unsorted array, counting duplicates separately. Sorting solves it; the interesting answer avoids sorting the whole array.",
    examples: [
      {
        input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
        output: "5",
        explanation: "Sorted it is [1,2,3,4,5,6]; the second largest is 5.",
      },
      {
        input: "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4",
        output: "4",
        explanation: "Duplicates each count on their own.",
      },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 100,000"],
    starter: `// Kth Largest Element in an Array
// Return the kth largest value.

function findKthLargest(nums, k) {
  // Your code here.
}

console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));
`,
  },

  "task-scheduler": {
    description:
      "Tasks each take one unit of time, and two identical tasks must be at least n units apart. Idle time is allowed. Return the shortest total time needed to run them all.",
    examples: [
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 2',
        output: "8",
        explanation:
          "A B idle A B idle A B takes eight units — the three A's force the gaps.",
      },
    ],
    constraints: ["1 ≤ tasks.length ≤ 10,000", "0 ≤ n ≤ 100"],
    starter: `// Task Scheduler
// Identical tasks need n units between them. Return the shortest total time.

function leastInterval(tasks, n) {
  // Your code here.
}

console.log(leastInterval(["A", "A", "A", "B", "B", "B"], 2));
`,
  },

  "design-twitter": {
    description:
      "Build a tiny Twitter: post a tweet, follow and unfollow someone, and fetch a news feed of the ten most recent tweets from yourself and everyone you follow, newest first.",
    examples: [
      {
        input: "user 1 posts 5, reads feed, follows 2, user 2 posts 6, reads feed",
        output: "[5], then [6, 5]",
        explanation:
          "You always see your own tweets, and following brings someone else's in.",
      },
    ],
    constraints: ["At most 10 tweets in a feed.", "You always follow yourself."],
    starter: `// Design Twitter
// Post, follow, unfollow, and read the 10 newest relevant tweets.

class Twitter {
  constructor() {
    // Your code here.
  }

  postTweet(userId, tweetId) {
    // Your code here.
  }

  getNewsFeed(userId) {
    // Your code here.
  }

  follow(followerId, followeeId) {
    // Your code here.
  }

  unfollow(followerId, followeeId) {
    // Your code here.
  }
}

const twitter = new Twitter();
twitter.postTweet(1, 5);
console.log(twitter.getNewsFeed(1));
twitter.follow(1, 2);
twitter.postTweet(2, 6);
console.log(twitter.getNewsFeed(1));
`,
  },

  "find-median-from-data-stream": {
    description:
      "Numbers arrive one at a time, and at any moment you may be asked for the median of everything so far. With an even count, the median is the average of the middle two.",
    examples: [
      {
        input: "add 1, add 2, findMedian, add 3, findMedian",
        output: "1.5, then 2",
        explanation:
          "With [1,2] the middle two average to 1.5; with [1,2,3] the middle is 2.",
      },
    ],
    constraints: ["Up to 50,000 additions.", "findMedian is only called after an add."],
    starter: `// Find Median from Data Stream
// Report the median of everything added so far.

class MedianFinder {
  constructor() {
    // Your code here.
  }

  addNum(value) {
    // Your code here.
  }

  findMedian() {
    // Your code here.
  }
}

const finder = new MedianFinder();
finder.addNum(1);
finder.addNum(2);
console.log(finder.findMedian());
finder.addNum(3);
console.log(finder.findMedian());
`,
  },
};
