/**
 * HomePage — the landing page.
 *
 * Four sections, in the order a first-time visitor needs them:
 *   1. Hero          what this is, and a button to try it
 *   2. Features      what you actually get
 *   3. How it works  the three steps, so nobody has to guess
 *   4. Languages     which languages work today, honestly labelled
 *
 * The lists below are plain data. Editing the wording means editing an array,
 * not hunting through JSX.
 */

import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { HeroPreview } from "./HeroPreview.jsx";

const features = [
  {
    title: "Step through real code",
    body: "Not a simulation. Your actual code runs and pauses on every line, so you can go forward, jump backward, or scrub the whole run like a video.",
  },
  {
    title: "Watch your data grow",
    body: "Arrays become cells, linked lists grow arrows, trees lay themselves out. Pointers like i, j, left and right are drawn on the cells they point at.",
  },
  {
    title: "Sketch it out",
    body: "A full hand-drawn whiteboard is built in, so you can draw the idea before you code it — and keep the drawing next to the code.",
  },
];

const steps = [
  {
    number: "1",
    title: "Paste your code",
    body: "Drop in a solution you are stuck on, or pick one from the problem library.",
  },
  {
    number: "2",
    title: "Press Dry Run",
    body: "It runs inside your browser. Nothing is uploaded, and there is nothing to sign up for.",
  },
  {
    number: "3",
    title: "Step through it",
    body: "Move one line at a time and read what changed, in plain English, at every step.",
  },
];

const languages = [
  { name: "JavaScript", status: "Building now", ready: true },
  { name: "Python", status: "Next up", ready: false },
  { name: "C++", status: "Planned", ready: false },
  { name: "Java", status: "Planned", ready: false },
];

export function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* 1. Hero                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="pt-16 pb-20 sm:pt-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="brand">
              Free forever · No sign-up · Runs in your browser
            </Badge>

            <h1 className="mt-6 font-hand text-4xl leading-tight text-text sm:text-6xl">
              Stop dry running with pencil and paper.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Paste your DSA code and watch it run one line at a time — every
              variable, every loop, every recursive call, drawn out for you.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/dry-run" size="lg">
                Start a dry run
              </Button>

              <Button to="/problems" size="lg" variant="secondary">
                Browse problems
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <HeroPreview />
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. Features                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-8">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <Panel key={feature.title} className="p-6">
                <h2 className="font-hand text-2xl text-text">
                  {feature.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {feature.body}
                </p>
              </Panel>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 3. How it works                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-20">
        <Container>
          <h2 className="text-center font-hand text-3xl text-text sm:text-4xl">
            How it works
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-tint font-hand text-lg text-brand">
                  {step.number}
                </span>

                <h3 className="mt-4 text-base font-semibold text-text">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. Languages                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="pb-4">
        <Container>
          <Panel className="p-8 text-center">
            <h2 className="font-hand text-2xl text-text">Languages</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              We would rather say "not yet" than show you a dry run that is
              subtly wrong.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {languages.map((language) => (
                <Badge
                  key={language.name}
                  tone={language.ready ? "brand" : "neutral"}
                >
                  <span className="font-medium">{language.name}</span>
                  <span className="opacity-70">· {language.status}</span>
                </Badge>
              ))}
            </div>
          </Panel>
        </Container>
      </section>
    </>
  );
}
