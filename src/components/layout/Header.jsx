/**
 * Header — the bar at the top of every page: logo, navigation, theme toggle.
 *
 * It sticks to the top as you scroll and blurs whatever is behind it, the same
 * way Excalidraw's site does.
 *
 * On narrow screens the navigation moves to its own row underneath instead of
 * hiding behind a hamburger menu — fewer taps, and nothing to hunt for.
 */

import { NavLink } from "react-router-dom";

import { cx } from "../../lib/classNames.js";
import { Container } from "../ui/Container.jsx";
import { Logo } from "./Logo.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

/**
 * Every page in the navigation. Adding a page? Add it here and in
 * src/app/routes.jsx — those two files are the whole site map.
 */
const navigationLinks = [
  // `exact` matters only for this one. Every address begins with "/", so
  // without it the Home link would look active on every single page.
  { to: "/", label: "Home", exact: true },
  { to: "/dry-run", label: "Dry Run" },
  { to: "/whiteboard", label: "Whiteboard" },
  { to: "/problems", label: "Problems" },
  { to: "/developer", label: "Developer" },
];

/**
 * NavLink hands us `isActive` so we can highlight the page you are on.
 * We return the finished class string for both states.
 */
function navLinkStyles({ isActive }) {
  return cx(
    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-tint text-brand"
      : "text-muted hover:bg-surface hover:text-text",
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Wide screens: navigation sits inline, in the middle. */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={navLinkStyles}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle />
        </div>

        {/* Narrow screens: same links, own row. */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={navLinkStyles}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </Container>
    </header>
  );
}
