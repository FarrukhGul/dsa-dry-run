/**
 * EditorToolbar — the strip above the editor: language on the left, actions on
 * the right.
 *
 * Two ways to run, because they answer different questions:
 *
 *   Run Code   "does this work, and what does it print?"
 *              Runs start to finish and shows the output and any errors.
 *
 *   Dry Run    "why does this not work?"
 *              Records every line so you can step through it afterwards.
 *
 * Dry Run is the primary button because it is what the site is for, but Run
 * Code is the one you reach for more often once your code is nearly right.
 */

import { Button } from "../../components/ui/Button.jsx";
import { LanguagePicker } from "./LanguagePicker.jsx";

export function EditorToolbar({
  language,
  onSelectLanguage,
  onReset,
  isUnchanged,
  onRunCode,
  onDryRun,
  runningMode,
}) {
  const isBusy = runningMode !== null && runningMode !== undefined;
  const canRun = language.canDryRun && !isBusy;

  const unavailableReason = `The engine for ${language.label} is not built yet. JavaScript works today.`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <LanguagePicker selectedId={language.id} onSelect={onSelectLanguage} />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isUnchanged}
          title={
            isUnchanged
              ? "Already showing the starter code"
              : "Put the starter code back"
          }
        >
          Reset
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onRunCode}
          disabled={!canRun}
          title={
            language.canDryRun
              ? "Run it start to finish and show what it prints"
              : unavailableReason
          }
        >
          {runningMode === "run" ? "Running…" : "Run Code"}
        </Button>

        <Button
          size="sm"
          onClick={onDryRun}
          disabled={!canRun}
          title={
            language.canDryRun
              ? "Record every line, then step through it"
              : unavailableReason
          }
        >
          {runningMode === "dry-run" ? "Recording…" : "Dry Run"}
        </Button>
      </div>
    </div>
  );
}
