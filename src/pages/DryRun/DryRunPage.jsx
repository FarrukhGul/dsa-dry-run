/**
 * DryRunPage — the main screen: write code on the left, watch it run on the
 * right.
 *
 * Notice how little happens in this file. It holds no logic of its own — it
 * asks two hooks for the state and hands pieces to the components that do the
 * work. That is the rule for every page: pages arrange, features work.
 *
 *   useCodeDraft   the code you are writing, saved as you type
 *   useDryRunner   the recorded run, and where you are inside it
 */

import { useMemo } from "react";

import { Container } from "../../components/ui/Container.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { DryRunPanel } from "../../features/dry-run/components/DryRunPanel.jsx";
import { useDryRunner } from "../../features/dry-run/store/useDryRunner.js";
import { useStepShortcuts } from "../../features/dry-run/useStepShortcuts.js";
import { CodeEditor } from "../../features/editor/CodeEditor.jsx";
import { EditorToolbar } from "../../features/editor/EditorToolbar.jsx";
import { useCodeDraft } from "../../features/editor/useCodeDraft.js";

/*
 * How tall the two panels are.
 *
 * On a phone: a fixed chunk of the screen, so the page still scrolls normally.
 * On a laptop: whatever is left after the header and toolbar, with a floor so
 * it never collapses into a letterbox on a short window.
 */
const PANEL_HEIGHT = "h-[65vh] min-h-[420px] lg:h-[calc(100vh-13rem)]";

export function DryRunPage() {
  const { language, setLanguageId, code, setCode, resetToTemplate, isUnchanged } =
    useCodeDraft();

  const runner = useDryRunner();

  /*
   * The code split into lines, so the panel can quote the line a step is on.
   *
   * This is safe to take from the editor rather than from the trace: editing
   * the code clears the run (see below), so what is on screen always matches
   * what was executed.
   */
  const sourceLines = useMemo(() => code.split("\n"), [code]);

  // Arrow keys step through the run — but only once there is a run to step
  // through, and never while the cursor is in the editor.
  useStepShortcuts(runner, runner.mode === "dry-run" && runner.totalSteps > 0);

  /*
   * Editing the code makes the recorded run stale — its line numbers may not
   * even exist any more. Throwing it away is the honest response; showing a
   * highlight against code that has moved would be worse than showing nothing.
   */
  function handleCodeChange(nextCode) {
    setCode(nextCode);
    if (runner.status !== "idle") runner.clear();
  }

  function handleSelectLanguage(languageId) {
    setLanguageId(languageId);
    runner.clear();
  }

  function handleReset() {
    resetToTemplate();
    runner.clear();
  }

  return (
    <Container size="wide" className="py-6">
      <EditorToolbar
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onReset={handleReset}
        isUnchanged={isUnchanged}
        onRunCode={() => runner.runCode({ source: code, languageId: language.id })}
        onDryRun={() => runner.dryRun({ source: code, languageId: language.id })}
        runningMode={runner.runningMode}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* `overflow-hidden` keeps the editor's square corners inside our
            rounded panel. Without it the editor pokes out at the corners. */}
        <Panel className={`overflow-hidden ${PANEL_HEIGHT}`}>
          <CodeEditor
            language={language}
            value={code}
            onChange={handleCodeChange}
            activeLine={runner.activeLine}
          />
        </Panel>

        <div className={PANEL_HEIGHT}>
          <DryRunPanel
            runner={runner}
            language={language}
            sourceLines={sourceLines}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        Your code is saved in this browser as you type — each language keeps its
        own draft — and it runs on a background thread that cannot reach the
        page or the network.
      </p>
    </Container>
  );
}
