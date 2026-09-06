/**
 * ProblemBrowser — the library: eighteen patterns, collapsed by default.
 *
 * WHY ALMOST EVERYTHING STARTS CLOSED
 *
 * A hundred and fifty problems listed flat is a wall of text nobody reads.
 * Collapsed, the whole curriculum fits on one screen — you can see the shape
 * of what there is to learn, and open the one part you want.
 *
 * The first topic is the exception: it opens on arrival, so the page never
 * greets you with eighteen closed rows and no idea what is inside them.
 *
 * Searching opens every topic that matches, because a closed topic hiding
 * your search result would be infuriating.
 *
 * Clicking a problem does not open it. It opens a dialog asking whether you
 * want to try it or read the answer — see ProblemDialog for why.
 */

import { useMemo, useState } from "react";

import { Panel } from "../../components/ui/Panel.jsx";
import { cx } from "../../lib/classNames.js";
import { DIFFICULTIES } from "../../data/problems/topics.js";
import { ProblemDialog } from "./ProblemDialog.jsx";
import { ProgressBar, ProgressRing, StatusMark } from "./Progress.jsx";
import { useProblemProgress } from "./useProblemProgress.js";

const difficultyStyles = {
  easy: "text-[#1a7f64] dark:text-[#6cc79b]",
  medium: "text-[#b8590a] dark:text-[#e0a86a]",
  hard: "text-[#c0392b] dark:text-[#ff8a80]",
};

export function ProblemBrowser({ groups, total }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  /*
   * The first topic starts open.
   *
   * Landing on a page of eighteen closed rows leaves you with nothing to look
   * at and no obvious next move. One open topic shows what a problem row looks
   * like, which makes the rest self-explanatory.
   */
  const [openTopics, setOpenTopics] = useState(
    () => new Set(groups.length > 0 ? [groups[0].topic.id] : []),
  );
  const [chosen, setChosen] = useState(null);

  const { statusOf, summarise } = useProblemProgress();

  const everything = useMemo(
    () => groups.flatMap((group) => group.problems),
    [groups],
  );
  const overall = summarise(everything);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return groups
      .map((group) => ({
        topic: group.topic,
        problems: group.problems.filter((problem) => {
          if (difficulty !== "all" && problem.difficulty !== difficulty) {
            return false;
          }

          if (query === "") return true;

          // Search titles, summaries AND the pattern name, so "window" finds
          // the sliding window set even though none of them say it.
          return (
            problem.title.toLowerCase().includes(query) ||
            problem.summary.toLowerCase().includes(query) ||
            group.topic.label.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((group) => group.problems.length > 0);
  }, [groups, search, difficulty]);

  // While filtering, every matching topic opens — a closed topic hiding a hit
  // would look like the search had failed.
  const isFiltering = search.trim() !== "" || difficulty !== "all";

  function toggleTopic(topicId) {
    setOpenTopics((current) => {
      const next = new Set(current);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }

  return (
    <>
      {/* ---- Progress ------------------------------------------------ */}
      <Panel className="mt-8 flex flex-wrap items-center gap-6 p-6">
        <ProgressRing
          solved={overall.solved}
          attempted={overall.attempted}
          total={overall.total}
        />

        <div className="min-w-[12rem] flex-1">
          <h2 className="font-hand text-xl text-text">Your progress</h2>

          <p className="mt-1 text-sm leading-relaxed text-muted">
            {overall.solved === 0
              ? "Nothing solved yet. A problem counts as solved when your own code produces the right answer — not when you look at ours."
              : `${overall.solved} solved, ${overall.attempted} in progress. Saved in this browser only.`}
          </p>

          <ProgressBar
            solved={overall.solved}
            attempted={overall.attempted}
            total={overall.total}
            className="mt-4"
          />
        </div>
      </Panel>

      {/* ---- Controls ------------------------------------------------ */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search problems…"
          aria-label="Search problems"
          className="h-10 flex-1 rounded-lg border border-border bg-raised px-3 text-sm text-text placeholder:text-muted focus:border-brand focus:outline-none"
        />

        <div
          role="group"
          aria-label="Filter by difficulty"
          className="flex gap-1 rounded-lg bg-surface p-1"
        >
          {[{ id: "all", label: "All" }, ...DIFFICULTIES].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setDifficulty(option.id)}
              aria-pressed={difficulty === option.id}
              className={cx(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                difficulty === option.id
                  ? "bg-raised text-text shadow-card"
                  : "text-muted hover:text-text",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- The topics ---------------------------------------------- */}
      {filtered.length === 0 ? (
        <Panel className="mt-6 p-8 text-center">
          <p className="text-sm text-muted">
            Nothing matches. Try a pattern name like{" "}
            <em className="text-text">sliding window</em>, or clear the filters.
          </p>
        </Panel>
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.map((group) => (
            <TopicSection
              key={group.topic.id}
              group={group}
              isOpen={isFiltering || openTopics.has(group.topic.id)}
              onToggle={() => toggleTopic(group.topic.id)}
              summary={summarise(group.problems)}
              statusOf={statusOf}
              onChoose={setChosen}
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Showing{" "}
        {filtered.reduce((count, group) => count + group.problems.length, 0)} of{" "}
        {total} problems
      </p>

      {chosen && (
        <ProblemDialog
          problem={chosen}
          status={statusOf(chosen.id)}
          onClose={() => setChosen(null)}
        />
      )}
    </>
  );
}

/** One collapsible pattern, with its own progress bar. */
function TopicSection({ group, isOpen, onToggle, summary, statusOf, onChoose }) {
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const problem of group.problems) {
    counts[problem.difficulty] = (counts[problem.difficulty] ?? 0) + 1;
  }

  return (
    <Panel className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-surface"
      >
        {/* The arrow turns rather than being swapped, so the change reads as
            one thing opening instead of two icons flickering. */}
        <span
          aria-hidden="true"
          className={cx(
            "shrink-0 text-xs text-muted transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        >
          ▶
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-hand text-xl text-text">
            {group.topic.label}
          </span>

          <span className="mt-0.5 block text-xs text-muted">
            {counts.easy > 0 && `${counts.easy} easy`}
            {counts.easy > 0 && (counts.medium > 0 || counts.hard > 0) && " · "}
            {counts.medium > 0 && `${counts.medium} medium`}
            {counts.medium > 0 && counts.hard > 0 && " · "}
            {counts.hard > 0 && `${counts.hard} hard`}
          </span>
        </span>

        <span className="hidden w-32 shrink-0 sm:block">
          <ProgressBar {...summary} />
        </span>

        <span className="shrink-0 font-mono text-xs text-muted tabular-nums">
          {summary.solved}/{summary.total}
        </span>
      </button>

      {isOpen && (
        <ul className="border-t border-border">
          {group.problems.map((problem) => (
            <li key={problem.id}>
              <button
                type="button"
                onClick={() => onChoose(problem)}
                className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface"
              >
                <StatusMark status={statusOf(problem.id)} />

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-text">
                    {problem.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-muted">
                    {problem.summary}
                  </span>
                </span>

                <span
                  className={cx(
                    "shrink-0 text-[11px] font-medium capitalize",
                    difficultyStyles[problem.difficulty],
                  )}
                >
                  {problem.difficulty}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
