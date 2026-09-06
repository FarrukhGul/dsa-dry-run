/**
 * statements/advanced-graphs.js — the questions for the advanced graph pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const advancedGraphsStatements = {
  "reconstruct-itinerary": {
    description:
      "You have a pile of airline tickets, each from one airport to another. Use every ticket exactly once, starting at JFK, and return the airports in order. If several routes are possible, return the one that is alphabetically smallest.",
    examples: [
      {
        input: "tickets = [[MUC,LHR],[JFK,MUC],[SFO,SJC],[LHR,SFO]]",
        output: "[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]",
        explanation: "Only one route uses every ticket.",
      },
    ],
    constraints: ["1 \u2264 tickets.length \u2264 300", "A valid route always exists, starting at JFK."],
    starter: `// Reconstruct Itinerary
// Use every ticket once, starting at JFK. Alphabetically smallest route.

function findItinerary(tickets) {
  // Your code here.
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
  },

  "min-cost-to-connect-all-points": {
    description:
      "Points are given on a plane. Joining two costs the horizontal distance plus the vertical distance between them. Connect every point, directly or indirectly, for the least total cost.",
    examples: [
      {
        input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]",
        output: "20",
        explanation: "The cheapest set of connections joining all five totals 20.",
      },
    ],
    constraints: ["1 \u2264 points.length \u2264 1,000", "Cost is Manhattan distance."],
    starter: `// Min Cost to Connect All Points
// Connect every point for the least total Manhattan distance.

function minCostConnectPoints(points) {
  // Your code here.
}

console.log(minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]));
`,
  },

  "network-delay-time": {
    description:
      "A signal starts at node k and travels along directed edges, each taking a given time. Return how long until every node has received it, or -1 if some node never does.",
    examples: [
      {
        input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        output: "2",
        explanation: "Node 4 is the last to hear, two units later.",
      },
      {
        input: "a node with no route from k",
        output: "-1",
        explanation: "It never receives the signal.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 100", "Times are positive."],
    starter: `// Network Delay Time
// Time until every node receives the signal, or -1.

function networkDelayTime(times, n, k) {
  // Your code here.
}

console.log(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2));
`,
  },

  "swim-in-rising-water": {
    description:
      "Each square of a grid has a height, and the water level rises one unit per hour. You may move between neighbouring squares once the water covers both. Return the earliest time you can reach the bottom-right from the top-left.",
    examples: [
      {
        input: "grid = [[0,2],[1,3]]",
        output: "3",
        explanation: "You cannot enter the bottom-right until the water reaches 3.",
      },
      {
        input: "a grid whose highest square on the best path is 16",
        output: "16",
        explanation: "The answer is always the highest square you must cross.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 50", "Heights are a permutation of 0 to n squared minus 1."],
    starter: `// Swim in Rising Water
// Earliest time to cross, where a path costs its highest square.

function swimInWater(grid) {
  // Your code here.
}

console.log(swimInWater([[0, 2], [1, 3]]));
`,
  },

  "alien-dictionary": {
    description:
      "A list of words is sorted according to an unknown alphabet. Work out an ordering of the letters consistent with that sorting, or return an empty string if the list contradicts itself.",
    examples: [
      {
        input: "words = [wrt, wrf, er, ett, rftt]",
        output: "wertf",
        explanation: "Each adjacent pair reveals one ordering; together they fix the alphabet.",
      },
      {
        input: "words = [z, x, z]",
        output: "(empty)",
        explanation: "That would need z before and after x.",
      },
    ],
    constraints: ["1 \u2264 words.length \u2264 100", "Lowercase letters only."],
    starter: `// Alien Dictionary
// Work out the letter order, or "" if the list contradicts itself.

function alienOrder(words) {
  // Your code here.
}

console.log(alienOrder(["wrt", "wrf", "er", "ett", "rftt"]));
`,
  },

  "cheapest-flights-within-k-stops": {
    description:
      "Find the cheapest route from one city to another using at most k stops in between. Return -1 if no such route exists. The stop limit is what stops this from being ordinary shortest-path.",
    examples: [
      {
        input: "n = 4, src = 0, dst = 3, k = 1",
        output: "700",
        explanation: "0 to 1 to 3 costs 700 with one stop; the cheaper route needs two.",
      },
      {
        input: "the same with k = 0",
        output: "-1",
        explanation: "No direct flight exists.",
      },
    ],
    constraints: ["1 \u2264 n \u2264 100", "0 \u2264 k < n"],
    starter: `// Cheapest Flights Within K Stops
// Cheapest route using at most k stops, or -1.

function findCheapestPrice(n, flights, source, destination, k) {
  // Your code here.
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
  },

};
