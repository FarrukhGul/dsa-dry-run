/**
 * useDeveloperAnimation — all the movement on the Developer page, in one place.
 *
 * The page markup stays plain and readable; every tween lives here.
 *
 * THE RULE THAT KEEPS THIS SAFE
 *
 * Nothing on the page is hidden by CSS. Elements start fully visible, and this
 * hook hides them and then brings them back. That ordering matters: if the
 * JavaScript ever fails to load, the page is simply a static page rather than a
 * blank one. Animation should never be the thing standing between a visitor and
 * your content.
 *
 * The same thinking runs through the rest of the file. Everything is on one
 * timeline that always runs, and if any of it throws, the catch at the bottom
 * puts the page back to normal. There is no state in which content stays
 * hidden because an animation did not happen.
 *
 * It runs in `useLayoutEffect`, which fires before the browser paints, so
 * hiding-then-animating never shows a flash of the finished page first.
 *
 * WHY THERE IS NO SCROLLTRIGGER HERE
 *
 * There was, and it was a bug. Revealing the links on scroll meant hiding them
 * until the visitor scrolled far enough — and on a page this short there is
 * often nothing to scroll. If the links sat below the trigger point on a tall
 * screen the reveal never fired, and they stayed invisible for good.
 *
 * A scroll reveal that can fail to fire is worse than no scroll reveal.
 *
 * REDUCED MOTION
 *
 * If the visitor has asked their system for less motion, this returns
 * immediately and does nothing. Because the page is already visible, doing
 * nothing is exactly the right outcome.
 */

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(SplitText, TextPlugin);

/** How fast the terminal types, in seconds per character. */
const TYPING_SPEED = 0.03;

/*
 * When the content below the terminal arrives, in seconds from page load.
 *
 * These are ABSOLUTE positions on the timeline, not "after the last thing
 * finishes" — and that distinction was a bug worth remembering.
 *
 * Chaining them meant the links waited for the entire intro plus both typing
 * animations before they even began, which put them about five seconds away.
 * Long enough that the page looked like it had no links on it at all.
 *
 * Pinning them to a fixed moment means the typing carries on in the terminal
 * while the rest of the page arrives, and nothing is ever more than about a
 * second and a half away — however long the terminal has left to type.
 */
const BELOW_FOLD_AT = 0.85;
const LINKS_AT = 1.0;
const OUTRO_AT = 1.2;

/** Everything this hook touches — used to undo it all if something breaks. */
const ANIMATED = [
  ".js-avatar",
  ".js-kicker",
  ".js-name",
  ".js-meta",
  ".js-terminal",
  ".js-term-out",
  ".js-cmd",
  ".js-reveal",
  ".js-link",
  ".js-outro",
].join(", ");

/**
 * @param {import("react").RefObject<HTMLElement>} rootRef the page wrapper
 */
export function useDeveloperAnimation(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // The page is already visible. Leave it alone.
    }

    /*
     * `gsap.context` scopes every selector below to this page and records
     * everything created inside it, so one `revert()` on unmount undoes the
     * lot — tweens and the split heading included.
     */
    const context = gsap.context((self) => {
      const find = (selector) => self.selector(selector);

      // Copied before anything is touched, so the typing effect can be undone.
      const commands = find(".js-cmd").map((element) => ({
        element,
        text: element.textContent,
      }));

      try {
        /* ---- The heading, split into letters ------------------------ */
        // The <h1> carries an aria-label and this inner span is aria-hidden,
        // so a screen reader reads the name once as a name — never letter by
        // letter, whatever the splitting does to the markup.
        const [nameEl] = find(".js-name");
        const split = nameEl ? new SplitText(nameEl, { type: "chars" }) : null;

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.6 },
        });

        /* ---- The introduction --------------------------------------- */
        timeline
          .from(".js-avatar", {
            scale: 0.82,
            opacity: 0,
            rotate: -8,
            duration: 0.9,
            // A little overshoot, so it settles into place rather than
            // stopping dead. This is the one flourish on the page.
            ease: "back.out(1.5)",
          })
          .from(".js-kicker", { y: 12, opacity: 0, duration: 0.45 }, "-=0.55");

        if (split) {
          timeline.from(
            split.chars,
            {
              yPercent: 60,
              opacity: 0,
              stagger: 0.028,
              duration: 0.55,
              ease: "power4.out",
            },
            "-=0.3",
          );
        }

        timeline
          .from(".js-meta", { y: 10, opacity: 0, duration: 0.45 }, "-=0.35")
          .from(".js-terminal", { y: 26, opacity: 0, duration: 0.7 }, "-=0.3");

        /* ---- The terminal types itself ------------------------------ */
        // The real text is in the markup already. We blank each command and
        // type the copy back in — so with no JavaScript they are simply there.
        commands.forEach(({ element, text }) => {
          gsap.set(element, { text: "" });

          timeline.to(
            element,
            { text, duration: text.length * TYPING_SPEED, ease: "none" },
            "-=0.15",
          );
        });

        timeline.from(
          ".js-term-out",
          { opacity: 0, x: -10, stagger: 0.1, duration: 0.4 },
          "-=0.2",
        );

        /* ---- Everything below the terminal -------------------------- */
        // Part of the same timeline, so it always runs. `>-0.3` means "start
        // 0.3s before the previous step finishes", which keeps it flowing.
        const reveals = find(".js-reveal");
        if (reveals.length > 0) {
          timeline.from(
            reveals,
            { y: 22, opacity: 0, stagger: 0.12, duration: 0.6 },
            BELOW_FOLD_AT,
          );
        }

        const links = find(".js-link");
        if (links.length > 0) {
          timeline.from(
            links,
            {
              y: 16,
              opacity: 0,
              scale: 0.96,
              stagger: 0.07,
              duration: 0.5,
              ease: "back.out(1.4)",
            },
            LINKS_AT,
          );
        }

        // The closing panel sits below the links, so it arrives just after.
        const outro = find(".js-outro");
        if (outro.length > 0) {
          timeline.from(outro, { y: 22, opacity: 0, duration: 0.6 }, OUTRO_AT);
        }

        /*
         * Once everything has arrived, drop the inline styles GSAP left behind.
         *
         * Belt and braces: it guarantees nothing is sitting at a stray opacity
         * or transform afterwards, whatever happened on the way.
         */
        timeline.eventCallback("onComplete", () => {
          gsap.set(find(ANIMATED), { clearProps: "opacity,transform" });
        });

        /* ---- The photo breathes, gently ----------------------------- */
        // On an inner element, so it cannot fight with the entrance tween
        // above, which animates the outer one.
        gsap.to(".js-avatar-float", {
          y: -7,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      } catch (error) {
        /*
         * Something in the animation failed — a plugin missing, a selector
         * matching nothing unexpectedly, anything.
         *
         * The important thing is that the visitor still sees the page. We drop
         * every inline style we set and put the typed commands back, which
         * returns the page to the plain markup it started as.
         */
        gsap.killTweensOf(find(ANIMATED));
        gsap.set(find(ANIMATED), { clearProps: "all" });
        commands.forEach(({ element, text }) => {
          element.textContent = text;
        });

        console.error("Developer page animation failed; showing it plain.", error);
      }
    }, root);

    return () => context.revert();
  }, [rootRef]);
}
