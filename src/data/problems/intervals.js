/**
 * intervals.js — sort by start, then watch where the ranges touch.
 *
 * Nearly every interval problem opens the same way: sort, then walk through
 * comparing each range with the one before it. Once sorted, the only question
 * left is what to do when two overlap.
 */

export const intervals = [
  {
    id: "insert-interval",
    title: "Insert Interval",
    difficulty: "Medium",
    summary:
      "Slot a new range into a sorted, non-overlapping list. Three phases: everything finishing before it, everything it touches (merged into one), and everything after.",
    solution: `// Insert Interval
// Three phases: before, overlapping (merged), after.

function insert(intervals, newInterval) {
  const answer = [];
  let start = newInterval[0];
  let end = newInterval[1];
  let i = 0;

  // Everything that ends before the new one begins.
  while (i < intervals.length && intervals[i][1] < start) {
    answer.push(intervals[i]);
    i++;
  }

  // Everything that touches it gets absorbed.
  while (i < intervals.length && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }

  answer.push([start, end]);

  // Everything left starts after it ends.
  while (i < intervals.length) {
    answer.push(intervals[i]);
    i++;
  }

  return answer;
}

console.log(insert([[1, 3], [6, 9]], [2, 5]));
`,
    expectedOutput: "[[1, 5], [6, 9]]",
  },

  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    summary:
      "Squash a list of overlapping ranges into as few as possible. Sort by start, then either extend the last range or begin a new one.",
    solution: `// Merge Intervals
// Sorted by start, each range either extends the last or starts a new one.

function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const answer = [];

  for (const [start, end] of sorted) {
    const last = answer[answer.length - 1];

    if (last !== undefined && start <= last[1]) {
      // Overlaps: stretch the previous range instead of adding one.
      last[1] = Math.max(last[1], end);
    } else {
      answer.push([start, end]);
    }
  }

  return answer;
}

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
`,
    expectedOutput: "[[1, 6], [8, 10], [15, 18]]",
  },

  {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    summary:
      "Remove as few ranges as possible so none overlap. When two clash, drop the one finishing later — it blocks more of what follows.",
    solution: `// Non-overlapping Intervals
// On a clash, drop whichever ends later: it gets in the way of more.

function eraseOverlapIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let removed = 0;
  let previousEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];

    if (start >= previousEnd) {
      previousEnd = end; // no clash
    } else {
      removed++;
      previousEnd = Math.min(previousEnd, end); // keep the earlier finisher
    }
  }

  return removed;
}

console.log(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]));
`,
    expectedOutput: "1",
  },

  {
    id: "meeting-rooms",
    title: "Meeting Rooms",
    difficulty: "Easy",
    summary:
      "Can one person attend every meeting? Sort by start time; if any meeting begins before the previous one ends, they clash.",
    solution: `// Meeting Rooms
// Sorted by start: any meeting beginning before the last one ends is a clash.

function canAttendMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < sorted[i - 1][1]) {
      return false;
    }
  }

  return true;
}

console.log(canAttendMeetings([[0, 30], [5, 10], [15, 20]]));
`,
    expectedOutput: "false",
  },

  {
    id: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    summary:
      "How many rooms are needed at once? Separate the starts from the ends, sort both, and sweep — a start opens a room, an end frees one.",
    solution: `// Meeting Rooms II
// Sweep the starts and ends separately: a start opens a room, an end frees one.

function minMeetingRooms(intervals) {
  const starts = intervals.map((interval) => interval[0]).sort((a, b) => a - b);
  const ends = intervals.map((interval) => interval[1]).sort((a, b) => a - b);

  let rooms = 0;
  let most = 0;
  let startIndex = 0;
  let endIndex = 0;

  while (startIndex < starts.length) {
    if (starts[startIndex] < ends[endIndex]) {
      rooms++;
      startIndex++;
      most = Math.max(most, rooms);
    } else {
      rooms--;
      endIndex++;
    }
  }

  return most;
}

console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]]));
`,
    expectedOutput: "2",
  },

  {
    id: "minimum-interval-to-include-each-query",
    title: "Minimum Interval to Include Each Query",
    difficulty: "Hard",
    summary:
      "For each query, the shortest range covering it. Sort the queries too, then sweep — bringing in ranges as they become relevant and discarding ones that have expired.",
    solution: `// Minimum Interval to Include Each Query
// Sort both, then sweep, keeping only the ranges that are still live.

function minInterval(intervals, queries) {
  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);

  // Remember where each query was, so answers go back in the right order.
  const sortedQueries = queries
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value);

  const answer = new Array(queries.length).fill(-1);
  let live = []; // intervals that have started
  let i = 0;

  for (const query of sortedQueries) {
    // Bring in every interval that has begun by now.
    while (i < sortedIntervals.length && sortedIntervals[i][0] <= query.value) {
      live.push(sortedIntervals[i]);
      i++;
    }

    // Drop the ones that have already finished.
    live = live.filter((interval) => interval[1] >= query.value);

    let shortest = -1;
    for (const [start, end] of live) {
      const length = end - start + 1;
      if (shortest === -1 || length < shortest) {
        shortest = length;
      }
    }

    answer[query.index] = shortest;
  }

  return answer;
}

console.log(minInterval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]));
`,
    expectedOutput: "[3, 3, 1, 4]",
  },
];
