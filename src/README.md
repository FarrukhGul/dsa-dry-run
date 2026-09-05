# How this project is organised

Start here. Every folder below has one job, and nothing else.

```
src/
├─ main.jsx        Where the app starts. Read this first — it is 20 lines.
├─ App.jsx         The frame: header + page + footer, stacked.
│
├─ routes/         The site map — every URL the app answers to
│  └─ AppRoutes.jsx
│
├─ providers/      App-wide state that any page can read
│  ├─ ThemeProvider.jsx   decides light or dark, and remembers it
│  └─ theme-context.js
│
├─ pages/          One folder per screen
│  │                A page is THIN. It arranges things; it does not do work.
│  ├─ Home/          the landing page
│  ├─ DryRun/        the editor + visualiser
│  ├─ Whiteboard/    the drawing board (Phase 5)
│  ├─ Problems/      the problem library (Phase 7)
│  └─ NotFound/      shown for an unknown URL
│
├─ features/       Where the real work happens
│  │                Each feature owns its own logic, state and components.
│  ├─ editor/        the code editor            ✅ built
│  ├─ dry-run/       turning code into steps    ← Phase 2, next
│  ├─ visualizer/    drawing variables, arrays, trees, the call stack
│  ├─ whiteboard/    the Excalidraw canvas
│  └─ problems/      the problem catalogue
│
├─ components/     Shared building blocks used by many pages
│  ├─ ui/            Button, Panel, Badge, Container — plain and reusable
│  └─ layout/        Header, Footer, Logo, ThemeToggle
│
├─ hooks/          Reusable React hooks (useTheme, useLocalStorage)
├─ lib/            Plain helper functions. No React in here.
├─ data/           Static content, such as the problem list
├─ styles/         All CSS: Tailwind, colour variables, fonts
└─ assets/         Images and font files
```

## The one rule that keeps it clean

**Pages arrange. Features do the work.**

If a page file is getting long or clever, the clever part belongs in
`features/`. A page should read like a table of contents — compare
`pages/DryRun/DryRunPage.jsx`, which is barely 30 lines of actual code.

## Where do I put a new file?

| I am building…                     | It goes in…                |
| ---------------------------------- | -------------------------- |
| a whole new screen                 | `pages/`                   |
| a button, card, or anything reused | `components/ui/`           |
| logic for one specific feature     | `features/<that-feature>/` |
| a helper with no React in it       | `lib/`                     |
| a colour, spacing or font          | `styles/theme.css`         |

## Adding a page takes two edits

1. A `<Route>` in `routes/AppRoutes.jsx`
2. A link in `components/layout/Header.jsx`

## Colours and dark mode

Never write a raw colour like `bg-white` or `text-gray-500`. Use the app's own
names, which switch between light and dark automatically:

```jsx
<div className="bg-surface text-text border border-border">
  <span className="text-muted">quiet text</span>
  <button className="bg-brand text-brand-contrast">do the thing</button>
</div>
```

Full list: `bg`, `surface`, `raised`, `border`, `text`, `muted`, `brand`,
`brand-hover`, `brand-tint`, `brand-contrast`. All defined once in
[`styles/theme.css`](./styles/theme.css) and wired to Tailwind in
[`styles/index.css`](./styles/index.css).

## Fonts

| Class       | Font           | Use it for                |
| ----------- | -------------- | ------------------------- |
| `font-hand` | Excalifont     | headings and the logo     |
| `font-sans` | Assistant      | everything else (default) |
| `font-mono` | JetBrains Mono | code and variable values  |
