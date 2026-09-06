/**
 * statements/graphs.js — the questions for the graph pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const graphsStatements = {
  "number-of-islands": {
    description:
      "A grid of \"1\" for land and \"0\" for water. Count the islands, where an island is land connected horizontally or vertically, surrounded by water or the edge of the grid.",
    examples: [
      {
        input: "grid with two blocks of land in the corners and one in the middle",
        output: "3",
        explanation: "Three separate landmasses.",
      },
      {
        input: "a grid that is entirely \"1\"",
        output: "1",
        explanation: "All the land touches, so it is one island.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 300", "Squares are \"0\" or \"1\"."],
    starter: `// Number of Islands
// Count connected groups of "1", joined horizontally or vertically.

function numIslands(grid) {
  // Your code here.
}

const grid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];

console.log(numIslands(grid));
`,
  },

  "max-area-of-island": {
    description:
      "Same grid idea, but with 1 and 0 as numbers. Return the number of squares in the largest island, or zero if there is no land at all.",
    examples: [
      {
        input: "a grid whose largest connected block covers six squares",
        output: "6",
        explanation: "Every other island is smaller.",
      },
      {
        input: "a grid of all zeroes",
        output: "0",
        explanation: "No land at all.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 50", "Squares are 0 or 1."],
    starter: `// Max Area of Island
// Return the size of the largest connected block of 1s.

function maxAreaOfIsland(grid) {
  // Your code here.
}

const grid = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0],
];

console.log(maxAreaOfIsland(grid));
`,
  },

  "clone-graph": {
    description:
      "Make a deep copy of a connected undirected graph: every node duplicated, every connection reproduced, and no node shared with the original. The graph contains cycles, which is the part that needs care.",
    examples: [
      {
        input: "a square: 1-2-3-4-1, starting from node 1",
        output: "[2, 4]",
        explanation: "Node 1's copy has neighbours 2 and 4 \u2014 the copies, not the originals.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 100", "The graph is connected and undirected."],
    starter: `// Clone Graph
// Deep-copy the graph. Mind the cycles.

class GraphNode {
  constructor(value) {
    this.value = value;
    this.neighbours = [];
  }
}

function cloneGraph(node) {
  // Your code here.
}

const one = new GraphNode(1);
const two = new GraphNode(2);
const three = new GraphNode(3);
const four = new GraphNode(4);
one.neighbours = [two, four];
two.neighbours = [one, three];
three.neighbours = [two, four];
four.neighbours = [one, three];

const cloned = cloneGraph(one);
console.log(cloned.neighbours.map((n) => n.value));
`,
  },

  "rotting-oranges": {
    description:
      "A grid holds empty squares (0), fresh oranges (1) and rotten ones (2). Every minute, a rotten orange rots any fresh orange directly beside it. Return how many minutes until none are fresh, or -1 if some can never rot.",
    examples: [
      {
        input: "a 3x3 grid with one rotten orange in the corner",
        output: "4",
        explanation: "The rot spreads outwards one ring per minute.",
      },
      {
        input: "a grid with a fresh orange cut off from any rotten one",
        output: "-1",
        explanation: "It can never rot.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 10", "Squares are 0, 1 or 2."],
    starter: `// Rotting Oranges
// Minutes until no orange is fresh, or -1 if impossible.

function orangesRotting(grid) {
  // Your code here.
}

const grid = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
];

console.log(orangesRotting(grid));
`,
  },

  "walls-and-gates": {
    description:
      "A grid of rooms where -1 is a wall, 0 is a gate, and a very large number means an empty room. Fill each empty room with the number of steps to its nearest gate, leaving rooms that cannot reach one untouched.",
    examples: [
      {
        input: "a 4x4 grid with two gates",
        output: "[[3,-1,0,1], [2,2,1,-1], [1,-1,2,-1], [0,-1,3,4]]",
        explanation: "Each room now holds its distance to the closest gate.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 250", "Modify the grid in place."],
    starter: `// Walls and Gates
// Fill each room with its distance to the nearest gate.

function wallsAndGates(rooms) {
  // Your code here.
}

const INF = 2147483647;
const rooms = [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];

console.log(wallsAndGates(rooms));
`,
  },

  "pacific-atlantic-water-flow": {
    description:
      "Each square has a height. Water flows to a neighbour of equal or lower height. The Pacific touches the top and left edges, the Atlantic the bottom and right. Count the squares from which water can reach both oceans.",
    examples: [
      {
        input: "a 5x5 height grid",
        output: "7",
        explanation: "Seven squares drain to both coasts.",
      },
      {
        input: "a single square",
        output: "1",
        explanation: "It touches every edge, so it reaches both.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 200", "Water flows to equal or lower heights."],
    starter: `// Pacific Atlantic Water Flow
// Count the squares draining to BOTH oceans.

function pacificAtlantic(heights) {
  // Your code here.
}

const heights = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];

console.log(pacificAtlantic(heights));
`,
  },

  "surrounded-regions": {
    description:
      "A grid of \"X\" and \"O\". Every region of O's entirely surrounded by X's is captured and becomes X. A region touching the border is safe \u2014 which makes the problem much easier upside down.",
    examples: [
      {
        input: "a 4x4 grid with one enclosed region and one touching the bottom edge",
        output: "the enclosed O's become X, the edge-connected one stays",
        explanation: "Only fully surrounded regions are captured.",
      },
    ],
    constraints: ["1 \u2264 rows, columns \u2264 200", "Modify the grid in place."],
    starter: `// Surrounded Regions
// Capture every region of "O" not connected to the border.

function solve(board) {
  // Your code here.
}

const board = [
  ["X", "X", "X", "X"],
  ["X", "O", "O", "X"],
  ["X", "X", "O", "X"],
  ["X", "O", "X", "X"],
];

console.log(solve(board));
`,
  },

  "course-schedule": {
    description:
      "Courses are numbered from zero, and a pair [a, b] means a needs b done first. Decide whether every course can be finished. It is impossible exactly when the requirements form a loop.",
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Do 0, then 1.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "Each needs the other first.",
      },
    ],
    constraints: ["1 \u2264 numCourses \u2264 2,000", "No duplicate pairs."],
    starter: `// Course Schedule
// Can every course be finished? False if the requirements loop.

function canFinish(numCourses, prerequisites) {
  // Your code here.
}

console.log(canFinish(2, [[1, 0]]));
`,
  },

  "course-schedule-ii": {
    description:
      "The same setup, but return an order in which the courses can actually be taken. If several orders work, any is fine; if none does, return an empty array.",
    examples: [
      {
        input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
        output: "[0, 1, 2, 3]",
        explanation: "0 first, then 1 and 2 in either order, then 3.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "[]",
        explanation: "The loop makes it impossible.",
      },
    ],
    constraints: ["1 \u2264 numCourses \u2264 2,000", "Any valid order is accepted."],
    starter: `// Course Schedule II
// Return an order the courses can be taken in, or [].

function findOrder(numCourses, prerequisites) {
  // Your code here.
}

console.log(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));
`,
  },

  "graph-valid-tree": {
    description:
      "Given n nodes and a list of undirected edges, decide whether they form a tree: everything connected, and no cycles anywhere.",
    examples: [
      {
        input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]",
        output: "true",
        explanation: "All five connect, with no loop.",
      },
      {
        input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]",
        output: "false",
        explanation: "1, 2 and 3 form a loop.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 2,000", "No repeated or self edges."],
    starter: `// Graph Valid Tree
// Is this connected and free of cycles?

function validTree(n, edges) {
  // Your code here.
}

console.log(validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]));
`,
  },

  "number-of-connected-components": {
    description:
      "Given n nodes and undirected edges, count how many separate pieces the graph comes in. A node with no edges is a piece of its own.",
    examples: [
      {
        input: "n = 5, edges = [[0,1],[1,2],[3,4]]",
        output: "2",
        explanation: "0,1,2 form one piece and 3,4 another.",
      },
      {
        input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]",
        output: "1",
        explanation: "One chain joins them all.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 2,000", "No repeated or self edges."],
    starter: `// Number of Connected Components in an Undirected Graph
// Count the separate pieces.

function countComponents(n, edges) {
  // Your code here.
}

console.log(countComponents(5, [[0, 1], [1, 2], [3, 4]]));
`,
  },

  "redundant-connection": {
    description:
      "A tree with n nodes has had one extra edge added, creating exactly one cycle. Find that edge. If several would do, return the one appearing last in the input.",
    examples: [
      {
        input: "edges = [[1,2],[1,3],[2,3]]",
        output: "[2, 3]",
        explanation: "Removing it leaves a proper tree.",
      },
      {
        input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]",
        output: "[1, 4]",
        explanation: "It is the later of the two edges closing the loop.",
      },
    ],
    constraints: ["3 \u2264 edges.length \u2264 1,000", "Exactly one extra edge."],
    starter: `// Redundant Connection
// Find the added edge that creates the cycle.

function findRedundantConnection(edges) {
  // Your code here.
}

console.log(findRedundantConnection([[1, 2], [1, 3], [2, 3]]));
`,
  },

  "word-ladder": {
    description:
      "Change one word into another a single letter at a time, where every word along the way must be in the given list. Return the number of words in the shortest such chain, counting both ends, or zero if there is none.",
    examples: [
      {
        input: "begin = \"hit\", end = \"cog\", list = [hot,dot,dog,lot,log,cog]",
        output: "5",
        explanation: "hit, hot, dot, dog, cog is five words.",
      },
      {
        input: "begin = \"hit\", end = \"cog\", list without cog",
        output: "0",
        explanation: "The destination is not in the list.",
      },
    ],
    constraints: ["1 \u2264 word length \u2264 10", "All words are the same length."],
    starter: `// Word Ladder
// Shortest chain of one-letter changes, counting both ends.

function ladderLength(beginWord, endWord, wordList) {
  // Your code here.
}

console.log(
  ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]),
);
`,
  },

};
