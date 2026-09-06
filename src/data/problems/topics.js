/**
 * topics.js — the patterns the problem library is organised by.
 *
 * The order matters: it is roughly the order you would learn them in, so
 * reading the list top to bottom is a reasonable study plan on its own.
 *
 * These are the eighteen groups from the well-known NeetCode 150 list.
 *
 * ⚠️ ON THE PROBLEM TEXT
 *
 * Every summary in this library is written in our own words. The original
 * problem statements on LeetCode are copyrighted, so none of them are copied.
 * Problem titles and the grouping are facts about a widely published list.
 */

export const TOPICS = [
  {
    id: "arrays-hashing",
    label: "Arrays & Hashing",
    blurb: "Counting, lookups, and the map that turns O(n²) into O(n).",
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    blurb: "Two indices walking a sorted array, usually towards each other.",
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    blurb: "A range that grows and shrinks as it moves along.",
  },
  {
    id: "stack",
    label: "Stack",
    blurb: "Last in, first out — matching, undoing, and looking backwards.",
  },
  {
    id: "binary-search",
    label: "Binary Search",
    blurb: "Halve the search space, every single step.",
  },
  {
    id: "linked-list",
    label: "Linked List",
    blurb: "Pointer surgery: reversing, merging, and finding cycles.",
  },
  {
    id: "trees",
    label: "Trees",
    blurb: "Recursion's natural home. Depth, breadth, and everything between.",
  },
  {
    id: "tries",
    label: "Tries",
    blurb: "A tree of characters, for when prefixes are the question.",
  },
  {
    id: "heap",
    label: "Heap / Priority Queue",
    blurb: "Always know the smallest or largest, without sorting everything.",
  },
  {
    id: "backtracking",
    label: "Backtracking",
    blurb: "Try a choice, explore, undo it, try the next.",
  },
  {
    id: "graphs",
    label: "Graphs",
    blurb: "Islands, paths, and the difference between DFS and BFS.",
  },
  {
    id: "advanced-graphs",
    label: "Advanced Graphs",
    blurb: "Shortest paths, minimum spanning trees, topological order.",
  },
  {
    id: "dp-1d",
    label: "1-D Dynamic Programming",
    blurb: "Build the answer from the answers to smaller versions.",
  },
  {
    id: "dp-2d",
    label: "2-D Dynamic Programming",
    blurb: "The same idea, on a grid of subproblems.",
  },
  {
    id: "greedy",
    label: "Greedy",
    blurb: "Take the best option now and never look back — when that works.",
  },
  {
    id: "intervals",
    label: "Intervals",
    blurb: "Sort by start, then watch where the ranges touch.",
  },
  {
    id: "math-geometry",
    label: "Math & Geometry",
    blurb: "Rotations, spirals, and arithmetic that needs care.",
  },
  {
    id: "bit-manipulation",
    label: "Bit Manipulation",
    blurb: "Thinking in ones and zeroes, and the tricks that fall out.",
  },
];

/** Look one up by id, for turning a stored id back into a topic. */
export function getTopic(id) {
  return TOPICS.find((topic) => topic.id === id) ?? null;
}

/** How each difficulty is shown. */
export const DIFFICULTIES = [
  { id: "Easy", label: "Easy" },
  { id: "Medium", label: "Medium" },
  { id: "Hard", label: "Hard" },
];

/**
 * How many problems the library holds.
 *
 * Written down so that app chrome — the footer, say — can show the total
 * without importing all 150 problems and dragging them into the main bundle.
 *
 * `npm run check:problems` asserts this matches reality, so it cannot drift.
 */
export const PROBLEM_COUNT = 150;
