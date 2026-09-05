/**
 * Logo — the mark and wordmark in the top-left corner, linking home.
 *
 * The little icon is a "step forward" symbol (a play triangle followed by a
 * bar), because stepping forward one line at a time is exactly what this app
 * does. It matches the favicon in public/favicon.svg.
 */

import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 rounded-lg"
      aria-label="DryRun — go to home page"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-brand-contrast"
          aria-hidden="true"
        >
          <path d="M5 4.5 15 12 5 19.5z" />
          <rect x="17" y="4.5" width="2.5" height="15" rx="1.25" />
        </svg>
      </span>

      <span className="font-hand text-xl leading-none text-text">DryRun</span>
    </Link>
  );
}
