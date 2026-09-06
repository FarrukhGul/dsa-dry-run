/**
 * Header — the bar at the top of every page: logo, navigation, theme toggle.
 *
 * It sticks to the top as you scroll and blurs whatever is behind it, the same
 * way Excalidraw's site does.
 *
 * ON SMALL SCREENS
 *
 * The links collapse behind a menu button whose three bars MORPH into a cross —
 * the top and bottom rotate into place while the middle fades out. One
 * continuous movement rather than a jump cut between two icons.
 *
 * WHY THE PANEL FLOATS INSTEAD OF PUSHING
 *
 * This first animated a CSS grid row from `0fr` to `1fr`, which is the neat
 * way to animate to an unknown height. It was also visibly janky, and the
 * reason is worth remembering: `grid-template-rows` is a LAYOUT property, so
 * the browser re-lays-out the page on every frame. Worse, this header is
 * `sticky` with a `backdrop-blur`, so each of those frames also forced the
 * blur behind it to be recomputed.
 *
 * The panel is now absolutely positioned just below the header and animates
 * only `translate` and `opacity`. Both are compositor properties: the browser
 * moves an already-painted layer instead of redoing layout, so nothing behind
 * it is disturbed and the frame cost is close to nothing.
 *
 * The rule this is an instance of: if an animation feels heavy, check whether
 * it is animating something that changes layout. Translate, rotate, scale and
 * opacity are nearly free; width, height, top and grid tracks are not.
 */

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { cx } from "../../lib/classNames.js";
import { Container } from "../ui/Container.jsx";
import { Logo } from "./Logo.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

/**
 * Every page in the navigation. Adding a page? Add it here and in
 * src/routes/AppRoutes.jsx — those two files are the whole site map.
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
  const [isOpen, setIsOpen] = useState(false);

  // Escape closes it, the way every other menu on the web does.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Wide screens: navigation sits inline. */}
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

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <MenuButton
              isOpen={isOpen}
              onToggle={() => setIsOpen((open) => !open)}
            />
          </div>
        </div>

      </Container>

      {/*
        The panel floats below the header rather than pushing the page down.

        `top-full` sits it flush under the header, and being out of the normal
        flow means opening it costs no layout at all. `bg-bg` is deliberately
        opaque: a translucent panel would have to blend with whatever scrolled
        behind it, on every frame.

        `will-change-transform` asks for its own compositor layer up front, so
        the very first frame is as smooth as the rest rather than stuttering
        while the browser promotes it.
      */}
      <div
        id="site-menu"
        aria-hidden={!isOpen}
        className={cx(
          "absolute inset-x-0 top-full border-b border-border bg-bg shadow-pop",
          "transition-[translate,opacity] duration-200 ease-out will-change-[translate,opacity] md:hidden",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <Container>
          <nav className="flex flex-col gap-1 py-3">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setIsOpen(false)}
                // No per-link stagger any more. Five extra transitions running
                // at once is exactly the sort of thing that stutters on a cheap
                // phone, and the panel arriving as one piece reads better.
                tabIndex={isOpen ? 0 : -1}
                className={navLinkStyles}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}

/**
 * Three bars that become a cross.
 *
 * The two outer bars travel to the middle and rotate; the centre one fades and
 * shrinks away beneath them. Everything is transform and opacity, so it stays
 * smooth even on a slow phone.
 */
function MenuButton({ isOpen, onToggle }) {
  /*
   * The transition list names `translate`, `rotate` and `scale` — NOT
   * `transform`.
   *
   * Tailwind v4 compiles its transform utilities to the individual CSS
   * properties rather than to one `transform`:
   *
   *   .translate-y-2 { translate: … }   .rotate-45 { rotate: 45deg }
   *
   * So transitioning `transform` here would match nothing at all, and the bars
   * would snap into the cross while only their opacity faded. All three are
   * still compositor properties, so this stays as cheap as a transform would
   * have been — it just has to be spelled correctly.
   *
   * `transition-all` would also work, but it makes the browser watch every
   * animatable property for changes that are never coming.
   */
  const bar =
    "block h-0.5 w-5 rounded-full bg-current " +
    "transition-[translate,rotate,scale,opacity] duration-200 ease-out";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="site-menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-raised text-muted transition-colors hover:border-brand hover:text-brand md:hidden"
    >
      {/* 8px is the centre-to-centre gap between the bars, so this lands the
          top bar exactly on the middle one. */}
      <span className={cx(bar, isOpen && "translate-y-2 rotate-45")} />
      <span className={cx(bar, isOpen && "scale-x-0 opacity-0")} />
      <span className={cx(bar, isOpen && "-translate-y-2 -rotate-45")} />
    </button>
  );
}
