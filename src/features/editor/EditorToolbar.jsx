/**
 * EditorToolbar — the strip above the editor: language on the left, actions on
 * the right.
 *
 * The "Dry Run" button is switched off until the engine exists (Phase 2). It is
 * shown rather than hidden on purpose — the point of the app should be visible
 * from the first screen, and its tooltip says plainly why it cannot be pressed
 * yet.
 */

import { Button } from "../../components/ui/Button.jsx";
import { LanguagePicker } from "./LanguagePicker.jsx";

export function EditorToolbar({
  language,
  onSelectLanguage,
  onReset,
  isUnchanged,
}) {
  const dryRunDisabledReason = language.canDryRun
    ? "The dry run engine is being built — Phase 2."
    : `The dry run engine for ${language.label} is not built yet. JavaScript is first.`;

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

        <Button size="sm" disabled title={dryRunDisabledReason}>
          Dry Run
        </Button>
      </div>
    </div>
  );
}
