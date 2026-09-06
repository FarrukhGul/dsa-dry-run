/**
 * templates.js — the starter code shown when you open a language for the
 * first time, and what the "Reset" button puts back.
 *
 * Every template solves the same problem (Two Sum) on the same input, on
 * purpose: switching languages should show you the same idea written a
 * different way, not a whole new puzzle.
 *
 * They are also written to dry run *well* — a loop, a lookup table, an early
 * return. That is exactly the kind of code that is painful to trace by hand.
 */

const javascript = `// Two Sum — find the two numbers that add up to the target.
// Press "Dry Run" to watch this run one line at a time.

function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];

    if (seen.has(need)) {
      return [seen.get(need), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

twoSum([3, 1, 4, 1, 5], 9);
`;

const python = `# Two Sum — find the two numbers that add up to the target.

def two_sum(nums, target):
    seen = {}

    for i, value in enumerate(nums):
        need = target - value

        if need in seen:
            return [seen[need], i]

        seen[value] = i

    return []


print(two_sum([3, 1, 4, 1, 5], 9))
`;

const cpp = `// Two Sum — find the two numbers that add up to the target.

#include <unordered_map>
#include <vector>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];

        if (seen.count(need)) {
            return {seen[need], i};
        }

        seen[nums[i]] = i;
    }

    return {};
}
`;

const java = `// Two Sum — find the two numbers that add up to the target.

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];

            if (seen.containsKey(need)) {
                return new int[] {seen.get(need), i};
            }

            seen.put(nums[i], i);
        }

        return new int[] {};
    }
}
`;

/** Starter code, keyed by the language ids in languages.js. */
const TEMPLATES = { javascript, python, cpp, java };

/**
 * The starter code for a language.
 *
 * @param {string} languageId
 * @returns {string} the template, or an empty editor if we have none.
 */
export function getTemplate(languageId) {
  return TEMPLATES[languageId] ?? "";
}
