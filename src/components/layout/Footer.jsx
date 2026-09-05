/**
 * Footer — the quiet strip at the bottom of every page.
 *
 * It repeats the two promises the project is built on — it is free, and your
 * code never leaves your browser — and credits whoever built it.
 *
 * The name comes from src/data/developer.js, the same file the Developer page
 * reads, so there is only ever one place to change it.
 */

import { Link } from "react-router-dom";

import { DEVELOPER } from "../../data/developer.js";
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

        <p className="mt-6 text-center text-xs text-muted sm:text-left">
          Built by{" "}
          <Link
            to="/developer"
            className="text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand"
          >
            {DEVELOPER.name}
          </Link>
        </p>
      </Container>
    </footer>
  );
}
