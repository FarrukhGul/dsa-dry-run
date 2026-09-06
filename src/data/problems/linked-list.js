/**
 * linked-list.js — pointer surgery.
 *
 * These are the best problems on the whole site to step through, because the
 * visualiser draws the chain as boxes and arrows. Reversing a list stops being
 * a puzzle about three variables the moment you can watch the arrows flip.
 *
 * Each solution builds its own list from an array and prints the result as one,
 * so it is self-contained and does something when you press Run.
 */

export const linkedList = [
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    summary:
      "Turn every arrow around. Three variables do it: the node behind, the node you are on, and a grip on the one ahead so you do not lose the rest of the list.",
    solution: `// Reverse Linked List
// Walk forward, pointing each node back at the one before it.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;

  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }

  return head;
}

function toArray(head) {
  const values = [];
  let node = head;

  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }

  return values;
}

function reverseList(head) {
  let previous = null;
  let current = head;

  while (current !== null) {
    // Keep hold of the rest of the list before we overwrite next.
    const ahead = current.next;

    current.next = previous;
    previous = current;
    current = ahead;
  }

  return previous;
}

console.log(toArray(reverseList(buildList([1, 2, 3, 4, 5]))));
`,
    expectedOutput: "[5, 4, 3, 2, 1]",
  },

  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    summary:
      "Weave two sorted lists into one. A throwaway node in front saves you from writing a special case for the very first link.",
    solution: `// Merge Two Sorted Lists
// A dummy head means no special case for the first node.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;
  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }
  return head;
}

function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }

  // Whichever list still has nodes just gets attached whole.
  tail.next = a !== null ? a : b;

  return dummy.next;
}

console.log(toArray(mergeTwoLists(buildList([1, 2, 4]), buildList([1, 3, 4]))));
`,
    expectedOutput: "[1, 1, 2, 3, 4, 4]",
  },

  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    summary:
      "Does the list loop back on itself? Send one pointer at one step and another at two — if there is a loop, the fast one laps the slow one.",
    solution: `// Linked List Cycle
// Slow moves one, fast moves two. In a loop, fast catches slow.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}

// Build 3 -> 2 -> 0 -> -4, then point the last node back at the second.
const head = new ListNode(3);
head.next = new ListNode(2);
head.next.next = new ListNode(0);
head.next.next.next = new ListNode(-4);
head.next.next.next.next = head.next;

console.log(hasCycle(head));
`,
    expectedOutput: "true",
  },

  {
    id: "reorder-list",
    title: "Reorder List",
    difficulty: "Medium",
    summary:
      "Fold the list so it reads first, last, second, second-last. Three steps: find the middle, reverse the back half, then zip the two halves together.",
    solution: `// Reorder List
// Split in the middle, reverse the back half, then interleave.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;
  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }
  return head;
}

function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

function reorderList(head) {
  // 1. Find the middle with slow and fast pointers.
  let slow = head;
  let fast = head.next;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. Reverse everything after the middle.
  let second = slow.next;
  slow.next = null;
  let previous = null;

  while (second !== null) {
    const ahead = second.next;
    second.next = previous;
    previous = second;
    second = ahead;
  }

  // 3. Weave the two halves together.
  let first = head;
  second = previous;

  while (second !== null) {
    const afterFirst = first.next;
    const afterSecond = second.next;

    first.next = second;
    second.next = afterFirst;

    first = afterFirst;
    second = afterSecond;
  }

  return head;
}

console.log(toArray(reorderList(buildList([1, 2, 3, 4]))));
`,
    expectedOutput: "[1, 4, 2, 3]",
  },

  {
    id: "remove-nth-node-from-end",
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    summary:
      "Delete the nth node counting backwards, in one pass. Start one pointer n steps ahead; when it reaches the end, the other is exactly where you need it.",
    solution: `// Remove Nth Node From End of List
// Give one pointer an n-step head start, then move both together.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;
  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }
  return head;
}

function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;

  let behind = dummy;
  let ahead = dummy;

  // Move ahead n+1 steps, so behind lands just before the target.
  for (let i = 0; i <= n; i++) {
    ahead = ahead.next;
  }

  while (ahead !== null) {
    behind = behind.next;
    ahead = ahead.next;
  }

  behind.next = behind.next.next;

  return dummy.next;
}

console.log(toArray(removeNthFromEnd(buildList([1, 2, 3, 4, 5]), 2)));
`,
    expectedOutput: "[1, 2, 3, 5]",
  },

  {
    id: "copy-list-with-random-pointer",
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    summary:
      "Deep-copy a list whose nodes also point at arbitrary other nodes. Two passes: make every copy first, then wire the pointers using a map from old node to new.",
    solution: `// Copy List with Random Pointer
// Pass one makes the nodes; pass two wires them up.

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.random = null;
  }
}

function copyRandomList(head) {
  const copies = new Map();

  // Pass one: a copy of every node, with no links yet.
  let node = head;
  while (node !== null) {
    copies.set(node, new Node(node.value));
    node = node.next;
  }

  // Pass two: now every copy exists, the links can be filled in.
  node = head;
  while (node !== null) {
    const copy = copies.get(node);
    copy.next = copies.get(node.next) ?? null;
    copy.random = copies.get(node.random) ?? null;
    node = node.next;
  }

  return copies.get(head) ?? null;
}

const first = new Node(7);
const second = new Node(13);
first.next = second;
second.random = first;

const copied = copyRandomList(first);
console.log([copied.value, copied.next.value, copied.next.random.value]);
`,
    expectedOutput: "[7, 13, 7]",
  },

  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium",
    summary:
      "Two numbers stored backwards as lists, one digit per node. Add them the way you would on paper, carrying as you go — and the backwards order is what makes that Easy.",
    solution: `// Add Two Numbers
// Column addition, with the digits conveniently already reversed.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;
  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }
  return head;
}

function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

function addTwoNumbers(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;

  while (a !== null || b !== null || carry > 0) {
    const total = (a?.value ?? 0) + (b?.value ?? 0) + carry;

    carry = Math.floor(total / 10);
    tail.next = new ListNode(total % 10);
    tail = tail.next;

    a = a?.next ?? null;
    b = b?.next ?? null;
  }

  return dummy.next;
}

console.log(toArray(addTwoNumbers(buildList([2, 4, 3]), buildList([5, 6, 4]))));
`,
    expectedOutput: "[7, 0, 8]",
  },

  {
    id: "find-the-duplicate-number",
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    summary:
      "One value repeats in an array of n+1 numbers from 1 to n. Treat each value as a pointer to another index and the array becomes a linked list with a cycle — the duplicate is where it starts.",
    solution: `// Find the Duplicate Number
// Treat values as pointers: the repeated one is the cycle's entrance.

function findDuplicate(nums) {
  let slow = 0;
  let fast = 0;

  // Phase one: find somewhere inside the cycle.
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // Phase two: a second walker from the start meets it at the entrance.
  let walker = 0;
  while (walker !== slow) {
    walker = nums[walker];
    slow = nums[slow];
  }

  return walker;
}

console.log(findDuplicate([1, 3, 4, 2, 2]));
`,
    expectedOutput: "2",
  },

  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    summary:
      "A fixed-size cache that throws away whatever was used longest ago. JavaScript's Map remembers insertion order, so re-inserting a key on every read keeps the order honest for you.",
    solution: `// LRU Cache
// A Map keeps insertion order, so its first key is the least recent.

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.entries = new Map();
  }

  get(key) {
    if (!this.entries.has(key)) {
      return -1;
    }

    // Re-insert, which moves it to the newest position.
    const value = this.entries.get(key);
    this.entries.delete(key);
    this.entries.set(key, value);

    return value;
  }

  put(key, value) {
    if (this.entries.has(key)) {
      this.entries.delete(key);
    }

    this.entries.set(key, value);

    if (this.entries.size > this.capacity) {
      const oldest = this.entries.keys().next().value;
      this.entries.delete(oldest);
    }
  }
}

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));
cache.put(3, 3);
console.log(cache.get(2));
`,
    expectedOutput: "1\n-1",
  },

  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    summary:
      "Merge many sorted lists into one. Merging them in pairs, halving the pile each round, is far quicker than folding them in one at a time.",
    solution: `// Merge k Sorted Lists
// Merge in pairs, halving the number of lists each round.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;
  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }
  return head;
}

function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

function mergeTwo(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }

  tail.next = a !== null ? a : b;
  return dummy.next;
}

function mergeKLists(lists) {
  if (lists.length === 0) {
    return null;
  }

  let remaining = lists;

  while (remaining.length > 1) {
    const merged = [];

    for (let i = 0; i < remaining.length; i += 2) {
      merged.push(mergeTwo(remaining[i], remaining[i + 1] ?? null));
    }

    remaining = merged;
  }

  return remaining[0];
}

const lists = [buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])];
console.log(toArray(mergeKLists(lists)));
`,
    expectedOutput: "[1, 1, 2, 3, 4, 4, 5, 6]",
  },

  {
    id: "reverse-nodes-in-k-group",
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    summary:
      "Reverse the list in blocks of k, leaving any short block at the end alone. Check there are k nodes left before touching anything, then reverse exactly that many.",
    solution: `// Reverse Nodes in k-Group
// Only reverse a block once you know it is a full one.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function buildList(values) {
  const head = new ListNode(values[0]);
  let tail = head;
  for (let i = 1; i < values.length; i++) {
    tail.next = new ListNode(values[i]);
    tail = tail.next;
  }
  return head;
}

function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

function reverseKGroup(head, k) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let groupBefore = dummy;

  while (true) {
    // Is there a full group of k left?
    let check = groupBefore;
    for (let i = 0; i < k && check !== null; i++) {
      check = check.next;
    }
    if (check === null) {
      break;
    }

    // Reverse exactly k nodes.
    let previous = check.next;
    let current = groupBefore.next;
    const groupStart = current;

    for (let i = 0; i < k; i++) {
      const ahead = current.next;
      current.next = previous;
      previous = current;
      current = ahead;
    }

    groupBefore.next = previous;
    groupBefore = groupStart;
  }

  return dummy.next;
}

console.log(toArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2)));
`,
    expectedOutput: "[2, 1, 4, 3, 5]",
  },
];
