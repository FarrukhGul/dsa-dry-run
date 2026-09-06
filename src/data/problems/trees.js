/**
 * trees.js — recursion's natural home.
 *
 * Almost every one of these is the same shape: do something with the node, and
 * trust the recursion for the two halves below it. Stepping through with the
 * call stack panel open is the fastest way to believe that actually works.
 *
 * Each solution builds its tree from a level-order array — the same notation
 * LeetCode uses, where null means "no child here".
 */

export const trees = [
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    summary:
      "Mirror a tree left to right. Swap a node's two children, then do the same to each of them.",
    solution: `// Invert Binary Tree
// Swap the children, then invert each side.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;

  while (i < values.length) {
    const node = queue.shift();

    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;

    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

function toLevelOrder(root) {
  if (root === null) return [];

  const values = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    values.push(node.value);

    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }

  return values;
}

function invertTree(root) {
  if (root === null) {
    return null;
  }

  const left = root.left;
  root.left = root.right;
  root.right = left;

  invertTree(root.left);
  invertTree(root.right);

  return root;
}

console.log(toLevelOrder(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))));
`,
    expectedOutput: "[4, 7, 2, 9, 6, 3, 1]",
  },

  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    summary:
      "How many levels deep does the tree go? A node's depth is one more than the deeper of its two children.",
    solution: `// Maximum Depth of Binary Tree
// Depth of a node = 1 + the deeper of its two children.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function maxDepth(root) {
  if (root === null) {
    return 0;
  }

  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

console.log(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])));
`,
    expectedOutput: "3",
  },

  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    summary:
      "The longest path between any two nodes, which need not pass through the root. Measure depth as usual, and at each node ask what a path bending through it would be worth.",
    solution: `// Diameter of Binary Tree
// While measuring depth, check the path that bends at each node.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function diameterOfBinaryTree(root) {
  let best = 0;

  function depth(node) {
    if (node === null) {
      return 0;
    }

    const left = depth(node.left);
    const right = depth(node.right);

    // A path bending here is left + right edges long.
    best = Math.max(best, left + right);

    return 1 + Math.max(left, right);
  }

  depth(root);
  return best;
}

console.log(diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])));
`,
    expectedOutput: "3",
  },

  {
    id: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    summary:
      "Is every node's two subtrees within one level of each other? Return the depth as you go, and use -1 to mean 'already unbalanced below here'.",
    solution: `// Balanced Binary Tree
// Return depth normally, or -1 to signal "unbalanced" up the stack.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function isBalanced(root) {
  function depth(node) {
    if (node === null) {
      return 0;
    }

    const left = depth(node.left);
    if (left === -1) return -1;

    const right = depth(node.right);
    if (right === -1) return -1;

    if (Math.abs(left - right) > 1) {
      return -1;
    }

    return 1 + Math.max(left, right);
  }

  return depth(root) !== -1;
}

console.log(isBalanced(buildTree([3, 9, 20, null, null, 15, 7])));
`,
    expectedOutput: "true",
  },

  {
    id: "same-tree",
    title: "Same Tree",
    difficulty: "Easy",
    summary:
      "Are two trees identical in both shape and values? Compare the roots, then ask the same question of the left pair and the right pair.",
    solution: `// Same Tree
// Same value here, and the same answer for both pairs of children.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function isSameTree(a, b) {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null || a.value !== b.value) {
    return false;
  }

  return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}

console.log(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3])));
`,
    expectedOutput: "true",
  },

  {
    id: "subtree-of-another-tree",
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    summary:
      "Does the big tree contain the small one exactly? At every node, ask whether the trees match from there — which is Same Tree, used as a helper.",
    solution: `// Subtree of Another Tree
// At each node, ask "are these identical from here down?"

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function isSameTree(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null || a.value !== b.value) return false;
  return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}

function isSubtree(root, target) {
  if (target === null) return true;
  if (root === null) return false;

  if (isSameTree(root, target)) {
    return true;
  }

  return isSubtree(root.left, target) || isSubtree(root.right, target);
}

console.log(isSubtree(buildTree([3, 4, 5, 1, 2]), buildTree([4, 1, 2])));
`,
    expectedOutput: "true",
  },

  {
    id: "lowest-common-ancestor-bst",
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Medium",
    summary:
      "Find the deepest node that has both targets below it. In a search tree you never need to explore: if both targets are smaller go left, if both bigger go right, otherwise you are standing on the answer.",
    solution: `// Lowest Common Ancestor of a Binary Search Tree
// The moment the two targets fall on opposite sides, you are on the answer.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function lowestCommonAncestor(root, p, q) {
  let node = root;

  while (node !== null) {
    if (p > node.value && q > node.value) {
      node = node.right;
    } else if (p < node.value && q < node.value) {
      node = node.left;
    } else {
      return node.value;
    }
  }

  return null;
}

const tree = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
console.log(lowestCommonAncestor(tree, 2, 8));
`,
    expectedOutput: "6",
  },

  {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    summary:
      "Read the tree one row at a time. Keep a queue, and each round take out exactly as many nodes as it currently holds — that is one whole level.",
    solution: `// Binary Tree Level Order Traversal
// Each round, empty the queue of exactly the nodes on this level.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function levelOrder(root) {
  if (root === null) {
    return [];
  }

  const levels = [];
  const queue = [root];

  while (queue.length > 0) {
    // However many are queued now is exactly this level.
    const count = queue.length;
    const level = [];

    for (let i = 0; i < count; i++) {
      const node = queue.shift();
      level.push(node.value);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    levels.push(level);
  }

  return levels;
}

console.log(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])));
`,
    expectedOutput: "[[3], [9, 20], [15, 7]]",
  },

  {
    id: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    summary:
      "What would you see standing to the right of the tree? Walk it level by level and keep only the last node of each row.",
    solution: `// Binary Tree Right Side View
// Level order, keeping only the last node on each level.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function rightSideView(root) {
  if (root === null) return [];

  const visible = [];
  const queue = [root];

  while (queue.length > 0) {
    const count = queue.length;

    for (let i = 0; i < count; i++) {
      const node = queue.shift();

      // The last one taken off this level is the one you can see.
      if (i === count - 1) {
        visible.push(node.value);
      }

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }

  return visible;
}

console.log(rightSideView(buildTree([1, 2, 3, null, 5, null, 4])));
`,
    expectedOutput: "[1, 3, 4]",
  },

  {
    id: "count-good-nodes-in-binary-tree",
    title: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    summary:
      "A node is good if nothing on the path down from the root is bigger than it. Carry the largest value seen so far as you descend.",
    solution: `// Count Good Nodes in Binary Tree
// Carry the biggest value seen on the way down.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function goodNodes(root) {
  function count(node, biggestSoFar) {
    if (node === null) {
      return 0;
    }

    const isGood = node.value >= biggestSoFar ? 1 : 0;
    const nextBiggest = Math.max(biggestSoFar, node.value);

    return isGood + count(node.left, nextBiggest) + count(node.right, nextBiggest);
  }

  return count(root, -Infinity);
}

console.log(goodNodes(buildTree([3, 1, 4, 3, null, 1, 5])));
`,
    expectedOutput: "4",
  },

  {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    summary:
      "Check the search-tree rule really holds. Comparing each node with its own children is not enough — every node must fit inside a range set by all its ancestors.",
    solution: `// Validate Binary Search Tree
// Each node must fit a range narrowed by every ancestor above it.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function isValidBST(root) {
  function check(node, low, high) {
    if (node === null) {
      return true;
    }

    if (node.value <= low || node.value >= high) {
      return false;
    }

    // Going left tightens the upper bound; going right tightens the lower.
    return check(node.left, low, node.value) && check(node.right, node.value, high);
  }

  return check(root, -Infinity, Infinity);
}

console.log(isValidBST(buildTree([2, 1, 3])));
`,
    expectedOutput: "true",
  },

  {
    id: "kth-smallest-element-in-a-bst",
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    summary:
      "Find the kth smallest value. Walking a search tree left, node, right visits the values in sorted order — so just count them off.",
    solution: `// Kth Smallest Element in a BST
// In-order traversal visits a BST in sorted order.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function kthSmallest(root, k) {
  const pending = [];
  let node = root;
  let seen = 0;

  while (node !== null || pending.length > 0) {
    // Go as far left as possible, remembering the way back.
    while (node !== null) {
      pending.push(node);
      node = node.left;
    }

    node = pending.pop();
    seen++;

    if (seen === k) {
      return node.value;
    }

    node = node.right;
  }

  return -1;
}

console.log(kthSmallest(buildTree([3, 1, 4, null, 2]), 1));
`,
    expectedOutput: "1",
  },

  {
    id: "construct-binary-tree-from-preorder-and-inorder",
    title: "Construct Tree from Preorder and Inorder",
    difficulty: "Medium",
    summary:
      "Rebuild a tree from two of its traversals. Preorder names the root; finding that root in the inorder list splits it neatly into the left and right subtrees.",
    solution: `// Construct Binary Tree from Preorder and Inorder Traversal
// Preorder gives the root; inorder says where it splits the rest.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function toLevelOrder(root) {
  if (root === null) return [];
  const values = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    values.push(node.value);
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return values;
}

function buildTree(preorder, inorder) {
  if (preorder.length === 0) {
    return null;
  }

  const rootValue = preorder[0];
  const root = new TreeNode(rootValue);

  // Everything before the root in inorder is its left subtree.
  const split = inorder.indexOf(rootValue);

  root.left = buildTree(preorder.slice(1, split + 1), inorder.slice(0, split));
  root.right = buildTree(preorder.slice(split + 1), inorder.slice(split + 1));

  return root;
}

console.log(toLevelOrder(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])));
`,
    expectedOutput: "[3, 9, 20, 15, 7]",
  },

  {
    id: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    summary:
      "The best-scoring path anywhere in the tree, which may bend at a node and need not touch the root. Each call returns the best straight run downwards, while recording the best bent path seen.",
    solution: `// Binary Tree Maximum Path Sum
// Return the best straight path down; record the best bent path separately.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    if (values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function maxPathSum(root) {
  let best = -Infinity;

  function bestDownwards(node) {
    if (node === null) {
      return 0;
    }

    // A negative branch is worth nothing — better to take none of it.
    const left = Math.max(bestDownwards(node.left), 0);
    const right = Math.max(bestDownwards(node.right), 0);

    // A path bending here uses both sides.
    best = Math.max(best, node.value + left + right);

    // But a path continuing upwards can only use one.
    return node.value + Math.max(left, right);
  }

  bestDownwards(root);
  return best;
}

console.log(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])));
`,
    expectedOutput: "42",
  },

  {
    id: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    summary:
      "Flatten a tree to a string and rebuild it exactly. Preorder works if you also write down the empty spots — those markers are what make the rebuild unambiguous.",
    solution: `// Serialize and Deserialize Binary Tree
// Preorder, writing a marker for every empty child.

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function toLevelOrder(root) {
  if (root === null) return [];
  const values = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    values.push(node.value);
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return values;
}

function serialize(root) {
  const parts = [];

  function visit(node) {
    if (node === null) {
      parts.push("#");
      return;
    }

    parts.push(String(node.value));
    visit(node.left);
    visit(node.right);
  }

  visit(root);
  return parts.join(",");
}

function deserialize(text) {
  const parts = text.split(",");
  let index = 0;

  function build() {
    const part = parts[index];
    index++;

    if (part === "#") {
      return null;
    }

    const node = new TreeNode(Number(part));
    node.left = build();
    node.right = build();

    return node;
  }

  return build();
}

const original = new TreeNode(1);
original.left = new TreeNode(2);
original.right = new TreeNode(3);
original.right.left = new TreeNode(4);
original.right.right = new TreeNode(5);

console.log(toLevelOrder(deserialize(serialize(original))));
`,
    expectedOutput: "[1, 2, 3, 4, 5]",
  },
];
