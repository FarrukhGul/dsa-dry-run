# features/dry-run/

Turns your code into a **trace** — a list of every line that ran, and what
every variable was worth at that moment — and lets you move through it.

## The one idea

The whole run is recorded **before you see anything**. What is on screen is
never live code; it is entry number `stepIndex` of a finished notebook.

That is why stepping backwards is instant: nothing re-runs, we just look at an
earlier page. Everything on screen is worked out from `steps[stepIndex]`.

## Two buttons, one engine

|            | Run Code                  | Dry Run                        |
| ---------- | ------------------------- | ------------------------------ |
| Answers    | "what does it print?"     | "why does it do that?"         |
| Records    | nothing                   | every line, every variable     |
| Step cap   | 5,000,000                 | 20,000                         |
| You get    | output and errors         | a run you can walk through     |

They are **the same engine**, not two implementations. `runJavaScript(source,
{ record })` rewrites the code identically either way and only switches off the
note-taking — so an error reports the same line in both, and the two can never
disagree about what your program does.

The caps differ because a dry run keeps everything it sees, and memory is the
constraint. Run Code keeps nothing, so it is bounded by the clock instead:
a 200,000-iteration loop finishes there and would be cut short by a dry run.
When that happens the banner says so, and points at the other button.

## The path your code takes

```
your code
   │
   ├─ runInSandbox.js ....... starts a background thread, sets an 8s deadline
   │
   ├─ dryRun.worker.js ...... a separate thread with no page, no localStorage
   │
   ├─ instrument.js ......... rewrites your code so it reports on itself
   │                          `let sum = 0;`  becomes
   │                          `__dryRun__.step(2, {…}); let sum = 0;`
   │
   ├─ new Function(…) ....... compiles the rewritten version and runs it
   │
   ├─ tracer.js ............. catches every step() call and writes it down
   │
   └─ a trace, posted back to the page
```

## Files

| File                             | What it does                                    |
| -------------------------------- | ----------------------------------------------- |
| `sandbox/runInSandbox.js`        | Page side: start the thread, wait, give up, tidy |
| `sandbox/dryRun.worker.js`       | The isolated thread your code runs on            |
| `engines/javascript/instrument.js` | Rewrites your code so it reports on itself     |
| `engines/javascript/tracer.js`   | The notebook every report is written into        |
| `engines/javascript/runJavaScript.js` | Ties those three together              |
| `engines/shared/limits.js`       | Step, time, depth and size caps                  |
| `engines/shared/snapshotValue.js`| Copies a live value into a safe, frozen description |
| `store/useDryRunner.js`          | The React side: run, step, play, scrub           |
| `narrateStep.js`                 | Turns a step into a plain-English sentence       |
| `components/`                    | Narration, timeline, variables, call stack, console |

## Which moment the narration describes

A step is recorded *before* its line runs. So the difference between one step
and the next is the work the **previous** line did.

That is what the sentence describes — "what just happened" — while the violet
highlight in the editor shows what runs **next**. Press Next and the sentence
tells you what the line you just left actually did:

```
L4   j goes from 0 to 1, and nums goes from [1, 1, 2] to [1, 3, 2].
```

Mid-swap, with the duplicated value still sitting there. That intermediate
state is the thing people get wrong on paper.

When nothing changed, the line's own syntax is described instead — "Checking a
condition", never "the condition was true", because at that point we genuinely
do not know yet. The next step is what reveals it.

## Why not generators?

The obvious way to pause code on each line is to turn every function into a
generator. It is also a trap: `arr.sort(compare)` would hand `sort` a
generator, which returns an iterator instead of a number, and your sort would
silently produce nonsense.

Because we record the whole trace up front and let you scrub afterwards, we
never need to pause — so plain function calls do the job and every callback
keeps working. `instrument.js` says more.

## What is actually protecting you

Your code runs on a **Web Worker**. Concretely, that thread has:

- no `document` and no DOM — it cannot touch the page
- **no `localStorage`** — it cannot read the drafts you have saved
- no cookies
- `fetch`, `WebSocket`, `XMLHttpRequest` and friends shadowed to `undefined`
  before your code sees them (`runJavaScript.js`)
- **no network at all**, enforced by `connect-src 'none'` in the worker's own
  Content Security Policy (`public/_headers`)
- a step budget, a clock, and a call-depth cap (`limits.js`)
- a kill switch — `worker.terminate()` stops the thread mid-instruction

### Being honest about the limits

A worker is a strong wall, not a perfect one. Code running there still shares
the browser's origin, so a determined attacker could reach IndexedDB or the
Cache API, neither of which we use. The eval permission is real, even though it
is confined to the one file that has no way to send anything out.

The practical shape of the risk: this runs **your** code in **your** browser.
The threat worth taking seriously is pasting something malicious from the
internet without reading it. The layers above are aimed squarely at that —
particularly `connect-src 'none'`, which means such code has nowhere to send
anything it does manage to read.

## Known gaps

- `async` / `await` and Promises are not traced usefully. The trace is recorded
  synchronously, so anything scheduled for later finishes after recording ends.
- A variable declared with `let` inside a function is not listed in an outer
  function's frame if that outer function was written above it.
- Getters that throw show as "not available here" rather than as an error.
