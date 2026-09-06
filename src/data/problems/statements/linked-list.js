/**
 * statements/linked-list.js — the questions for the linked list pattern.
 *
 * The starters keep the ListNode class and the buildList / toArray helpers.
 * Writing boilerplate is not the exercise; the pointer surgery is.
 */

export const linkedListStatements = {
  "reverse-linked-list": {
    description:
      "Turn a singly linked list back to front and return the new head. Every arrow must end up pointing the other way, and you should do it without building a second list.",
    examples: [
      {
        input: "list = 1 → 2 → 3 → 4 → 5",
        output: "[5, 4, 3, 2, 1]",
        explanation: "Every link now points at what used to come before it.",
      },
      { input: "list = (empty)", output: "[]", explanation: "Nothing to reverse." },
    ],
    constraints: ["0 ≤ length ≤ 5,000"],
    starter: `// Reverse Linked List
// Return the head of the reversed list.

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
  // Your code here.
}

console.log(toArray(reverseList(buildList([1, 2, 3, 4, 5]))));
`,
  },

  "merge-two-sorted-lists": {
    description:
      "Two sorted linked lists are given. Weave them into one sorted list by relinking the existing nodes, and return its head.",
    examples: [
      {
        input: "a = 1 → 2 → 4, b = 1 → 3 → 4",
        output: "[1, 1, 2, 3, 4, 4]",
        explanation: "Taking the smaller head each time produces one sorted list.",
      },
    ],
    constraints: ["0 ≤ each length ≤ 50", "Both lists are already sorted."],
    starter: `// Merge Two Sorted Lists
// Weave two sorted lists into one and return its head.

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
  // Your code here.
}

console.log(toArray(mergeTwoLists(buildList([1, 2, 4]), buildList([1, 3, 4]))));
`,
  },

  "linked-list-cycle": {
    description:
      "Decide whether a linked list loops back on itself. You should use only a constant amount of extra memory, which rules out remembering every node you have visited.",
    examples: [
      {
        input: "3 → 2 → 0 → -4, where -4 points back at 2",
        output: "true",
        explanation: "Following the links goes round forever.",
      },
      { input: "1 → 2, ending at null", output: "false", explanation: "It ends." },
    ],
    constraints: ["0 ≤ length ≤ 10,000", "Constant extra memory."],
    starter: `// Linked List Cycle
// Return true if the list loops. Constant extra memory.

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function hasCycle(head) {
  // Your code here.
}

const head = new ListNode(3);
head.next = new ListNode(2);
head.next.next = new ListNode(0);
head.next.next.next = new ListNode(-4);
head.next.next.next.next = head.next;

console.log(hasCycle(head));
`,
  },

  "reorder-list": {
    description:
      "Rearrange a list so it reads first, last, second, second-last, and so on. Relink the existing nodes rather than copying their values around.",
    examples: [
      {
        input: "list = 1 → 2 → 3 → 4",
        output: "[1, 4, 2, 3]",
        explanation: "First, then last, then second, then second-last.",
      },
    ],
    constraints: ["1 ≤ length ≤ 50,000", "Relink nodes; do not move values."],
    starter: `// Reorder List
// Rearrange to first, last, second, second-last, ...

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
  // Your code here.
}

console.log(toArray(reorderList(buildList([1, 2, 3, 4]))));
`,
  },

  "remove-nth-node-from-end": {
    description:
      "Remove the nth node counting from the end of the list and return the head. Try to do it in a single pass rather than measuring the length first.",
    examples: [
      {
        input: "list = 1 → 2 → 3 → 4 → 5, n = 2",
        output: "[1, 2, 3, 5]",
        explanation: "The second from the end is 4.",
      },
      { input: "list = 1, n = 1", output: "[]", explanation: "The only node goes." },
    ],
    constraints: ["1 ≤ length ≤ 30", "1 ≤ n ≤ length"],
    starter: `// Remove Nth Node From End of List
// Remove the nth node from the end. One pass if you can.

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
  // Your code here.
}

console.log(toArray(removeNthFromEnd(buildList([1, 2, 3, 4, 5]), 2)));
`,
  },

  "copy-list-with-random-pointer": {
    description:
      "Each node has a next pointer and a random one that may point at any node in the list, or at nothing. Build a completely independent copy: same values, same shape, but no node shared with the original.",
    examples: [
      {
        input: "7 → 13, where 13's random points at 7",
        output: "[7, 13, 7]",
        explanation:
          "The copy's second node has a random pointer to the copy's first — not to the original's.",
      },
    ],
    constraints: ["0 ≤ length ≤ 1,000", "random may be null."],
    starter: `// Copy List with Random Pointer
// Build a deep copy: no node may be shared with the original.

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.random = null;
  }
}

function copyRandomList(head) {
  // Your code here.
}

const first = new Node(7);
const second = new Node(13);
first.next = second;
second.random = first;

const copied = copyRandomList(first);
console.log([copied.value, copied.next.value, copied.next.random.value]);
`,
  },

  "add-two-numbers": {
    description:
      "Two numbers are stored as linked lists with one digit per node, least significant digit first. Add them and return the sum in the same backwards form.",
    examples: [
      {
        input: "a = 2 → 4 → 3, b = 5 → 6 → 4",
        output: "[7, 0, 8]",
        explanation: "That is 342 + 465 = 807, written backwards.",
      },
    ],
    constraints: ["1 ≤ each length ≤ 100", "No leading zeros, except 0 itself."],
    starter: `// Add Two Numbers
// Digits are stored backwards, one per node. Return their sum the same way.

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
  // Your code here.
}

console.log(toArray(addTwoNumbers(buildList([2, 4, 3]), buildList([5, 6, 4]))));
`,
  },

  "find-the-duplicate-number": {
    description:
      "An array holds n + 1 numbers, each between 1 and n, so at least one value must repeat. Find the repeated one without modifying the array and using only constant extra memory.",
    examples: [
      {
        input: "nums = [1, 3, 4, 2, 2]",
        output: "2",
        explanation: "2 appears twice.",
      },
      { input: "nums = [3, 1, 3, 4, 2]", output: "3", explanation: "3 appears twice." },
    ],
    constraints: [
      "Values are between 1 and n; the array holds n + 1 of them.",
      "Do not modify the array; constant extra memory.",
    ],
    starter: `// Find the Duplicate Number
// Find the repeated value. No modifying the array, constant extra memory.

function findDuplicate(nums) {
  // Your code here.
}

console.log(findDuplicate([1, 3, 4, 2, 2]));
`,
  },

  "lru-cache": {
    description:
      "Build a cache of fixed capacity. Reading or writing a key makes it the most recently used; when the cache is full, the least recently used entry is evicted. Both operations should be constant time.",
    examples: [
      {
        input: "capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2)",
        output: "1, then -1",
        explanation:
          "get(1) makes 1 recent, so adding 3 evicts 2 — and get(2) returns -1.",
      },
    ],
    constraints: ["1 ≤ capacity ≤ 3,000", "Both operations constant time."],
    starter: `// LRU Cache
// Fixed capacity. Evict the least recently used. Constant time.

class LRUCache {
  constructor(capacity) {
    // Your code here.
  }

  get(key) {
    // Your code here.
  }

  put(key, value) {
    // Your code here.
  }
}

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));
cache.put(3, 3);
console.log(cache.get(2));
`,
  },

  "merge-k-sorted-lists": {
    description:
      "Merge an array of sorted linked lists into one sorted list. Folding them in one at a time works but is slow; there is a much better order to do the merging in.",
    examples: [
      {
        input: "lists = [1→4→5, 1→3→4, 2→6]",
        output: "[1, 1, 2, 3, 4, 4, 5, 6]",
        explanation: "All eight values, in order.",
      },
    ],
    constraints: ["0 ≤ lists.length ≤ 10,000", "Each list is already sorted."],
    starter: `// Merge k Sorted Lists
// Merge every sorted list into one and return its head.

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

function mergeKLists(lists) {
  // Your code here.
}

const lists = [buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])];
console.log(toArray(mergeKLists(lists)));
`,
  },

  "reverse-nodes-in-k-group": {
    description:
      "Reverse the list in consecutive blocks of k nodes. If fewer than k nodes remain at the end, leave them exactly as they are. Relink the nodes rather than moving values.",
    examples: [
      {
        input: "list = 1 → 2 → 3 → 4 → 5, k = 2",
        output: "[2, 1, 4, 3, 5]",
        explanation: "Two full pairs are reversed; the lone 5 is left alone.",
      },
    ],
    constraints: ["1 ≤ k ≤ length ≤ 5,000", "Relink nodes; do not move values."],
    starter: `// Reverse Nodes in k-Group
// Reverse in blocks of k. Leave a short final block untouched.

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
  // Your code here.
}

console.log(toArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2)));
`,
  },
};
