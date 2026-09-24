# DryRun

**Stop dry running with pencil and paper.**

Paste your data structures and algorithms code and watch it run one line at a
time: every variable, every loop, every recursive call, drawn out for you.

Free, no sign-up, and your code never leaves your browser.

### [▶ Try it live: dsa-dry-run.vercel.app](https://dsa-dry-run.vercel.app/)

![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![No backend](https://img.shields.io/badge/backend-none-2ea44f)

<!-- Add a screenshot or GIF of the dry run screen here, e.g. ![DryRun](docs/screenshot.png) -->

---

## What you get

- **Step through real code.** This is not a simulation. Your actual code runs, and every line is recorded. Go forward, go back, or scrub the whole run like a video.
- **Plain-English narration.** Each step tells you what the previous line did, for example *"j goes from 0 to 1, and nums goes from [1, 1, 2] to [1, 3, 2]."*
- **Your data, drawn out.** Arrays become cells, linked lists become boxes and arrows, trees are laid out the way you would draw them, and 2-D arrays become grids. Index variables like `i`, `left`, `mid` and `slow` sit under the cells they point at.
- **Variables, call stack and console** for every step, side by side with the code.
- **A built-in whiteboard.** The real [Excalidraw](https://excalidraw.com), with one-click array, linked list, tree and call-stack shapes, so you can sketch the idea next to the code.
- **150 practice problems.** The NeetCode 150, grouped into 18 patterns. Try one yourself or open the worked solution. A problem is marked solved only when your own code prints the right answer.
- **Keyboard stepping.** `→` / `←` to step, `Home` / `End` to jump, `Space` to play or pause.
- **Light and dark mode**, and your code and drawings are saved in your browser automatically.

## Languages

| Language   | Status  | How it runs                                               |
| ---------- | ------- | --------------------------------------------------------- |
| JavaScript | Ready   | Your code is rewritten to report every step, then run     |
| Python     | Ready   | Real CPython in the browser via [Pyodide](https://pyodide.org), traced with `sys.settrace` |
| C++        | Planned |                                                           |
| Java       | Planned |                                                           |

The editor already highlights all four. Dry run is switched on only for
languages it handles correctly, because a dry run that is subtly wrong is worse
than none.

## How it works

DryRun has no server. Everything happens in your browser:

```
your code
   │
   ├─ runs on a Web Worker ........ a separate thread with no access to the page
   │
   ├─ instrumented ................ `let sum = 0;` becomes
   │                                `__dryRun__.step(2, {…}); let sum = 0;`
   │
   ├─ executed once, start to end . every step is recorded as it happens
   │
   └─ a trace ..................... a list of snapshots: line, variables, call stack
```

The whole run is recorded **before** you see anything. What is on screen is
entry number `stepIndex` of a finished list, which is why stepping backwards is
instant: nothing runs again.

There are two buttons, and they use the same engine:

|          | Run Code              | Dry Run                    |
| -------- | --------------------- | -------------------------- |
| Answers  | "What does it print?" | "Why does it do that?"     |
| Records  | nothing               | every line, every variable |
| Step cap | 5,000,000             | 20,000                     |

## Privacy and safety

Your code runs on your own machine and is never uploaded. There is no account,
no database and no analytics.

Pasted code runs inside a Web Worker with:

- no access to the page, `localStorage` or cookies
- `fetch`, `WebSocket` and `XMLHttpRequest` removed before your code starts
- a Content Security Policy that only allows requests to the site itself (needed to load Python)
- limits on steps, running time and call depth, so an infinite loop cannot freeze the tab
- a kill switch that stops the thread at once

The site has a strict CSP with no inline scripts. Details are in
[DEPLOY.md](DEPLOY.md) and
[src/features/dry-run/README.md](src/features/dry-run/README.md).

## Getting started

You need **Node.js 20.19 or newer**.

```bash
git clone https://github.com/FarrukhGul/dsa-dry-run.git
cd dsa-dry-run
npm install
npm run sync:pyodide   # copies the Python runtime into public/pyodide/
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

`sync:pyodide` is needed once, and again after you update the `pyodide`
package. Without it, JavaScript still works but Python won't load in
development. `npm run build` runs it for you.

## Scripts

| Command                  | What it does                                              |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Start the development server                              |
| `npm run build`          | Copy the Python runtime, then build the site into `dist/` |
| `npm run preview`        | Serve the built site locally                              |
| `npm run lint`           | Run ESLint                                                |
| `npm run check:engine`   | Check the JavaScript engine                               |
| `npm run check:python`   | Check the Python engine                                   |
| `npm run check:problems` | Run all 150 solutions and compare them with the expected output |

Run `check:engine` or `check:python` after changing anything in
`src/features/dry-run/engines/`. A bug there usually gives a trace that is
slightly wrong instead of an error, so these checks are the only way to catch it.

## Project structure

```
src/
├─ main.jsx         where the app starts
├─ App.jsx          header + page + footer
├─ routes/          every URL the app answers to
├─ providers/       app-wide state (theme)
├─ pages/           one folder per screen — thin, they only arrange things
├─ features/        where the real work happens
│  ├─ editor/         CodeMirror editor, language picker, starter code
│  ├─ dry-run/        engines, sandbox, stepping, narration
│  ├─ visualizer/     arrays, lists, trees and grids as diagrams
│  ├─ whiteboard/     Excalidraw canvas and DSA shapes
│  └─ problems/       problem browser and progress tracking
├─ components/      shared UI (ui/) and layout (layout/)
├─ hooks/           reusable React hooks
├─ lib/             plain helper functions, no React
├─ data/            the problem library and developer info
└─ styles/          Tailwind, colour tokens, fonts
```

The rule that keeps it tidy: **pages arrange, features do the work.** Every
folder has its own README, and [src/README.md](src/README.md) is the best place
to start reading the code.

## Deploying

DryRun is a static site with no environment variables. It is set up for
**Vercel** (`vercel.json`), and `public/_headers` covers **Cloudflare Pages**
and **Netlify**.

Two settings are required: a catch-all rewrite to `index.html`, and a separate
Content Security Policy for `/workers/*`. Without the second one the site
loads but nothing runs. [DEPLOY.md](DEPLOY.md) explains both.

The build is about 23 MB, of which 13 MB is Python. Visitors download it only
the first time they run Python code.

## Known limits

- `async` / `await` and Promises are not traced usefully yet; the trace is recorded synchronously.
- A dry run records up to 20,000 steps. Larger inputs work with **Run Code**, which records nothing.
- Very large structures are recorded up to 12 levels deep and 300 objects per variable, then marked `…`.
- C++ and Java can be edited but not dry run yet.

## Roadmap

- [x] Code editor
- [x] JavaScript engine
- [x] Step-by-step visualiser
- [x] Whiteboard
- [x] Python engine
- [x] Problem library (NeetCode 150)
- [ ] C++ and Java (beta)
- [ ] Polish and accessibility pass

## Built with

[React](https://react.dev) ·
[Vite](https://vite.dev) ·
[Tailwind CSS](https://tailwindcss.com) ·
[CodeMirror](https://codemirror.net) ·
[Excalidraw](https://excalidraw.com) ·
[Acorn](https://github.com/acornjs/acorn) and
[Astring](https://github.com/davidbonnet/astring) for the JavaScript engine ·
[Pyodide](https://pyodide.org) for Python ·
[GSAP](https://gsap.com) for animation

Problem titles and topics follow the public NeetCode 150 list. Every problem
summary is written in our own words; no LeetCode statements are copied.

## Author

**Farrukh Gul**, Lahore, Pakistan

[GitHub](https://github.com/FarrukhGul) ·
[LinkedIn](https://linkedin.com/in/farrukh-gul) ·
[Email](mailto:farrukhgul.dev@gmail.com)

If DryRun helped you understand an algorithm, a ⭐ on the repository is appreciated.
