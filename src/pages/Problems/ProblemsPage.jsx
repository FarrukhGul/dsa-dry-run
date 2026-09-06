/**
 * ProblemsPage — the library of worked problems.
 *
 * Thin, like every page: it fetches the list and hands it to the browser
 * component. The problems themselves live in src/data/problems/.
 */

import { Container } from "../../components/ui/Container.jsx";
import { PROBLEMS, problemsByTopic } from "../../data/problems/index.js";
import { ProblemBrowser } from "../../features/problems/ProblemBrowser.jsx";

export function ProblemsPage() {
  const groups = problemsByTopic();

  return (
    <Container className="py-14">
      <header className="max-w-2xl">
        <h1 className="font-hand text-4xl text-text sm:text-5xl">
          Problem library
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted">
          The {PROBLEMS.length} problems of the NeetCode 150, grouped by the
          pattern they teach. Every one comes with a worked JavaScript solution
          you can open and step through line by line.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          The solutions are written to be read rather than to be short, and
          every single one is checked by actually running it — a wrong solution
          fails our build rather than surprising you.
        </p>
      </header>

      <ProblemBrowser groups={groups} total={PROBLEMS.length} />
    </Container>
  );
}
