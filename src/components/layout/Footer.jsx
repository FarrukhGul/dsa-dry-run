/**
 * Footer — the quiet strip at the bottom of every page.
 *
 * It repeats the two promises the project is built on: it is free, and your
 * code never leaves your browser. Both are worth saying out loud.
 */

import { Container } from "../ui/Container.jsx";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-10">
      <Container>
        <div className="flex flex-col items-center gap-3 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>
            <span className="font-hand text-base text-text">DryRun</span> — free
            for everyone, forever.
          </p>

          <p>Your code runs in your browser. It is never uploaded anywhere.</p>
        </div>
      </Container>
    </footer>
  );
}
