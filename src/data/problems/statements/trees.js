/**
 * statements/trees.js — the questions for the tree pattern.
 *
 * Every starter keeps the TreeNode class and the buildTree / toLevelOrder
 * helpers. Writing boilerplate is not the exercise; the recursion is.
 */

export const treesStatements = {
  "invert-binary-tree": {
    description:
      "Swap every node's two children, all the way down, and return the root. The result is a mirror image of the tree you were given.",
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4, 7, 2, 9, 6, 3, 1]",
        explanation: "Every left and right pair has traded places.",
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "An empty tree mirrors to an empty tree.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 100"],
    starter: `class TreeNode {
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
  // Your code here.
}

console.log(toLevelOrder(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))));
`,
  },

  "maximum-depth-of-binary-tree": {
    description:
      "Return how many levels deep the tree goes, counting the root as level one. An empty tree has depth zero.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: "Root, then 9 and 20, then 15 and 7.",
      },
      {
        input: "root = [1,null,2]",
        output: "2",
        explanation: "A single chain two levels long.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 10,000"],
    starter: `class TreeNode {
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

function maxDepth(root) {
  // Your code here.
}

console.log(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])));
`,
  },

  "diameter-of-binary-tree": {
    description:
      "Return the number of edges on the longest path between any two nodes. That path does not have to pass through the root, which is what makes it more than a depth calculation.",
    examples: [
      {
        input: "root = [1,2,3,4,5]",
        output: "3",
        explanation: "The path 4 to 2 to 1 to 3 uses three edges.",
      },
      {
        input: "root = [1,2]",
        output: "1",
        explanation: "One edge between the only two nodes.",
      },
    ],
    constraints: ["1 \u2264 nodes \u2264 10,000"],
    starter: `class TreeNode {
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

function diameterOfBinaryTree(root) {
  // Your code here.
}

console.log(diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])));
`,
  },

  "balanced-binary-tree": {
    description:
      "A tree is balanced when, at every single node, the depths of its two subtrees differ by no more than one. Decide whether the given tree qualifies.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "true",
        explanation: "No node has subtrees more than one level apart.",
      },
      {
        input: "root = [1,2,2,3,3,null,null,4,4]",
        output: "false",
        explanation: "The left side runs far deeper than the right.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 5,000"],
    starter: `class TreeNode {
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

function isBalanced(root) {
  // Your code here.
}

console.log(isBalanced(buildTree([3, 9, 20, null, null, 15, 7])));
`,
  },

  "same-tree": {
    description:
      "Given two trees, decide whether they are identical: the same shape and the same value at every matching position.",
    examples: [
      {
        input: "a = [1,2,3], b = [1,2,3]",
        output: "true",
        explanation: "Same shape, same values.",
      },
      {
        input: "a = [1,2], b = [1,null,2]",
        output: "false",
        explanation: "Same values, but 2 is on opposite sides.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 100"],
    starter: `class TreeNode {
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

function isSameTree(a, b) {
  // Your code here.
}

console.log(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3])));
`,
  },

  "subtree-of-another-tree": {
    description:
      "Decide whether the second tree appears inside the first as a complete subtree \u2014 meaning some node of the first, together with all of its descendants, is identical to it.",
    examples: [
      {
        input: "root = [3,4,5,1,2], target = [4,1,2]",
        output: "true",
        explanation: "The node 4 and everything below it matches exactly.",
      },
      {
        input: "root = [3,4,5,1,2,null,null,null,null,0], target = [4,1,2]",
        output: "false",
        explanation: "That 4 now has an extra descendant.",
      },
    ],
    constraints: ["1 \u2264 nodes \u2264 2,000"],
    starter: `class TreeNode {
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

function isSubtree(root, target) {
  // Your code here.
}

console.log(isSubtree(buildTree([3, 4, 5, 1, 2]), buildTree([4, 1, 2])));
`,
  },

  "lowest-common-ancestor-bst": {
    description:
      "In a binary search tree, find the deepest node that has both given values somewhere beneath it (a node counts as its own descendant). Being a search tree means you never have to explore \u2014 the values tell you which way to go.",
    examples: [
      {
        input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
        output: "6",
        explanation: "They sit on opposite sides of the root.",
      },
      {
        input: "the same tree, p = 2, q = 4",
        output: "2",
        explanation: "4 is below 2, so 2 is the answer.",
      },
    ],
    constraints: ["2 \u2264 nodes \u2264 100,000", "All values differ and both are present."],
    starter: `class TreeNode {
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

function lowestCommonAncestor(root, p, q) {
  // Your code here.
}

const tree = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
console.log(lowestCommonAncestor(tree, 2, 8));
`,
  },

  "binary-tree-level-order-traversal": {
    description:
      "Return the values level by level, left to right, with each level as its own array.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3], [9, 20], [15, 7]]",
        explanation: "One array per level, top down.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 2,000"],
    starter: `class TreeNode {
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

function levelOrder(root) {
  // Your code here.
}

console.log(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])));
`,
  },

  "binary-tree-right-side-view": {
    description:
      "Imagine standing to the right of the tree. Return the values you would see, top to bottom \u2014 which is the rightmost node of each level.",
    examples: [
      {
        input: "root = [1,2,3,null,5,null,4]",
        output: "[1, 3, 4]",
        explanation: "Level by level, the rightmost are 1, 3 and 4.",
      },
      {
        input: "root = [1,null,3]",
        output: "[1, 3]",
        explanation: "Everything is on the right already.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 100"],
    starter: `class TreeNode {
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

function rightSideView(root) {
  // Your code here.
}

console.log(rightSideView(buildTree([1, 2, 3, null, 5, null, 4])));
`,
  },

  "count-good-nodes-in-binary-tree": {
    description:
      "A node is good when no node on the path down from the root to it holds a larger value. Count the good nodes. The root always counts.",
    examples: [
      {
        input: "root = [3,1,4,3,null,1,5]",
        output: "4",
        explanation: "The root, the 4, and both nodes holding 3 and 5 are good.",
      },
      {
        input: "root = [3,3,null,4,2]",
        output: "3",
        explanation: "The 2 has a 4 above it, so it is not good.",
      },
    ],
    constraints: ["1 \u2264 nodes \u2264 100,000"],
    starter: `class TreeNode {
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

function goodNodes(root) {
  // Your code here.
}

console.log(goodNodes(buildTree([3, 1, 4, 3, null, 1, 5])));
`,
  },

  "validate-binary-search-tree": {
    description:
      "Decide whether the tree is a valid binary search tree: everything in a node's left subtree is smaller than it, everything on the right is larger, and that holds at every node. Comparing each node only with its immediate children is not enough.",
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "1 is left of 2, 3 is right of it.",
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "3 is on 5's right but is smaller than 5.",
      },
    ],
    constraints: ["1 \u2264 nodes \u2264 10,000"],
    starter: `class TreeNode {
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

function isValidBST(root) {
  // Your code here.
}

console.log(isValidBST(buildTree([2, 1, 3])));
`,
  },

  "kth-smallest-element-in-a-bst": {
    description:
      "Return the kth smallest value in a binary search tree, counting from one. There is an order in which to visit a search tree that makes this almost free.",
    examples: [
      {
        input: "root = [3,1,4,null,2], k = 1",
        output: "1",
        explanation: "The smallest value in the tree.",
      },
      {
        input: "root = [5,3,6,2,4,null,null,1], k = 3",
        output: "3",
        explanation: "In order the values are 1,2,3,4,5,6.",
      },
    ],
    constraints: ["1 \u2264 k \u2264 nodes \u2264 10,000"],
    starter: `class TreeNode {
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

function kthSmallest(root, k) {
  // Your code here.
}

console.log(kthSmallest(buildTree([3, 1, 4, null, 2]), 1));
`,
  },

  "construct-binary-tree-from-preorder-and-inorder": {
    description:
      "Rebuild a tree from two of its traversals: preorder (node, left, right) and inorder (left, node, right). All values are distinct, which is what makes the reconstruction unambiguous.",
    examples: [
      {
        input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
        output: "[3, 9, 20, 15, 7]",
        explanation: "Preorder names 3 as the root; inorder shows 9 is left of it and 15,20,7 are right.",
      },
    ],
    constraints: ["1 \u2264 length \u2264 3,000", "All values differ."],
    starter: `class TreeNode {
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

function buildFromTraversals(preorder, inorder) {
  // Your code here.
}

console.log(toLevelOrder(buildFromTraversals([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])));
`,
  },

  "binary-tree-maximum-path-sum": {
    description:
      "A path is any sequence of connected nodes, going through each at most once. It need not touch the root. Return the largest total a path can reach \u2014 and note that values may be negative.",
    examples: [
      {
        input: "root = [1,2,3]",
        output: "6",
        explanation: "The path 2, 1, 3 totals six.",
      },
      {
        input: "root = [-10,9,20,null,null,15,7]",
        output: "42",
        explanation: "15, 20, 7 totals 42; going up to -10 would only lose value.",
      },
    ],
    constraints: ["1 \u2264 nodes \u2264 30,000", "Values may be negative."],
    starter: `class TreeNode {
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

function maxPathSum(root) {
  // Your code here.
}

console.log(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])));
`,
  },

  "serialize-and-deserialize-binary-tree": {
    description:
      "Write two functions: one turning a tree into a string, and one turning that string back into an identical tree. The format is yours to choose, but it has to survive the round trip exactly.",
    examples: [
      {
        input: "tree = [1,2,3,null,null,4,5]",
        output: "[1, 2, 3, 4, 5]",
        explanation: "Serialising then deserialising gives back the same tree.",
      },
    ],
    constraints: ["0 \u2264 nodes \u2264 10,000", "Any format, as long as it round-trips."],
    starter: `class TreeNode {
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

function serialize(root) {
  // Your code here.
}

function deserialize(text) {
  // Your code here.
}

const original = buildTree([1, 2, 3, null, null, 4, 5]);
console.log(toLevelOrder(deserialize(serialize(original))));
`,
  },

};
