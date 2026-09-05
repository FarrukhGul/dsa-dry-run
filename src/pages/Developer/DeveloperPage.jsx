/**
 * DeveloperPage — who built DryRun.
 *
 * Every word comes from src/data/developer.js. Nothing is written here, so
 * editing that one file changes the whole page, and anything left blank there
 * is skipped rather than rendered empty.
 *
 * THE LOOK
 *
 * A terminal card for the facts, because this is a site for programmers and it
 * is the one place where that styling means something rather than being
 * decoration. Everything else keeps the site's usual hand-drawn voice, so the
 * page still belongs to the same website.
 *
 * THE MOVEMENT
 *
 * Handled entirely by useDeveloperAnimation.js, so this file stays readable as
 * markup. The `js-` classes below are its handles — they carry no styling and
 * exist only so the animation can find things. If you rename one, rename it
 * there too.
 *
 * Note that nothing here is hidden by default. The animation hides things and
 * brings them back, which means the page still works if the JavaScript fails.
 */

import { useRef } from "react";

import { Container } from "../../components/ui/Container.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import {
  DEVELOPER,
  developerInitials,
  developerLinks,
} from "../../data/developer.js";
import { useDeveloperAnimation } from "./useDeveloperAnimation.js";

export function DeveloperPage() {
  const links = developerLinks();
  const rootRef = useRef(null);

  useDeveloperAnimation(rootRef);

  return (
    <Container className="py-14 sm:py-20">
      <div ref={rootRef} className="mx-auto max-w-2xl">
        <Hero />

        <Terminal />

        {DEVELOPER.bio && (
          <p className="js-reveal mt-8 leading-relaxed text-muted">
            {DEVELOPER.bio}
          </p>
        )}

        {DEVELOPER.why && (
          <Panel className="js-reveal mt-8 p-6">
            <h2 className="font-hand text-2xl text-text">Why I built DryRun</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-muted">
              {DEVELOPER.why}
            </p>
          </Panel>
        )}

        {links.length > 0 && <Links links={links} />}

        <AboutProject />
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
      <Avatar />

      <div>
        <p className="js-kicker font-mono text-xs tracking-wide text-brand">
          {"// built by"}
        </p>

        {/*
          The name is split into individual letters to animate. The heading
          carries the whole name as an aria-label and the inner span is hidden
          from screen readers, so it is always read as a name — never letter by
          letter, whatever the splitting does to the markup.
        */}
        <h1
          aria-label={DEVELOPER.name}
          className="mt-1 font-hand text-4xl leading-tight text-text sm:text-5xl"
        >
          <span aria-hidden="true" className="js-name inline-block">
            {DEVELOPER.name}
          </span>
        </h1>

        {(DEVELOPER.role || DEVELOPER.location) && (
          <p className="js-meta mt-2 text-sm text-muted">
            {[DEVELOPER.role, DEVELOPER.location].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </header>
  );
}

/** The photo, with a slow sweep behind it. Falls back to initials. */
function Avatar() {
  return (
    <div className="js-avatar relative shrink-0">
      {/* Decorative, and hidden from screen readers. The rotation is plain CSS
          — an endless spin needs no animation library. */}
      <span
        aria-hidden="true"
        className="animate-orbit absolute -inset-2 rounded-[1.75rem] bg-linear-to-tr from-brand via-transparent to-brand opacity-25"
      />

      {/* The float lives on this inner wrapper so it cannot fight with the
          entrance tween, which animates the element above. */}
      <div className="js-avatar-float relative">
        {DEVELOPER.avatarUrl ? (
          <img
            src={DEVELOPER.avatarUrl}
            alt={DEVELOPER.name}
            width={112}
            height={112}
            // `object-cover` keeps a non-square photo from being squashed.
            className="h-28 w-28 rounded-3xl border border-border object-cover shadow-card"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-28 w-28 items-center justify-center rounded-3xl border border-border bg-brand-tint font-hand text-4xl text-brand"
          >
            {developerInitials()}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * The terminal card: the facts, laid out as a session.
 *
 * It reuses the window styling from the home page preview, so the two feel
 * like parts of one site.
 */
function Terminal() {
  return (
    <Panel className="js-terminal mt-10 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 truncate font-mono text-xs text-muted">
          farrukh@dryrun: ~
        </span>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <Command>whoami</Command>

        <p className="js-term-out mt-1 text-text">
          {DEVELOPER.tagline || DEVELOPER.name}
        </p>

        {DEVELOPER.education?.length > 0 && (
          <>
            <div className="mt-5">
              <Command>cat education.txt</Command>
            </div>

            <ul className="mt-2 space-y-3">
              {DEVELOPER.education.map((entry, index) => (
                <li
                  key={`${entry.institution}-${index}`}
                  className="js-term-out"
                >
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span aria-hidden="true" className="text-brand">
                      →
                    </span>

                    <span className="text-text">{entry.qualification}</span>

                    {entry.grade && (
                      <span className="rounded bg-brand-tint px-1.5 py-0.5 text-[11px] text-brand">
                        {entry.grade}
                      </span>
                    )}
                  </div>

                  <p className="pl-5 text-muted">
                    {entry.institution}
                    {entry.note && (
                      <span className="text-muted/70"> · {entry.note}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* An empty prompt, waiting. The blink is plain CSS. */}
        <p className="js-term-out mt-5 flex items-center gap-2">
          <span className="text-brand">$</span>
          <span
            aria-hidden="true"
            className="animate-caret inline-block h-4 w-2 bg-muted align-middle"
          />
        </p>
      </div>
    </Panel>
  );
}

/** One `$ command` line. The command text is what gets typed out. */
function Command({ children }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-brand">$</span>
      <span className="js-cmd text-muted">{children}</span>
    </span>
  );
}

function Links({ links }) {
  return (
    <section className="mt-10">
      <h2 className="js-reveal font-mono text-xs tracking-wide text-brand">
        {"// elsewhere"}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            // Only real links open in a new tab. `noopener` stops the opened
            // page reaching back into this one; `noreferrer` keeps our URL out
            // of its logs.
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="js-link flex items-center gap-2 rounded-lg border border-border bg-raised px-4 py-2.5 text-sm font-medium text-text transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-card"
          >
            <LinkIcon name={link.key} />
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

/** Small marks for each service. Decorative — the label is right beside them. */
function LinkIcon({ name }) {
  const shared = {
    viewBox: "0 0 24 24",
    // `shrink-0` matters. These sit in a flex row next to a text label, and
    // without it flex is allowed to squash the icon below its own width —
    // down to nothing on a narrow screen. An icon that quietly disappears on
    // mobile is exactly the kind of bug nobody spots on a laptop.
    className: "h-4 w-4 shrink-0",
    "aria-hidden": "true",
  };

  if (name === "github") {
    return (
      <svg {...shared} fill="currentColor">
        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...shared} fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "email") {
    return (
      <svg
        {...shared}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    );
  }

  // Website, X, or anything added later.
  return (
    <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </svg>
  );
}

function AboutProject() {
  return (
    <Panel className="js-outro mt-10 p-6">
      <h2 className="font-hand text-2xl text-text">About the project</h2>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        DryRun is free for everyone, with no account and no limits. Your code is
        never uploaded — it runs on a background thread inside your own browser,
        which is also why there is nothing to pay for.
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        It stands on other people&apos;s work, all of it open source:{" "}
        <Credit href="https://excalidraw.com">Excalidraw</Credit> for the
        whiteboard, <Credit href="https://codemirror.net">CodeMirror</Credit> for
        the editor,{" "}
        <Credit href="https://github.com/acornjs/acorn">Acorn</Credit> and{" "}
        <Credit href="https://github.com/davidbonnet/astring">Astring</Credit>{" "}
        for reading and rewriting your code,{" "}
        <Credit href="https://gsap.com">GSAP</Credit> for the movement on this
        page, and <Credit href="https://react.dev">React</Credit> to hold it
        together.
      </p>
    </Panel>
  );
}

function Credit({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand"
    >
      {children}
    </a>
  );
}
