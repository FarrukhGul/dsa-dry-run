/**
 * heap.js — always know the smallest, without sorting everything.
 *
 * JavaScript has no built-in priority queue, so several of these build a small
 * one. That is not busywork: watching `bubbleUp` and `sinkDown` swap their way
 * through the array is the clearest explanation of a heap there is.
 */

export const heap = [
  {
    id: "kth-largest-element-in-a-stream",
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    summary:
      "Report the kth largest value as numbers keep arriving. Keep a min-heap of only the best k — its smallest item is the answer, and anything smaller can be dropped immediately.",
    solution: `// Kth Largest Element in a Stream
// Keep only the k biggest. The smallest of those is the answer.

class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(value) {
    this.items.push(value);

    // Bubble the newcomer up while it is smaller than its parent.
    let index = this.items.length - 1;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.items[parent] <= this.items[index]) break;

      const swap = this.items[parent];
      this.items[parent] = this.items[index];
      this.items[index] = swap;
      index = parent;
    }
  }

  pop() {
    const smallest = this.items[0];
    const last = this.items.pop();

    if (this.items.length > 0) {
      this.items[0] = last;

      // Sink the replacement down to where it belongs.
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = index * 2 + 2;
        let smallestIndex = index;

        if (left < this.items.length && this.items[left] < this.items[smallestIndex]) {
          smallestIndex = left;
        }
        if (right < this.items.length && this.items[right] < this.items[smallestIndex]) {
          smallestIndex = right;
        }
        if (smallestIndex === index) break;

        const swap = this.items[index];
        this.items[index] = this.items[smallestIndex];
        this.items[smallestIndex] = swap;
        index = smallestIndex;
      }
    }

    return smallest;
  }
}

class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = new MinHeap();

    for (const number of nums) {
      this.add(number);
    }
  }

  add(value) {
    this.heap.push(value);

    if (this.heap.size > this.k) {
      this.heap.pop();
    }

    return this.heap.peek();
  }
}

const stream = new KthLargest(3, [4, 5, 8, 2]);
console.log(stream.add(3));
console.log(stream.add(5));
console.log(stream.add(10));
`,
    expectedOutput: "4\n5\n5",
  },

  {
    id: "last-stone-weight",
    title: "Last Stone Weight",
    difficulty: "Easy",
    summary:
      "Smash the two heaviest stones together repeatedly until at most one is left. You always need the two largest, which is exactly what a max-heap gives you.",
    solution: `// Last Stone Weight
// Repeatedly take the two heaviest and smash them together.

function lastStoneWeight(stones) {
  const remaining = [...stones];

  while (remaining.length > 1) {
    // Heaviest last, so popping gives the two biggest.
    remaining.sort((a, b) => a - b);

    const heaviest = remaining.pop();
    const second = remaining.pop();

    if (heaviest !== second) {
      remaining.push(heaviest - second);
    }
  }

  return remaining.length === 1 ? remaining[0] : 0;
}

console.log(lastStoneWeight([2, 7, 4, 1, 8, 1]));
`,
    expectedOutput: "1",
  },

  {
    id: "k-closest-points-to-origin",
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    summary:
      "Return the k points nearest the origin. There is no need for a square root — comparing x² + y² orders the points exactly the same way and avoids the rounding.",
    solution: `// K Closest Points to Origin
// Compare squared distances: same order, no square roots needed.

function kClosest(points, k) {
  const sorted = [...points];

  sorted.sort((a, b) => {
    const distanceA = a[0] * a[0] + a[1] * a[1];
    const distanceB = b[0] * b[0] + b[1] * b[1];
    return distanceA - distanceB;
  });

  return sorted.slice(0, k);
}

console.log(kClosest([[1, 3], [-2, 2], [5, 8], [0, 1]], 2));
`,
    expectedOutput: "[[0, 1], [-2, 2]]",
  },

  {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    summary:
      "Find the kth largest value. Quickselect is the clever answer: partition around a pivot, then only recurse into the side that can contain the answer.",
    solution: `// Kth Largest Element in an Array
// Quickselect: partition, then only search the half that matters.

function findKthLargest(nums, k) {
  const values = [...nums];

  // The kth largest is at this index once the array is sorted ascending.
  const target = values.length - k;

  let left = 0;
  let right = values.length - 1;

  while (true) {
    const pivot = values[right];
    let boundary = left;

    for (let i = left; i < right; i++) {
      if (values[i] <= pivot) {
        const swap = values[i];
        values[i] = values[boundary];
        values[boundary] = swap;
        boundary++;
      }
    }

    // Put the pivot in its final place.
    values[right] = values[boundary];
    values[boundary] = pivot;

    if (boundary === target) {
      return values[boundary];
    }

    if (boundary < target) {
      left = boundary + 1;
    } else {
      right = boundary - 1;
    }
  }
}

console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));
`,
    expectedOutput: "5",
  },

  {
    id: "task-scheduler",
    title: "Task Scheduler",
    difficulty: "Medium",
    summary:
      "Identical tasks need n slots between them. The answer is decided by the most frequent task alone: it lays out a grid of gaps, and everything else fills them in.",
    solution: `// Task Scheduler
// The most frequent task sets the shape; everything else fills the gaps.

function leastInterval(tasks, n) {
  const counts = new Map();

  for (const task of tasks) {
    counts.set(task, (counts.get(task) ?? 0) + 1);
  }

  let highest = 0;
  for (const count of counts.values()) {
    highest = Math.max(highest, count);
  }

  // How many tasks are tied for most frequent — they share the last row.
  let tiedForMost = 0;
  for (const count of counts.values()) {
    if (count === highest) {
      tiedForMost++;
    }
  }

  // (highest - 1) full rows of width (n + 1), plus the final row.
  const framed = (highest - 1) * (n + 1) + tiedForMost;

  // If there are more tasks than gaps, nothing idles at all.
  return Math.max(framed, tasks.length);
}

console.log(leastInterval(["A", "A", "A", "B", "B", "B"], 2));
`,
    expectedOutput: "8",
  },

  {
    id: "design-twitter",
    title: "Design Twitter",
    difficulty: "Medium",
    summary:
      "Post tweets, follow people, and read the ten most recent from everyone you follow. A global counter timestamps each tweet, which is what makes merging the feeds possible.",
    solution: `// Design Twitter
// A counter timestamps every tweet, so feeds can be merged by recency.

class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();    // user -> [{ time, tweetId }]
    this.following = new Map(); // user -> Set of users
  }

  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) {
      this.tweets.set(userId, []);
    }

    this.tweets.get(userId).push({ time: this.time, tweetId });
    this.time++;
  }

  getNewsFeed(userId) {
    const sources = new Set(this.following.get(userId) ?? []);
    sources.add(userId); // you always see your own

    const combined = [];
    for (const source of sources) {
      for (const tweet of this.tweets.get(source) ?? []) {
        combined.push(tweet);
      }
    }

    combined.sort((a, b) => b.time - a.time);

    return combined.slice(0, 10).map((tweet) => tweet.tweetId);
  }

  follow(followerId, followeeId) {
    if (!this.following.has(followerId)) {
      this.following.set(followerId, new Set());
    }
    this.following.get(followerId).add(followeeId);
  }

  unfollow(followerId, followeeId) {
    this.following.get(followerId)?.delete(followeeId);
  }
}

const twitter = new Twitter();
twitter.postTweet(1, 5);
console.log(twitter.getNewsFeed(1));
twitter.follow(1, 2);
twitter.postTweet(2, 6);
console.log(twitter.getNewsFeed(1));
`,
    expectedOutput: "[5]\n[6, 5]",
  },

  {
    id: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    summary:
      "Report the running median as numbers arrive. Two heaps facing each other do it: a max-heap of the smaller half and a min-heap of the larger, kept balanced so the middle is always at their tips.",
    solution: `// Find Median from Data Stream
// Two halves kept balanced, so the median is always at the boundary.

class MedianFinder {
  constructor() {
    // Kept sorted. Real heaps would be faster, but the idea is the same:
    // the smaller half's largest and the larger half's smallest are the middle.
    this.low = [];  // smaller half
    this.high = []; // larger half
  }

  addNum(value) {
    if (this.low.length === 0 || value <= this.low[this.low.length - 1]) {
      this.low.push(value);
      this.low.sort((a, b) => a - b);
    } else {
      this.high.push(value);
      this.high.sort((a, b) => a - b);
    }

    // Keep the halves within one of each other.
    if (this.low.length > this.high.length + 1) {
      this.high.unshift(this.low.pop());
    } else if (this.high.length > this.low.length) {
      this.low.push(this.high.shift());
    }
  }

  findMedian() {
    if (this.low.length > this.high.length) {
      return this.low[this.low.length - 1];
    }

    return (this.low[this.low.length - 1] + this.high[0]) / 2;
  }
}

const finder = new MedianFinder();
finder.addNum(1);
finder.addNum(2);
console.log(finder.findMedian());
finder.addNum(3);
console.log(finder.findMedian());
`,
    expectedOutput: "1.5\n2",
  },
];
