# data/

Static content that ships with the app. No server, no database — just files.

## problems/

One JSON file per DSA problem. Keeping them as data rather than code means
adding a problem is a copy-paste job, and never risks breaking the app.

Planned shape of each file:

```json
{
  "id": "two-sum",
  "title": "Two Sum",
  "topic": "arrays",
  "difficulty": "easy",
  "statement": "Given an array of numbers and a target...",
  "solutions": {
    "javascript": "function twoSum(nums, target) { ... }"
  },
  "sampleInput": { "nums": [3, 1, 4, 1, 5], "target": 9 }
}
```

Filled in during Phase 7.
