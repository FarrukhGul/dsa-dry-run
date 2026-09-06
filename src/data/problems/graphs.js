/**
 * graphs.js — islands, paths, and knowing which search to reach for.
 *
 * The rule of thumb worth internalising: depth-first when you want to explore
 * a whole region, breadth-first when you want the shortest number of steps.
 * Nearly every problem here is one of those two with different scenery.
 */

export const graphs = [
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    summary:
      "Count the separate landmasses in a grid. Every time you find land nobody has visited, that is a new island — then flood the whole thing so it is never counted twice.",
    solution: `// Number of Islands
// Each unvisited piece of land starts an island; sink it as you count it.

function numIslands(grid) {
  const rows = grid.length;
  const columns = grid[0].length;
  let islands = 0;

  function sink(row, column) {
    if (row < 0 || column < 0 || row >= rows || column >= columns) {
      return;
    }

    if (grid[row][column] !== "1") {
      return;
    }

    grid[row][column] = "0"; // visited

    sink(row + 1, column);
    sink(row - 1, column);
    sink(row, column + 1);
    sink(row, column - 1);
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (grid[row][column] === "1") {
        islands++;
        sink(row, column);
      }
    }
  }

  return islands;
}

const grid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];

console.log(numIslands(grid));
`,
    expectedOutput: "3",
  },

  {
    id: "max-area-of-island",
    title: "Max Area of Island",
    difficulty: "Medium",
    summary:
      "The same flood fill, but returning how many squares it covered rather than just counting the islands.",
    solution: `// Max Area of Island
// Flood fill, but count the squares as you go.

function maxAreaOfIsland(grid) {
  const rows = grid.length;
  const columns = grid[0].length;
  let biggest = 0;

  function measure(row, column) {
    if (row < 0 || column < 0 || row >= rows || column >= columns) {
      return 0;
    }

    if (grid[row][column] !== 1) {
      return 0;
    }

    grid[row][column] = 0; // visited

    return (
      1 +
      measure(row + 1, column) +
      measure(row - 1, column) +
      measure(row, column + 1) +
      measure(row, column - 1)
    );
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      biggest = Math.max(biggest, measure(row, column));
    }
  }

  return biggest;
}

const grid = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0],
];

console.log(maxAreaOfIsland(grid));
`,
    expectedOutput: "6",
  },

  {
    id: "clone-graph",
    title: "Clone Graph",
    difficulty: "Medium",
    summary:
      "Deep-copy a graph. The trap is cycles — a map from original node to its copy both prevents infinite recursion and makes shared neighbours line up.",
    solution: `// Clone Graph
// A map from original to copy stops cycles from looping forever.

class GraphNode {
  constructor(value) {
    this.value = value;
    this.neighbours = [];
  }
}

function cloneGraph(node) {
  const copies = new Map();

  function copy(original) {
    if (original === null) {
      return null;
    }

    if (copies.has(original)) {
      return copies.get(original);
    }

    const clone = new GraphNode(original.value);
    copies.set(original, clone); // set BEFORE recursing, or a cycle loops

    for (const neighbour of original.neighbours) {
      clone.neighbours.push(copy(neighbour));
    }

    return clone;
  }

  return copy(node);
}

// A square: 1-2-3-4-1
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
    expectedOutput: "[2, 4]",
  },

  {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "Medium",
    summary:
      "Rot spreads to neighbours one minute at a time. Because every rotten orange spreads at once, this is breadth-first search starting from all of them together.",
    solution: `// Rotting Oranges
// BFS from every rotten orange at once, one minute per round.

function orangesRotting(grid) {
  const rows = grid.length;
  const columns = grid[0].length;

  let queue = [];
  let fresh = 0;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (grid[row][column] === 2) queue.push([row, column]);
      if (grid[row][column] === 1) fresh++;
    }
  }

  let minutes = 0;

  while (queue.length > 0 && fresh > 0) {
    const next = [];

    for (const [row, column] of queue) {
      const neighbours = [
        [row + 1, column],
        [row - 1, column],
        [row, column + 1],
        [row, column - 1],
      ];

      for (const [r, c] of neighbours) {
        if (r < 0 || c < 0 || r >= rows || c >= columns) continue;
        if (grid[r][c] !== 1) continue;

        grid[r][c] = 2;
        fresh--;
        next.push([r, c]);
      }
    }

    queue = next;
    minutes++;
  }

  return fresh === 0 ? minutes : -1;
}

const grid = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
];

console.log(orangesRotting(grid));
`,
    expectedOutput: "4",
  },

  {
    id: "walls-and-gates",
    title: "Walls and Gates",
    difficulty: "Medium",
    summary:
      "Fill each empty room with its distance to the nearest gate. Starting a breadth-first search from every gate simultaneously gets all the answers in one sweep.",
    solution: `// Walls and Gates
// One BFS starting from every gate at the same time.

function wallsAndGates(rooms) {
  const rows = rooms.length;
  const columns = rooms[0].length;
  const EMPTY = 2147483647;

  let queue = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (rooms[row][column] === 0) {
        queue.push([row, column]);
      }
    }
  }

  let distance = 0;

  while (queue.length > 0) {
    const next = [];
    distance++;

    for (const [row, column] of queue) {
      const neighbours = [
        [row + 1, column],
        [row - 1, column],
        [row, column + 1],
        [row, column - 1],
      ];

      for (const [r, c] of neighbours) {
        if (r < 0 || c < 0 || r >= rows || c >= columns) continue;
        if (rooms[r][c] !== EMPTY) continue;

        rooms[r][c] = distance;
        next.push([r, c]);
      }
    }

    queue = next;
  }

  return rooms;
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
    expectedOutput: "[[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]",
  },

  {
    id: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    summary:
      "Which squares drain to both oceans? Rather than tracing every square downhill, start at each coast and walk uphill — then take the squares both searches reached.",
    solution: `// Pacific Atlantic Water Flow
// Start at the coasts and climb uphill; take the overlap.

function pacificAtlantic(heights) {
  const rows = heights.length;
  const columns = heights[0].length;

  const pacific = new Set();
  const atlantic = new Set();

  function climb(row, column, reached, cameFrom) {
    if (row < 0 || column < 0 || row >= rows || column >= columns) return;

    const key = row + "," + column;
    if (reached.has(key)) return;

    // Water only flows downhill, so climbing means never going lower.
    if (heights[row][column] < cameFrom) return;

    reached.add(key);
    const height = heights[row][column];

    climb(row + 1, column, reached, height);
    climb(row - 1, column, reached, height);
    climb(row, column + 1, reached, height);
    climb(row, column - 1, reached, height);
  }

  for (let column = 0; column < columns; column++) {
    climb(0, column, pacific, -Infinity);
    climb(rows - 1, column, atlantic, -Infinity);
  }

  for (let row = 0; row < rows; row++) {
    climb(row, 0, pacific, -Infinity);
    climb(row, columns - 1, atlantic, -Infinity);
  }

  const both = [];
  for (const key of pacific) {
    if (atlantic.has(key)) {
      both.push(key);
    }
  }

  return both.length;
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
    expectedOutput: "7",
  },

  {
    id: "surrounded-regions",
    title: "Surrounded Regions",
    difficulty: "Medium",
    summary:
      "Capture every region fully enclosed by O's opponents. Easier upside down: mark everything reachable from the edge as safe, and capture whatever is left.",
    solution: `// Surrounded Regions
// Mark what touches the border as safe; capture everything else.

function solve(board) {
  const rows = board.length;
  const columns = board[0].length;

  function markSafe(row, column) {
    if (row < 0 || column < 0 || row >= rows || column >= columns) return;
    if (board[row][column] !== "O") return;

    board[row][column] = "S"; // safe

    markSafe(row + 1, column);
    markSafe(row - 1, column);
    markSafe(row, column + 1);
    markSafe(row, column - 1);
  }

  // Anything connected to the border survives.
  for (let row = 0; row < rows; row++) {
    markSafe(row, 0);
    markSafe(row, columns - 1);
  }
  for (let column = 0; column < columns; column++) {
    markSafe(0, column);
    markSafe(rows - 1, column);
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (board[row][column] === "O") board[row][column] = "X";
      if (board[row][column] === "S") board[row][column] = "O";
    }
  }

  return board;
}

const board = [
  ["X", "X", "X", "X"],
  ["X", "O", "O", "X"],
  ["X", "X", "O", "X"],
  ["X", "O", "X", "X"],
];

console.log(solve(board));
`,
    expectedOutput:
      '[["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]',
  },

  {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    summary:
      "Can every course be finished given its prerequisites? Only if the dependency graph has no cycle — so look for one, marking courses currently on the path.",
    solution: `// Course Schedule
// A cycle in the prerequisites makes it impossible.

function canFinish(numCourses, prerequisites) {
  const needs = new Map();

  for (let course = 0; course < numCourses; course++) {
    needs.set(course, []);
  }

  for (const [course, required] of prerequisites) {
    needs.get(course).push(required);
  }

  const onPath = new Set();  // courses in the current chain
  const finished = new Set(); // already proven fine

  function canTake(course) {
    if (onPath.has(course)) {
      return false; // came back to where we started: a cycle
    }

    if (finished.has(course)) {
      return true;
    }

    onPath.add(course);

    for (const required of needs.get(course)) {
      if (!canTake(required)) {
        return false;
      }
    }

    onPath.delete(course);
    finished.add(course);

    return true;
  }

  for (let course = 0; course < numCourses; course++) {
    if (!canTake(course)) {
      return false;
    }
  }

  return true;
}

console.log(canFinish(2, [[1, 0]]));
`,
    expectedOutput: "true",
  },

  {
    id: "course-schedule-ii",
    title: "Course Schedule II",
    difficulty: "Medium",
    summary:
      "Not just whether the courses can be finished, but in what order. The same search, recording each course once everything it depends on is already recorded.",
    solution: `// Course Schedule II
// Record a course only once all its prerequisites are recorded.

function findOrder(numCourses, prerequisites) {
  const needs = new Map();

  for (let course = 0; course < numCourses; course++) {
    needs.set(course, []);
  }

  for (const [course, required] of prerequisites) {
    needs.get(course).push(required);
  }

  const order = [];
  const onPath = new Set();
  const finished = new Set();

  function visit(course) {
    if (onPath.has(course)) return false;
    if (finished.has(course)) return true;

    onPath.add(course);

    for (const required of needs.get(course)) {
      if (!visit(required)) {
        return false;
      }
    }

    onPath.delete(course);
    finished.add(course);

    // Everything it depends on is already in the list, so it can go now.
    order.push(course);

    return true;
  }

  for (let course = 0; course < numCourses; course++) {
    if (!visit(course)) {
      return [];
    }
  }

  return order;
}

console.log(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));
`,
    expectedOutput: "[0, 1, 2, 3]",
  },

  {
    id: "graph-valid-tree",
    title: "Graph Valid Tree",
    difficulty: "Medium",
    summary:
      "Is this graph a tree? Two conditions, both required: exactly n-1 edges, and everything connected. Together those rule out both cycles and separate pieces.",
    solution: `// Graph Valid Tree
// A tree has exactly n-1 edges and is all in one piece.

function validTree(n, edges) {
  if (edges.length !== n - 1) {
    return false;
  }

  const neighbours = new Map();
  for (let node = 0; node < n; node++) {
    neighbours.set(node, []);
  }

  for (const [a, b] of edges) {
    neighbours.get(a).push(b);
    neighbours.get(b).push(a);
  }

  const seen = new Set();

  function visit(node) {
    if (seen.has(node)) return;
    seen.add(node);

    for (const next of neighbours.get(node)) {
      visit(next);
    }
  }

  visit(0);

  // n-1 edges and no cycle means connected iff we reached everything.
  return seen.size === n;
}

console.log(validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]));
`,
    expectedOutput: "true",
  },

  {
    id: "number-of-connected-components",
    title: "Number of Connected Components",
    difficulty: "Medium",
    summary:
      "How many separate pieces does the graph come in? Start a search from each unvisited node; the number of searches you had to start is the answer.",
    solution: `// Number of Connected Components in an Undirected Graph
// Count how many times you have to start a fresh search.

function countComponents(n, edges) {
  const neighbours = new Map();
  for (let node = 0; node < n; node++) {
    neighbours.set(node, []);
  }

  for (const [a, b] of edges) {
    neighbours.get(a).push(b);
    neighbours.get(b).push(a);
  }

  const seen = new Set();

  function visit(node) {
    if (seen.has(node)) return;
    seen.add(node);

    for (const next of neighbours.get(node)) {
      visit(next);
    }
  }

  let components = 0;

  for (let node = 0; node < n; node++) {
    if (!seen.has(node)) {
      components++;
      visit(node);
    }
  }

  return components;
}

console.log(countComponents(5, [[0, 1], [1, 2], [3, 4]]));
`,
    expectedOutput: "2",
  },

  {
    id: "redundant-connection",
    title: "Redundant Connection",
    difficulty: "Medium",
    summary:
      "One extra edge has turned a tree into a graph with a cycle. Add the edges one by one with union-find; the first that joins two already-connected nodes is the culprit.",
    solution: `// Redundant Connection
// Union-find: the first edge joining two already-connected nodes is the extra.

function findRedundantConnection(edges) {
  const parent = [];
  for (let i = 0; i <= edges.length; i++) {
    parent.push(i);
  }

  function find(node) {
    while (parent[node] !== node) {
      // Path compression: point straight at the grandparent as we go.
      parent[node] = parent[parent[node]];
      node = parent[node];
    }
    return node;
  }

  for (const [a, b] of edges) {
    const rootA = find(a);
    const rootB = find(b);

    if (rootA === rootB) {
      return [a, b]; // already connected, so this edge closes a cycle
    }

    parent[rootA] = rootB;
  }

  return [];
}

console.log(findRedundantConnection([[1, 2], [1, 3], [2, 3]]));
`,
    expectedOutput: "[2, 3]",
  },

  {
    id: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    summary:
      "Turn one word into another, one letter at a time, staying in the dictionary. Shortest number of steps means breadth-first — and the neighbours are found by trying every letter in every position.",
    solution: `// Word Ladder
// BFS, where a word's neighbours are every one-letter change in the list.

function ladderLength(beginWord, endWord, wordList) {
  const available = new Set(wordList);

  if (!available.has(endWord)) {
    return 0;
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let queue = [beginWord];
  let steps = 1;

  available.delete(beginWord);

  while (queue.length > 0) {
    const next = [];

    for (const word of queue) {
      if (word === endWord) {
        return steps;
      }

      for (let i = 0; i < word.length; i++) {
        for (const letter of alphabet) {
          const candidate = word.slice(0, i) + letter + word.slice(i + 1);

          if (available.has(candidate)) {
            available.delete(candidate); // never revisit
            next.push(candidate);
          }
        }
      }
    }

    queue = next;
    steps++;
  }

  return 0;
}

console.log(
  ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]),
);
`,
    expectedOutput: "5",
  },
];
