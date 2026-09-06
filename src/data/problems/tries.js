/**
 * tries.js — a tree of characters.
 *
 * The whole idea: words that start the same share the same path. Once you can
 * see that in the tree view, prefix questions stop being string problems and
 * become walks down a tree.
 */

export const tries = [
  {
    id: "implement-trie",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    summary:
      "Build the structure itself. Each node holds a map of next letters and a flag saying whether a word ends here — which is what separates 'app' being stored from it merely being a prefix.",
    solution: `// Implement Trie (Prefix Tree)
// Each node: the letters that can follow, and "does a word end here?"

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;

    for (const letter of word) {
      if (!node.children.has(letter)) {
        node.children.set(letter, new TrieNode());
      }
      node = node.children.get(letter);
    }

    node.isWord = true;
  }

  // Walks the letters and returns the node reached, or null.
  walk(text) {
    let node = this.root;

    for (const letter of text) {
      if (!node.children.has(letter)) {
        return null;
      }
      node = node.children.get(letter);
    }

    return node;
  }

  search(word) {
    const node = this.walk(word);
    return node !== null && node.isWord;
  }

  startsWith(prefix) {
    return this.walk(prefix) !== null;
  }
}

const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));
console.log(trie.search("app"));
console.log(trie.startsWith("app"));
`,
    expectedOutput: "true\nfalse\ntrue",
  },

  {
    id: "design-add-and-search-words",
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    summary:
      "A trie where a full stop matches any single letter. That one wildcard forces the search to branch — at a dot, every child has to be tried.",
    solution: `// Design Add and Search Words Data Structure
// A "." means try every child, so the search becomes recursive.

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode();
  }

  addWord(word) {
    let node = this.root;

    for (const letter of word) {
      if (!node.children.has(letter)) {
        node.children.set(letter, new TrieNode());
      }
      node = node.children.get(letter);
    }

    node.isWord = true;
  }

  search(word) {
    function find(node, index) {
      if (index === word.length) {
        return node.isWord;
      }

      const letter = word[index];

      if (letter === ".") {
        // Any child could be the match — try them all.
        for (const child of node.children.values()) {
          if (find(child, index + 1)) {
            return true;
          }
        }
        return false;
      }

      if (!node.children.has(letter)) {
        return false;
      }

      return find(node.children.get(letter), index + 1);
    }

    return find(this.root, 0);
  }
}

const dictionary = new WordDictionary();
dictionary.addWord("bad");
dictionary.addWord("dad");
console.log(dictionary.search("pad"));
console.log(dictionary.search("bad"));
console.log(dictionary.search(".ad"));
console.log(dictionary.search("b.."));
`,
    expectedOutput: "false\ntrue\ntrue\ntrue",
  },

  {
    id: "word-search-ii",
    title: "Word Search II",
    difficulty: "Hard",
    summary:
      "Find every word from a list hidden in a letter grid. Searching for each word separately is far too slow — put all the words in a trie and walk the grid once, following the trie as you go.",
    solution: `// Word Search II
// Put every word in a trie, then walk the grid once, following the trie.

class TrieNode {
  constructor() {
    this.children = new Map();
    this.word = null;
  }
}

function buildTrie(words) {
  const root = new TrieNode();

  for (const word of words) {
    let node = root;

    for (const letter of word) {
      if (!node.children.has(letter)) {
        node.children.set(letter, new TrieNode());
      }
      node = node.children.get(letter);
    }

    node.word = word;
  }

  return root;
}

function findWords(board, words) {
  const root = buildTrie(words);
  const found = [];
  const rows = board.length;
  const columns = board[0].length;

  function explore(row, column, node) {
    if (row < 0 || column < 0 || row >= rows || column >= columns) {
      return;
    }

    const letter = board[row][column];
    if (letter === "#" || !node.children.has(letter)) {
      return;
    }

    const next = node.children.get(letter);

    if (next.word !== null) {
      found.push(next.word);
      // Clear it so the same word is not reported twice.
      next.word = null;
    }

    // Mark this square as used while exploring from it.
    board[row][column] = "#";

    explore(row + 1, column, next);
    explore(row - 1, column, next);
    explore(row, column + 1, next);
    explore(row, column - 1, next);

    board[row][column] = letter;
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      explore(row, column, root);
    }
  }

  return found;
}

const board = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];

console.log(findWords(board, ["oath", "pea", "eat", "rain"]));
`,
    expectedOutput: '["oath", "eat"]',
  },
];
