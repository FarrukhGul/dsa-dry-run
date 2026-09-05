/**
 * HeroPreview — the picture on the landing page showing what a dry run
 * looks like.
 *
 * IMPORTANT: this is a still image made of HTML, not the real thing. It is
 * hard-coded so the landing page stays instant and works before the engine is
 * built. The real version arrives in Phase 3 and will replace this file.
 *
 * It is marked `aria-hidden` because it is decoration — the paragraph next to
 * it already explains the idea for screen reader users.
 */

import { Panel } from "../../components/ui/Panel.jsx";

/** The fake code on screen. `active: true` marks the line being executed. */
const codeLines = [
  { text: "function twoSum(nums, target) {" },
  { text: "  const seen = new Map();" },
  { text: "  for (let i = 0; i < nums.length; i++) {" },
  { text: "    const need = target - nums[i];", active: true },
  { text: "    if (seen.has(need)) return [seen.get(need), i];" },
  { text: "    seen.set(nums[i], i);" },
  { text: "  }" },
  { text: "}" },
];

/** The array being walked, and which index the pointer `i` is sitting on. */
const arrayValues = [3, 1, 4, 1, 5];
const pointerIndex = 2;

/** What the variables panel shows at this exact step. */
const variables = [
  { name: "i", value: "2" },
  { name: "need", value: "5" },
  { name: "seen", value: "{3 → 0, 1 → 1}" },
];

export function HeroPreview() {
  return (
    <Panel className="overflow-hidden" aria-hidden="true">
      {/* Title bar, like the top of an editor window */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 font-mono text-xs text-muted">two-sum.js</span>
        <span className="ml-auto font-mono text-xs text-brand">step 14 / 47</span>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-[1.15fr_1fr]">
        {/* Left: the code, with the current line highlighted */}
        <div className="bg-raised p-4">
          <pre className="overflow-x-auto font-mono text-[13px] leading-6">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={
                  line.active
                    ? "-mx-2 rounded bg-brand-tint px-2 text-text"
                    : "-mx-2 px-2 text-muted"
                }
              >
                <span className="mr-4 inline-block w-4 text-right text-muted/60">
                  {index + 1}
                </span>
                {line.text}
              </div>
            ))}
          </pre>
        </div>

        {/* Right: what the variables look like at this step */}
        <div className="space-y-5 bg-raised p-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
              Variables
            </p>

            <div className="space-y-1.5 font-mono text-[13px]">
              {variables.map((variable) => (
                <div key={variable.name} className="flex gap-2">
                  <span className="text-brand">{variable.name}</span>
                  <span className="text-muted">=</span>
                  <span className="truncate text-text">{variable.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
              nums
            </p>

            {/* The array drawn as cells, with the pointer under index 2 */}
            <div className="flex gap-1">
              {arrayValues.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={
                      index === pointerIndex
                        ? "flex h-9 w-9 items-center justify-center rounded-md border-2 border-brand bg-brand-tint font-mono text-sm text-text"
                        : "flex h-9 w-9 items-center justify-center rounded-md border border-border font-mono text-sm text-muted"
                    }
                  >
                    {value}
                  </div>

                  <span className="font-mono text-[10px] text-muted/60">
                    {index}
                  </span>

                  {/* The pointer label sits under the cell it points at */}
                  {index === pointerIndex && (
                    <span className="font-mono text-[11px] text-brand">i</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: the plain-English explanation of this step */}
      <div className="border-t border-border bg-surface px-4 py-3 text-sm text-muted">
        <span className="text-brand">→</span> <code>need</code> becomes{" "}
        <code className="text-text">5</code>, because{" "}
        <code className="text-text">target (9)</code> minus{" "}
        <code className="text-text">nums[2] (4)</code> is{" "}
        <code className="text-text">5</code>.
      </div>
    </Panel>
  );
}
