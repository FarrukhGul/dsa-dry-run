/**
 * statements/intervals.js — the questions for the intervals pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const intervalsStatements = {
  "insert-interval": {
    description:
      "A sorted list of non-overlapping ranges, plus one new range. Insert it, merging with anything it touches, and keep the result sorted and non-overlapping.",
    examples: [
      {
        input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
        output: "[[1, 5], [6, 9]]",
        explanation: "The new range overlaps [1,3], so they merge.",
      },
      {
        input: "intervals = [[1,5]], newInterval = [6,8]",
        output: "[[1, 5], [6, 8]]",
        explanation: "No overlap, so it just slots in after.",
      },
    ],
    constraints: ["0 \u2264 intervals.length \u2264 10,000", "The input is sorted and non-overlapping."],
    starter: `// Insert Interval
// Insert the new range, merging anything it touches.

function insert(intervals, newInterval) {
  // Your code here.
}

console.log(insert([[1, 3], [6, 9]], [2, 5]));
`,
  },

  "merge-intervals": {
    description:
      "Given a list of ranges in any order, combine every group that overlaps into a single range, and return the result.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1, 6], [8, 10], [15, 18]]",
        explanation: "[1,3] and [2,6] overlap and become [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1, 5]]",
        explanation: "Touching at a single point counts as overlapping.",
      },
    ],
    constraints: ["1 \u2264 intervals.length \u2264 10,000"],
    starter: `// Merge Intervals
// Combine every overlapping group into one range.

function merge(intervals) {
  // Your code here.
}

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
`,
  },

  "non-overlapping-intervals": {
    description:
      "Return the fewest ranges you must remove so that none of the rest overlap. Ranges that merely touch at an endpoint do not count as overlapping.",
    examples: [
      {
        input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        output: "1",
        explanation: "Removing [1,3] leaves three that only touch.",
      },
      {
        input: "intervals = [[1,2],[1,2],[1,2]]",
        output: "2",
        explanation: "Two of the three identical ranges must go.",
      },
    ],
    constraints: ["1 \u2264 intervals.length \u2264 100,000"],
    starter: `// Non-overlapping Intervals
// Fewest removals so nothing overlaps.

function eraseOverlapIntervals(intervals) {
  // Your code here.
}

console.log(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]));
`,
  },

  "meeting-rooms": {
    description:
      "Given meeting start and end times, decide whether one person could attend all of them. A meeting ending exactly as another starts is fine.",
    examples: [
      {
        input: "intervals = [[0,30],[5,10],[15,20]]",
        output: "false",
        explanation: "The first meeting overlaps both others.",
      },
      {
        input: "intervals = [[7,10],[2,4]]",
        output: "true",
        explanation: "They do not overlap.",
      },
    ],
    constraints: ["0 \u2264 intervals.length \u2264 10,000"],
    starter: `// Meeting Rooms
// Could one person attend every meeting?

function canAttendMeetings(intervals) {
  // Your code here.
}

console.log(canAttendMeetings([[0, 30], [5, 10], [15, 20]]));
`,
  },

  "meeting-rooms-ii": {
    description:
      "Return the fewest rooms needed so that every meeting has one. That is the largest number of meetings running at the same moment.",
    examples: [
      {
        input: "intervals = [[0,30],[5,10],[15,20]]",
        output: "2",
        explanation: "At its busiest, two meetings overlap.",
      },
      {
        input: "intervals = [[7,10],[2,4]]",
        output: "1",
        explanation: "They never overlap, so one room does.",
      },
    ],
    constraints: ["0 \u2264 intervals.length \u2264 10,000"],
    starter: `// Meeting Rooms II
// Fewest rooms so every meeting has one.

function minMeetingRooms(intervals) {
  // Your code here.
}

console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]]));
`,
  },

  "minimum-interval-to-include-each-query": {
    description:
      "For each query value, return the size of the smallest range covering it, or -1 if none does. A range covers a value when the value lies between its ends, inclusive, and its size is end minus start plus one.",
    examples: [
      {
        input: "intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]",
        output: "[3, 3, 1, 4]",
        explanation: "Query 4 is covered by [4,4], which has size 1.",
      },
      {
        input: "a query outside every range",
        output: "-1",
        explanation: "Nothing covers it.",
      },
    ],
    constraints: ["1 \u2264 intervals.length, queries.length \u2264 100,000"],
    starter: `// Minimum Interval to Include Each Query
// For each query, the size of the smallest covering range, or -1.

function minInterval(intervals, queries) {
  // Your code here.
}

console.log(minInterval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]));
`,
  },

};
