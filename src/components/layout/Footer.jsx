/**
 * Footer — the strip at the bottom of every page.
 *
 * More than a copyright line: it repeats the promises the project runs on,
 * shows you how far through the library you are, and gives every part of the
 * site a way back.
 *
 * WHAT MAKES IT INTERACTIVE
 *
 *   · your solved count is live, and re-reads itself whenever you change page
 *   · links draw an underline out from the left as you hover
 *   · the social buttons lift
 *   · "back to top" scrolls smoothly, and hides itself until there is
 *     something to scroll back from
 *
 * The solved count comes from `readSolvedCount`, a plain storage read rather
 * than the progress hook. That matters: the hook would be fine, but importing
 * the problem library here would drag all 150 problems into the bundle that
 * every single page loads.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";

import { SocialIcon } from "../ui/SocialIcon.jsx";
import { DEVELOPER, developerLinks } from "../../data/developer.js";
import { PROBLEM_COUNT } from "../../data/problems/topics.js";
import { readSolvedCount } from "../../features/problems/useProblemProgress.js";
import { Container } from "../ui/Container.jsx";

const EXPLORE = [
  { to: "/", label: "Home" },
  { to: "/dry-run", label: "Dry Run" },
  { to: "/whiteboard", label: "Whiteboard" },
  { to: "/problems", label: "Problems" },
  { to: "/developer", label: "Developer" },
];

/** The open source this is built on. Credit where it is due. */
const BUILT_WITH = [
  { label: "Excalidraw", href: "https://excalidraw.com" },
  { label: "CodeMirror", href: "https://codemirror.net" },
  { label: "Acorn", href: "https://github.com/acornjs/acorn" },
  { label: "GSAP", href: "https://gsap.com" },
  { label: "React", href: "https://react.dev" },
];

/**
 * A link whose underline grows out from the left on hover.
 *
 * Done with a pseudo-element that scales horizontally rather than by animating
 * the real underline, so the text never shifts by a pixel as it appears.
 */
const linkStyles =
  "relative inline-block text-sm text-muted transition-colors hover:text-text " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left " +
  "after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 " +
  "hover:after:scale-x-100";

export function Footer() {
  const links = developerLinks();

  return (
    <footer className="mt-20 border-t border-border">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ---- Who and what ------------------------------------- */}
          <div className="lg:col-span-2">
            <span className="font-hand text-2xl text-text">DryRun</span>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
              Step through your DSA code one line at a time. Free for everyone,
              with no account — and your code never leaves your browser.
            </p>

            <SolvedSoFar />

            {links.length > 0 && (
              <div className="mt-6 flex gap-2">
                {links.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={link.label}
                    title={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-raised text-muted transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-card"
                  >
                    <SocialIcon name={link.key} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ---- Where to go -------------------------------------- */}
          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
              Explore
            </h2>

            <ul className="mt-3 space-y-2">
              {EXPLORE.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkStyles}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- Standing on other people's work ------------------ */}
          <div>
            <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
              Built with
            </h2>

            <ul className="mt-3 space-y-2">
              {BUILT_WITH.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkStyles}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- The line at the very bottom ------------------------ */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>
            Built by{" "}
            <Link to="/developer" className="text-text hover:text-brand">
              {DEVELOPER.name}
            </Link>
            {" · "}
            {new Date().getFullYear()}
          </p>

          <p>Your code runs in your browser. It is never uploaded anywhere.</p>

          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}

/**
 * Notifies React when the stored progress changes.
 *
 * The `storage` event only fires for OTHER tabs, never the one that did the
 * writing. That is fine here: within this tab the count can only have moved
 * while you were on the dry run page, and `useLocation` below re-renders us
 * when you navigate away from it. Between them, both cases are covered.
 */
function subscribeToProgress(onChange) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * How far through the library you are.
 *
 * Read with `useSyncExternalStore`, which is React's answer for values that
 * live outside it — like localStorage. Reading it into state inside an effect
 * would work, but it renders once with the wrong number and then corrects
 * itself, which is exactly the flicker this avoids.
 */
function SolvedSoFar() {
  // Called for its re-render, not its value: navigating is the moment the
  // count could have changed within this tab.
  useLocation();

  const solved = useSyncExternalStore(
    subscribeToProgress,
    readSolvedCount,
    // Used if this is ever rendered on a server, where there is no storage.
    () => 0,
  );

  const percent = Math.round((solved / PROBLEM_COUNT) * 100);

  return (
    <Link
      to="/problems"
      className="group mt-5 block max-w-xs rounded-lg border border-border bg-raised p-3 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted">
          {solved === 0 ? "Problem library" : "Your progress"}
        </span>

        <span className="font-mono text-xs text-text tabular-nums">
          {solved} / {PROBLEM_COUNT}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-brand"
          // Transitioned rather than jumped, so returning to a page you have
          // made progress on shows the bar moving to its new length.
          style={{ width: `${percent}%`, transition: "width 700ms cubic-bezier(.2,.7,.3,1)" }}
        />
      </div>

      <span className="mt-2 block text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
        {solved === 0 ? "Start solving →" : "Keep going →"}
      </span>
    </Link>
  );
}

/** Scrolls back to the top, and stays out of the way until it is useful. */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      setVisible(window.scrollY > 400);
    }

    check();
    // `passive` tells the browser we will never block the scroll, so it can
    // keep scrolling smoothly while this runs.
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      // Hidden from everyone, including screen readers, when it would do
      // nothing — rather than left as a button that appears to be broken.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 transition-all hover:border-brand hover:text-brand ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span aria-hidden="true">↑</span> Back to top
    </button>
  );
}
