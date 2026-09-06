/**
 * statements/tries.js — the questions for the trie pattern.
 * All wording our own; see statements/arrays-hashing.js for the field shapes.
 */

export const triesStatements = {
  "implement-trie": {
    description:
      "Build a prefix tree supporting three operations: insert a word, search for a whole word, and check whether any stored word begins with a given prefix. The difference between the last two is the interesting part.",
    examples: [
      {
        input: 'insert("apple"), search("apple"), search("app"), startsWith("app")',
        output: "true, false, true",
        explanation:
          '"app" was never inserted as a word, but it is a prefix of one.',
      },
    ],
    constraints: ["1 ≤ word length ≤ 2,000", "Lowercase English letters."],
    starter: `// Implement Trie (Prefix Tree)
// insert, search (whole word), and startsWith (any prefix).

class Trie {
  constructor() {
    // Your code here.
  }

  insert(word) {
    // Your code here.
  }

  search(word) {
    // Your code here.
  }

  startsWith(prefix) {
    // Your code here.
  }
}

const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));
console.log(trie.search("app"));
console.log(trie.startsWith("app"));
`,
  },

  "design-add-and-search-words": {
    description:
      "A word store where searches may contain a full stop, which matches any single letter. Adding is ordinary; searching has to cope with a wildcard that could match several different branches.",
    examples: [
      {
        input: 'add "bad" and "dad", then search "pad", "bad", ".ad", "b.."',
        output: "false, true, true, true",
        explanation:
          '".ad" matches both bad and dad. "b.." matches bad.',
      },
    ],
    constraints: ["1 ≤ word length ≤ 25", "Lowercase letters and dots."],
    starter: `// Design Add and Search Words Data Structure
// A "." in a search matches any single letter.

class WordDictionary {
  constructor() {
    // Your code here.
  }

  addWord(word) {
    // Your code here.
  }

  search(word) {
    // Your code here.
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
  },

  "word-search-ii": {
    description:
      "Find every word from a list that can be traced through a grid of letters, moving between neighbouring squares and never reusing a square within one word. Searching for each word separately is far too slow when the list is long.",
    examples: [
      {
        input:
          'board = [[o,a,a,n],[e,t,a,e],[i,h,k,r],[i,f,l,v]], words = ["oath","pea","eat","rain"]',
        output: '["oath", "eat"]',
        explanation: "oath and eat can both be traced; pea and rain cannot.",
      },
    ],
    constraints: ["1 ≤ rows, columns ≤ 12", "1 ≤ words.length ≤ 30,000"],
    starter: `// Word Search II
// Return every word from the list that can be traced through the grid.

function findWords(board, words) {
  // Your code here.
}

const board = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];

console.log(findWords(board, ["oath", "pea", "eat", "rain"]));
`,
  },
};
