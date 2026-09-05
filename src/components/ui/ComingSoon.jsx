/**
 * ComingSoon — an honest placeholder for a page that is planned but not built.
 *
 * It says exactly what the page will do and which build phase it arrives in,
 * so an empty screen never leaves anyone guessing.
 *
 *   <ComingSoon
 *     title="Whiteboard"
 *     phase="Phase 5"
 *     description="Sketch your idea next to your code."
 *   />
 */

import { Container } from "./Container.jsx";
import { Badge } from "./Badge.jsx";
import { Panel } from "./Panel.jsx";

export function ComingSoon({ title, phase, description, children }) {
  return (
    <Container className="py-20">
      <Panel className="mx-auto max-w-2xl p-10 text-center">
        <Badge tone="brand">{phase}</Badge>

        <h1 className="mt-5 font-hand text-4xl text-text">{title}</h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          {description}
        </p>

        {/* Optional extra detail, passed in by the page. */}
        {children}
      </Panel>
    </Container>
  );
}
