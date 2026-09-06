/**
 * Progress.jsx — the ring at the top of the library and the bars on each topic.
 *
 * Both animate by transitioning a single CSS property, which the browser can
 * hand to the compositor. No animation library is loaded for this page; a
 * number counting up does not justify 35 KB.
 *
 * The ring is drawn as an SVG circle with a dashed outline, where the dash is
 * exactly as long as the portion to fill. Moving the dash's offset is what
 * makes it sweep round.
 */

import { cx } from "../../lib/classNames.js";

/**
 * A circular progress dial.
 *
 * @param {number} solved    how many are done
 * @param {number} total     how many there are
 * @param {number} attempted how many were started but not finished
 */
export function ProgressRing({ solved, attempted, total, size = 112 }) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const solvedFraction = total === 0 ? 0 : solved / total;
  // Attempted is drawn behind solved, so the arcs stack rather than overlap.
  const startedFraction = total === 0 ? 0 : (solved + attempted) / total;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`${solved} of ${total} problems solved`}
        // Rotated so the arc starts at the top rather than at three o'clock.
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />

        <Arc
          size={size}
          radius={radius}
          stroke={stroke}
          circumference={circumference}
          fraction={startedFraction}
          colour="var(--brand)"
          opacity={0.3}
        />

        <Arc
          size={size}
          radius={radius}
          stroke={stroke}
          circumference={circumference}
          fraction={solvedFraction}
          colour="var(--brand)"
        />
      </svg>

      {/* The number sits in the middle of the ring. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-hand text-2xl leading-none text-text tabular-nums">
          {solved}
        </span>
        <span className="text-[11px] text-muted">of {total}</span>
      </div>
    </div>
  );
}

function Arc({ size, radius, stroke, circumference, fraction, colour, opacity = 1 }) {
  return (
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={colour}
      strokeWidth={stroke}
      strokeLinecap="round"
      // The dash is one full circle long, and the offset hides the part that
      // is not filled. Transitioning the offset is what animates the sweep.
      strokeDasharray={circumference}
      strokeDashoffset={circumference * (1 - fraction)}
      opacity={opacity}
      style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.2,.7,.3,1)" }}
    />
  );
}

/** A slim bar, used on each topic row. */
export function ProgressBar({ solved, attempted, total, className }) {
  const solvedPercent = total === 0 ? 0 : (solved / total) * 100;
  const startedPercent = total === 0 ? 0 : ((solved + attempted) / total) * 100;

  return (
    <div
      className={cx(
        "h-1.5 w-full overflow-hidden rounded-full bg-border",
        className,
      )}
      role="progressbar"
      aria-valuenow={solved}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${solved} of ${total} solved`}
    >
      {/* Attempted sits underneath, so solved paints over the top of it. */}
      <div className="relative h-full">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand/30"
          style={{
            width: `${startedPercent}%`,
            transition: "width 600ms cubic-bezier(.2,.7,.3,1)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand"
          style={{
            width: `${solvedPercent}%`,
            transition: "width 600ms cubic-bezier(.2,.7,.3,1)",
          }}
        />
      </div>
    </div>
  );
}

/** The tick or dot beside a problem in the list. */
export function StatusMark({ status }) {
  if (status === "solved") {
    return (
      <span
        title="Solved"
        aria-label="Solved"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] text-brand-contrast"
      >
        ✓
      </span>
    );
  }

  if (status === "attempted") {
    return (
      <span
        title="Attempted"
        aria-label="Attempted"
        className="h-5 w-5 shrink-0 rounded-full border-2 border-brand/50"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 shrink-0 rounded-full border border-border"
    />
  );
}
