/**
 * VisualizerPlaceholder — fills the right-hand half of the dry run screen
 * until the real visualiser is built.
 *
 * It lists what will appear there, in the order it will appear, so the empty
 * space explains itself instead of looking broken.
 *
 * Replaced in Phase 3 by the real panels.
 */

import { Badge } from "../../components/ui/Badge.jsx";
import { Panel } from "../../components/ui/Panel.jsx";

const upcomingPanels = [
  {
    title: "Variables",
    body: "Every variable in scope, with the ones that just changed highlighted.",
  },
  {
    title: "Data structures",
    body: "Your arrays, linked lists and trees drawn out, with pointers sitting on the cells they point at.",
  },
  {
    title: "Call stack",
    body: "Every function currently running, stacked — so recursion stops being guesswork.",
  },
  {
    title: "Timeline",
    body: "Step forward, jump backward, or scrub the whole run like a video.",
  },
];

export function VisualizerPlaceholder() {
  return (
    <Panel className="flex h-full flex-col overflow-y-auto p-6">
      <div className="flex items-center gap-3">
        <Badge tone="brand">Phase 3</Badge>
        <h2 className="font-hand text-xl text-text">The step-by-step view</h2>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        Once the engine lands, pressing <strong className="text-text">Dry Run</strong>{" "}
        fills this side. Here is what goes here:
      </p>

      <ul className="mt-5 space-y-4">
        {upcomingPanels.map((panel) => (
          <li
            key={panel.title}
            className="border-l-2 border-border pl-4 transition-colors hover:border-brand"
          >
            <h3 className="text-sm font-semibold text-text">{panel.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {panel.body}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-6 text-xs leading-relaxed text-muted">
        Your code stays in this browser. It is never uploaded, and there is no
        account to make.
      </p>
    </Panel>
  );
}
