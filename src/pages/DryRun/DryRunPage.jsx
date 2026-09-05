/**
 * DryRunPage — the main screen: write code on the left, watch it run on the
 * right.
 *
 * Notice how little happens in this file. It holds no logic of its own — it
 * asks `useCodeDraft` for the code and hands pieces to the components that do
 * the work. That is the rule for every page: pages arrange, features work.
 *
 * Left side is real (Phase 1). Right side is a placeholder until Phase 3.
 */

import { Container } from "../../components/ui/Container.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { CodeEditor } from "../../features/editor/CodeEditor.jsx";
import { EditorToolbar } from "../../features/editor/EditorToolbar.jsx";
import { useCodeDraft } from "../../features/editor/useCodeDraft.js";
import { VisualizerPlaceholder } from "./VisualizerPlaceholder.jsx";

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

  return (
    <Container size="wide" className="py-6">
      <EditorToolbar
        language={language}
        onSelectLanguage={setLanguageId}
        onReset={resetToTemplate}
        isUnchanged={isUnchanged}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* `overflow-hidden` keeps Monaco's square corners inside our rounded
            panel. Without it the editor pokes out at the corners. */}
        <Panel className={`overflow-hidden ${PANEL_HEIGHT}`}>
          <CodeEditor language={language} value={code} onChange={setCode} />
        </Panel>

        <div className={PANEL_HEIGHT}>
          <VisualizerPlaceholder />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        Your code is saved in this browser as you type — each language keeps its
        own draft.
      </p>
    </Container>
  );
}
