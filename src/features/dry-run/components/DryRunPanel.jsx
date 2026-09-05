/**
 * DryRunPanel — the right-hand half of the dry run screen.
 *
 * It is an arranger, not a worker: it picks which of the three states to show,
 * and hands the pieces of the current step to the panels that draw them.
 *
 * A note on the frame selector. By default you see the function that is
 * actually running. Click a frame in the call stack and it stays pinned to
 * that one, so you can watch an outer function's variables while an inner call
 * does its thing. Stepping past the end of that call quietly unpins it.
 */

import { useState } from "react";

import { Panel } from "../../../components/ui/Panel.jsx";
// The one place a feature reaches into another. The direction is deliberate
// and one-way: dry-run composes the visualiser, the visualiser never looks
// back at dry-run. See features/README.md.
import { StructuresPanel } from "../../visualizer/StructuresPanel.jsx";
import { CallStackPanel } from "./CallStackPanel.jsx";
import { ConsolePanel } from "./ConsolePanel.jsx";
import { RunOutputPanel } from "./RunOutputPanel.jsx";
import { RunStatusBanner } from "./RunStatusBanner.jsx";
import { StepControls } from "./StepControls.jsx";
import { StepNarration } from "./StepNarration.jsx";
import { VariablesPanel } from "./VariablesPanel.jsx";

export function DryRunPanel({ runner, language, sourceLines }) {
  const [pinnedDepth, setPinnedDepth] = useState(null);

  if (runner.status === "idle") {
    return <IdleState language={language} />;
  }

  if (runner.status === "running") {
    return <RunningState mode={runner.runningMode} />;
  }

  const { trace, stack, step, stepIndex } = runner;

  // Run Code took a different path: no steps to walk, just what it printed.
  if (trace.mode === "run") {
    return <RunOutputPanel trace={trace} />;
  }

  // The pin only holds while that frame still exists.
  const depth =
    pinnedDepth !== null && pinnedDepth < stack.length
      ? pinnedDepth
      : stack.length - 1;

  const frame = stack[depth] ?? null;

  // The same frame one step earlier, for the "changed" markers.
  const previousFrame = trace.steps[stepIndex - 1]?.stack?.[depth] ?? null;

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <RunStatusBanner trace={trace} />

      {trace.steps.length > 0 ? (
        <>
          <StepControls runner={runner} />

          <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
            <StepNarration
              step={step}
              previousStep={trace.steps[stepIndex - 1] ?? null}
              sourceLines={sourceLines}
            />

            {/* Diagrams first — they are the reason to be here. */}
            <StructuresPanel frame={frame} previousFrame={previousFrame} />

            <VariablesPanel frame={frame} previousFrame={previousFrame} />

            <CallStackPanel
              stack={stack}
              selectedDepth={depth}
              onSelectFrame={setPinnedDepth}
            />

            <ConsolePanel
              output={runner.output}
              totalOutput={trace.output.length}
            />
          </div>
        </>
      ) : (
        <div className="p-4 text-sm text-muted">
          No steps were recorded, so there is nothing to step through.
        </div>
      )}
    </Panel>
  );
}

function IdleState({ language }) {
  return (
    <Panel className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-xl text-brand">
        ▶
      </span>

      <h2 className="font-hand text-2xl text-text">Ready when you are</h2>

      {language.canDryRun ? (
        <div className="max-w-xs space-y-2 text-sm leading-relaxed text-muted">
          <p>
            <strong className="text-text">Run Code</strong> runs it start to
            finish and shows what it printed.
          </p>
          <p>
            <strong className="text-text">Dry Run</strong> records every line,
            so you can step through it one at a time and watch the variables
            change.
          </p>
        </div>
      ) : (
        <p className="max-w-xs text-sm leading-relaxed text-muted">
          The engine for {language.label} is not built yet. Switch to
          JavaScript to try it — your {language.label} draft is kept.
        </p>
      )}

      <p className="max-w-xs text-xs leading-relaxed text-muted">
        It runs inside your browser, on a background thread. Nothing is
        uploaded.
      </p>
    </Panel>
  );
}

function RunningState({ mode }) {
  return (
    <Panel className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
      <p role="status" className="text-sm text-muted">
        {mode === "run" ? "Running your code…" : "Recording every step…"}
      </p>
    </Panel>
  );
}
