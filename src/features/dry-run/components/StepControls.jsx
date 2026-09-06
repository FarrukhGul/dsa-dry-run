/**
 * StepControls — moving through a recorded run.
 *
 * Previous and Next are the whole point, so they are large, labelled, and sit
 * at the top with nothing competing with them. The idea is that you press Next
 * and read, press Next and read — the same rhythm as working down a page with
 * a pencil.
 *
 * Playing the run automatically is a convenience, not the main event, so it
 * lives underneath with the other secondary controls. Watching an animation go
 * past is not the same as following it.
 *
 * The arrow keys do the same thing, which is faster still once you are in it.
 */

import { cx } from "../../../lib/classNames.js";

const SPEEDS = [
  { id: "slow", label: "0.5×" },
  { id: "normal", label: "1×" },
  { id: "fast", label: "3×" },
];

export function StepControls({ runner }) {
  const {
    stepIndex,
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    goTo,
    next,
    previous,
    first,
    last,
  } = runner;

  const atStart = stepIndex === 0;
  const atEnd = stepIndex >= totalSteps - 1;

  return (
    <div className="space-y-2.5 border-b border-border p-3">
      {/* The main event. */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={previous}
          disabled={atStart}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-raised text-sm font-medium text-text transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
        >
          <span aria-hidden="true">◀</span> Previous
        </button>

        <span className="shrink-0 px-1 text-center font-mono text-xs text-muted tabular-nums">
          {totalSteps === 0 ? 0 : stepIndex + 1}
          <span className="text-muted/60"> / {totalSteps}</span>
        </span>

        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand text-sm font-medium text-brand-contrast shadow-card transition-colors hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-40"
        >
          Next <span aria-hidden="true">▶</span>
        </button>
      </div>

      {/* Jump anywhere in the run. */}
      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={stepIndex}
        onChange={(event) => goTo(Number(event.target.value))}
        disabled={totalSteps === 0}
        aria-label="Jump to any step"
        className="w-full accent-brand"
      />

      {/* Everything secondary. */}
      <div className="flex flex-wrap items-center gap-1">
        <SmallButton onClick={first} disabled={atStart} label="Back to the first step">
          ⏮
        </SmallButton>

        <SmallButton onClick={last} disabled={atEnd} label="Skip to the last step">
          ⏭
        </SmallButton>

        <SmallButton
          onClick={togglePlay}
          disabled={totalSteps === 0 || atEnd}
          label={isPlaying ? "Pause" : "Play the run through"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </SmallButton>

        {SPEEDS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSpeed(option.id)}
            aria-pressed={speed === option.id}
            title={`Playback speed ${option.label}`}
            className={cx(
              "rounded px-1.5 py-1 font-mono text-[11px] transition-colors",
              speed === option.id
                ? "bg-brand-tint text-brand"
                : "text-muted hover:text-text",
            )}
          >
            {option.label}
          </button>
        ))}

        <span className="ml-auto hidden text-[11px] text-muted sm:inline">
          or use ← and →
        </span>
      </div>
    </div>
  );
}

function SmallButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded text-[11px] text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
