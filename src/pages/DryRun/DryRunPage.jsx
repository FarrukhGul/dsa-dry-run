/**
 * DryRunPage — the main screen.
 *
 * It has two shapes:
 *
 *   On its own              editor | dry run
 *   Solving a problem       problem | editor | dry run
 *
 * Notice how little happens in this file even so. It asks the hooks for state
 * and hands pieces to the components that do the work. Pages arrange, features
 * work.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../../components/ui/Button.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { DryRunPanel } from "../../features/dry-run/components/DryRunPanel.jsx";
import { useDryRunner } from "../../features/dry-run/store/useDryRunner.js";
import { useStepShortcuts } from "../../features/dry-run/useStepShortcuts.js";
import { CodeEditor } from "../../features/editor/CodeEditor.jsx";
import { EditorToolbar } from "../../features/editor/EditorToolbar.jsx";
import { useCodeDraft } from "../../features/editor/useCodeDraft.js";
import { ProblemPanel } from "../../features/problems/ProblemPanel.jsx";
import { useProblemProgress } from "../../features/problems/useProblemProgress.js";
import { cx } from "../../lib/classNames.js";

/*
 * How tall the panels are.
 *
 * On a phone: a fixed chunk of the screen, so the page still scrolls normally.
 * On a laptop: whatever is left after the header and toolbar, with a floor so
 * it never collapses into a letterbox on a short window.
 */
const PANEL_HEIGHT = "h-[65vh] min-h-[420px] lg:h-[calc(100vh-13rem)]";

/*
 * The problem panel is shorter than the other two below the widest breakpoint,
 * because there it sits ABOVE them rather than beside them — a full-height
 * statement would push the editor off the screen entirely.
 */
const PROBLEM_PANEL_HEIGHT =
  "max-h-[38vh] xl:max-h-none xl:h-[calc(100vh-13rem)]";

export function DryRunPage() {
  const {
    language,
    setLanguageId,
    code,
    setCode,
    loadInto,
    resetToTemplate,
    isUnchanged,
  } = useCodeDraft();

  const runner = useDryRunner();
  const { statusOf, markAttempted, markSolved } = useProblemProgress();

  const [openedProblem, setOpenedProblem] = useState(null);
  const [mode, setMode] = useState(null); // "solve" | "solution"
  const [checkResult, setCheckResult] = useState(null); // "pass" | "fail"

  const [searchParams, setSearchParams] = useSearchParams();
  const problemId = searchParams.get("problem");
  const requestedMode = searchParams.get("mode") ?? "solve";

  /*
   * Arriving from the library as /dry-run?problem=two-sum&mode=solve
   *
   * The library is imported dynamically, so its 150 problems are downloaded
   * only by people who actually came from it.
   */
  useEffect(() => {
    if (!problemId) return;

    let cancelled = false;

    import("../../data/problems/index.js").then(({ getProblem }) => {
      if (cancelled) return;

      const problem = getProblem(problemId);

      if (problem) {
        const solving = requestedMode !== "solution";

        loadInto("javascript", solving ? problem.starter : problem.solution);
        setOpenedProblem(problem);
        setMode(solving ? "solve" : "solution");
        setCheckResult(null);
        runner.clear();

        if (solving) markAttempted(problem.id);
      }

      // Drop the parameters once used, so refreshing does not throw away
      // whatever you have since written.
      setSearchParams({}, { replace: true });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId, requestedMode]);

  /*
   * Marking a problem solved.
   *
   * "Solved" is earned, never claimed: it is set only when your own code runs
   * to completion and prints exactly what the problem expects. The same check
   * the build runs against our own solutions.
   */
  const lastCheckedTrace = useRef(null);

  useEffect(() => {
    if (!openedProblem || mode !== "solve") return;
    if (runner.status !== "ready" || runner.mode !== "run") return;

    // Only judge each finished run once.
    if (lastCheckedTrace.current === runner.trace) return;
    lastCheckedTrace.current = runner.trace;

    const printed = (runner.trace?.output ?? [])
      .map((line) => line.text)
      .join("\n");

    const correct =
      runner.trace?.status === "completed" &&
      printed === openedProblem.expectedOutput;

    setCheckResult(correct ? "pass" : "fail");
    if (correct) markSolved(openedProblem.id);
  }, [runner.status, runner.mode, runner.trace, openedProblem, mode, markSolved]);

  const sourceLines = useMemo(() => code.split("\n"), [code]);

  useStepShortcuts(runner, runner.mode === "dry-run" && runner.totalSteps > 0);

  function handleCodeChange(nextCode) {
    setCode(nextCode);
    setCheckResult(null);
    if (runner.status !== "idle") runner.clear();
  }

  function handleSelectLanguage(languageId) {
    setLanguageId(languageId);
    runner.clear();
  }

  function handleReset() {
    // Back to the starter for a problem, or the language template otherwise.
    if (openedProblem && mode === "solve") {
      loadInto("javascript", openedProblem.starter);
    } else {
      resetToTemplate();
      setOpenedProblem(null);
      setMode(null);
    }

    setCheckResult(null);
    runner.clear();
  }

  function showSolution() {
    if (!openedProblem) return;

    loadInto("javascript", openedProblem.solution);
    setMode("solution");
    setCheckResult(null);
    runner.clear();
  }

  const solving = openedProblem !== null && mode === "solve";

  return (
    <Container size="wide" className="py-6">
      {openedProblem && (
        <ProblemHeader
          problem={openedProblem}
          mode={mode}
          status={statusOf(openedProblem.id)}
          checkResult={checkResult}
          onShowSolution={showSolution}
        />
      )}

      <EditorToolbar
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onReset={handleReset}
        isUnchanged={isUnchanged}
        onRunCode={() => runner.runCode({ source: code, languageId: language.id })}
        onDryRun={() => runner.dryRun({ source: code, languageId: language.id })}
        runningMode={runner.runningMode}
      />

      {/*
        One grid, three shapes.
          phone   everything stacked
          laptop  problem full width, then editor and dry run side by side
          wide    three columns
      */}
      <div
        className={cx(
          "mt-4 grid gap-4 lg:grid-cols-2",
          solving && "xl:grid-cols-[minmax(18rem,22rem)_1fr_1fr]",
        )}
      >
        {solving && (
          <ProblemPanel
            problem={openedProblem}
            className={cx(
              "lg:col-span-2 xl:col-span-1",
              PROBLEM_PANEL_HEIGHT,
            )}
          />
        )}

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

/** The strip above the toolbar when a problem is open. */
function ProblemHeader({ problem, mode, status, checkResult, onShowSolution }) {
  return (
    <Panel className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 p-3">
      <Link
        to="/problems"
        className="shrink-0 text-xs font-medium text-brand hover:underline"
      >
        ← All problems
      </Link>

      <span className="font-hand text-lg text-text">{problem.title}</span>

      {status === "solved" && (
        <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-brand-contrast">
          ✓ solved
        </span>
      )}

      {/* Feedback from the last check, in words rather than just a colour. */}
      {checkResult === "pass" && (
        <span role="status" className="text-xs font-medium text-brand">
          Correct — that matches the expected answer.
        </span>
      )}

      {checkResult === "fail" && (
        <span role="status" className="text-xs text-muted">
          Not quite yet. Press{" "}
          <strong className="text-text">Dry Run</strong> to watch it line by
          line and see where it goes wrong.
        </span>
      )}

      {mode === "solve" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowSolution}
          title="Replace your code with the worked solution"
          className="ml-auto"
        >
          Show solution
        </Button>
      )}
    </Panel>
  );
}
