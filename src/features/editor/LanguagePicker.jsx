/**
 * LanguagePicker — the row of language buttons above the editor.
 *
 * Languages whose dry run engine is not built yet are still selectable — you
 * can type and get syntax colours in all four. They just carry a small dot
 * marking them as editor-only for now, explained on hover.
 */

import { cx } from "../../lib/classNames.js";
import { LANGUAGES } from "./languages.js";

export function LanguagePicker({ selectedId, onSelect }) {
  return (
    <div
      // `role="group"` plus a label tells screen readers these buttons belong
      // together and what they are for.
      role="group"
      aria-label="Programming language"
      className="flex gap-1 overflow-x-auto rounded-lg bg-surface p-1"
    >
      {LANGUAGES.map((language) => {
        const isSelected = language.id === selectedId;

        return (
          <button
            key={language.id}
            type="button"
            onClick={() => onSelect(language.id)}
            // `aria-pressed` is how a screen reader announces "this one is on".
            aria-pressed={isSelected}
            title={
              language.canDryRun
                ? `${language.label} — ready to dry run`
                : `${language.label} — you can write it here, but the dry run engine for it is still being built`
            }
            className={cx(
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isSelected
                ? "bg-raised text-text shadow-card"
                : "text-muted hover:text-text",
            )}
          >
            {language.label}

            {!language.canDryRun && (
              // Decorative: the title above already explains it in words.
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-muted/50"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
