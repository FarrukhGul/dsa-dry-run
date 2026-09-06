/**
 * advanced-graphs.js — shortest paths, spanning trees, topological order.
 *
 * These are the named algorithms: Dijkstra, Prim, Bellman-Ford, Hierholzer.
 * Worth stepping through slowly the first time — each one is short, but the
 * reason it is correct lives in the order things come off the queue.
 */

export const advancedGraphs = [
  {
    id: "reconstruct-itinerary",
    title: "Reconstruct Itinerary",
    difficulty: "Hard",
    summary:
      "Order a pile of tickets into one journey using all of them, preferring alphabetically earlier airports. Building the route backwards, adding each airport once it is a dead end, handles the tricky cases for free.",
    solution: `// Reconstruct Itinerary
// Hierholzer's algorithm: add an airport once it has no tickets left.

function findItinerary(tickets) {
  const destinations = new Map();

  for (const [from, to] of tickets) {
    if (!destinations.has(from)) {
      destinations.set(from, []);
    }
    destinations.get(from).push(to);
  }

  // Alphabetical, so the smallest is taken first.
  for (const list of destinations.values()) {
    list.sort();
  }

  const route = [];

  function visit(airport) {
    const next = destinations.get(airport) ?? [];

    while (next.length > 0) {
      visit(next.shift());
    }

    // Nothing left from here, so this is where the journey ends up.
    route.push(airport);
  }

  visit("JFK");

  return route.reverse();
}

console.log(
  findItinerary([
    ["MUC", "LHR"],
    ["JFK", "MUC"],
    ["SFO", "SJC"],
    ["LHR", "SFO"],
  ]),
);
`,
    expectedOutput: '["JFK", "MUC", "LHR", "SFO", "SJC"]',
  },

  {
    id: "min-cost-to-connect-all-points",
    title: "Min Cost to Connect All Points",
    difficulty: "Medium",
    summary:
      "Join every point for the least total distance. Prim's algorithm: grow one connected blob, each round absorbing whichever outside point is nearest to it.",
    solution: `// Min Cost to Connect All Points
// Prim's algorithm: repeatedly absorb the nearest point not yet connected.

function minCostConnectPoints(points) {
  const n = points.length;
  const connected = new Array(n).fill(false);

  // Cheapest known distance from the growing blob to each point.
  const distance = new Array(n).fill(Infinity);
  distance[0] = 0;

  let total = 0;

  for (let round = 0; round < n; round++) {
    // Find the nearest point still outside.
    let nearest = -1;

    for (let i = 0; i < n; i++) {
      if (!connected[i] && (nearest === -1 || distance[i] < distance[nearest])) {
        nearest = i;
      }
    }

    connected[nearest] = true;
    total += distance[nearest];

    // Absorbing it may bring other points closer.
    for (let i = 0; i < n; i++) {
      if (connected[i]) continue;

      const cost =
        Math.abs(points[nearest][0] - points[i][0]) +
        Math.abs(points[nearest][1] - points[i][1]);

      distance[i] = Math.min(distance[i], cost);
    }
  }

  return total;
}

console.log(minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]));
`,
    expectedOutput: "20",
  },

  {
    id: "network-delay-time",
    title: "Network Delay Time",
    difficulty: "Medium",
    summary:
      "How long until a signal reaches every node? Dijkstra from the source, and the answer is the largest of the shortest times.",
    solution: `// Network Delay Time
// Dijkstra: always settle the nearest unsettled node next.

function networkDelayTime(times, n, k) {
  const edges = new Map();

  for (let node = 1; node <= n; node++) {
    edges.set(node, []);
  }

  for (const [from, to, weight] of times) {
    edges.get(from).push([to, weight]);
  }

  const best = new Map();
  const settled = new Set();
  best.set(k, 0);

  while (settled.size < n) {
    // The nearest node we know about that is not settled yet.
    let current = -1;

    for (const [node, cost] of best) {
      if (!settled.has(node) && (current === -1 || cost < best.get(current))) {
        current = node;
      }
    }

    if (current === -1) {
      break; // some nodes are unreachable
    }

    settled.add(current);

    for (const [next, weight] of edges.get(current)) {
      const arrival = best.get(current) + weight;

      if (!best.has(next) || arrival < best.get(next)) {
        best.set(next, arrival);
      }
    }
  }

  if (settled.size < n) {
    return -1;
  }

  let slowest = 0;
  for (const cost of best.values()) {
    slowest = Math.max(slowest, cost);
  }

  return slowest;
}

console.log(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2));
`,
    expectedOutput: "2",
  },

  {
    id: "swim-in-rising-water",
    title: "Swim in Rising Water",
    difficulty: "Hard",
    summary:
      "Cross a grid as the water rises; the cost of a path is its highest square. Dijkstra again, except a path's cost is a maximum rather than a sum.",
    solution: `// Swim in Rising Water
// Like Dijkstra, but a path costs the HIGHEST square on it, not the total.

function swimInWater(grid) {
  const n = grid.length;

  const best = [];
  for (let row = 0; row < n; row++) {
    best.push(new Array(n).fill(Infinity));
  }

  best[0][0] = grid[0][0];
  const settled = new Set();

  while (true) {
    // The reachable square with the lowest water level so far.
    let bestRow = -1;
    let bestColumn = -1;

    for (let row = 0; row < n; row++) {
      for (let column = 0; column < n; column++) {
        const key = row + "," + column;
        if (settled.has(key) || best[row][column] === Infinity) continue;

        if (bestRow === -1 || best[row][column] < best[bestRow][bestColumn]) {
          bestRow = row;
          bestColumn = column;
        }
      }
    }

    if (bestRow === -1) {
      return -1;
    }

    if (bestRow === n - 1 && bestColumn === n - 1) {
      return best[bestRow][bestColumn];
    }

    settled.add(bestRow + "," + bestColumn);

    const neighbours = [
      [bestRow + 1, bestColumn],
      [bestRow - 1, bestColumn],
      [bestRow, bestColumn + 1],
      [bestRow, bestColumn - 1],
    ];

    for (const [row, column] of neighbours) {
      if (row < 0 || column < 0 || row >= n || column >= n) continue;

      // Waiting for the higher of the two squares.
      const needed = Math.max(best[bestRow][bestColumn], grid[row][column]);
      best[row][column] = Math.min(best[row][column], needed);
    }
  }
}

console.log(swimInWater([[0, 2], [1, 3]]));
`,
    expectedOutput: "3",
  },

  {
    id: "alien-dictionary",
    title: "Alien Dictionary",
    difficulty: "Hard",
    summary:
      "Work out an unknown alphabet from a sorted word list. Each adjacent pair reveals one ordering — the first place they differ — and those rules topologically sorted give the alphabet.",
    solution: `// Alien Dictionary
// Adjacent words reveal one ordering each; topologically sort the rules.

function alienOrder(words) {
  const after = new Map(); // letter -> letters that must come after it

  for (const word of words) {
    for (const letter of word) {
      if (!after.has(letter)) {
        after.set(letter, new Set());
      }
    }
  }

  for (let i = 0; i < words.length - 1; i++) {
    const first = words[i];
    const second = words[i + 1];
    const shortest = Math.min(first.length, second.length);

    // A longer word before its own prefix is impossible.
    if (first.length > second.length && first.slice(0, shortest) === second) {
      return "";
    }

    for (let j = 0; j < shortest; j++) {
      if (first[j] !== second[j]) {
        after.get(first[j]).add(second[j]);
        break; // only the FIRST difference tells us anything
      }
    }
  }

  const visiting = new Set();
  const done = new Set();
  const reversed = [];

  function visit(letter) {
    if (visiting.has(letter)) return false; // a cycle: contradictory rules
    if (done.has(letter)) return true;

    visiting.add(letter);

    for (const next of after.get(letter)) {
      if (!visit(next)) return false;
    }

    visiting.delete(letter);
    done.add(letter);
    reversed.push(letter);

    return true;
  }

  for (const letter of after.keys()) {
    if (!visit(letter)) {
      return "";
    }
  }

  return reversed.reverse().join("");
}

console.log(alienOrder(["wrt", "wrf", "er", "ett", "rftt"]));
`,
    expectedOutput: "wertf",
  },

  {
    id: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    summary:
      "Cheapest route with a limit on how many stops. Bellman-Ford fits perfectly: each round allows one more flight, so run it k+1 times.",
    solution: `// Cheapest Flights Within K Stops
// Bellman-Ford: each round allows one more flight.

function findCheapestPrice(n, flights, source, destination, k) {
  let costs = new Array(n).fill(Infinity);
  costs[source] = 0;

  for (let round = 0; round <= k; round++) {
    // Work from a snapshot, so each round adds exactly one flight.
    const updated = [...costs];

    for (const [from, to, price] of flights) {
      if (costs[from] === Infinity) continue;

      updated[to] = Math.min(updated[to], costs[from] + price);
    }

    costs = updated;
  }

  return costs[destination] === Infinity ? -1 : costs[destination];
}

const flights = [
  [0, 1, 100],
  [1, 2, 100],
  [2, 0, 100],
  [1, 3, 600],
  [2, 3, 200],
];

console.log(findCheapestPrice(4, flights, 0, 3, 1));
`,
    expectedOutput: "700",
  },
];
