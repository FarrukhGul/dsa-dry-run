/**
 * Whiteboard — the drawing canvas.
 *
 * This is Excalidraw itself, embedded. Excalidraw is open source under the MIT
 * licence, so rather than imitating its look we run the real thing: the same
 * hand-drawn strokes, the same fonts, the same tools. Reimplementing it would
 * have taken months and been worse.
 *
 * What we add on top is small and specific:
 *   · it follows the site's light/dark toggle instead of having its own
 *   · it saves to your browser, so a sketch survives a refresh
 *   · a row of ready-made DSA shapes above it
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

import { useTheme } from "../../hooks/useTheme.js";
import { WhiteboardToolbar } from "./WhiteboardToolbar.jsx";
import { createSceneSaver, loadScene } from "./sceneStorage.js";

/*
 * Excalidraw's own stylesheet.
 *
 * It is imported here rather than in our global CSS so it travels with this
 * page's chunk — nobody who never opens the whiteboard has to download it.
 */
import "@excalidraw/excalidraw/index.css";

/**
 * Which of Excalidraw's built-in buttons to show.
 *
 * The theme toggle is switched off deliberately: the site header already owns
 * that choice, and two toggles that disagree with each other is worse than
 * one.
 */
const UI_OPTIONS = {
  canvasActions: {
    changeViewBackgroundColor: true,
    clearCanvas: true,
    export: { saveFileToDisk: true },
    loadScene: true,
    saveToActiveFile: false,
    toggleTheme: false,
  },
};

export function Whiteboard() {
  const { theme } = useTheme();

  // Excalidraw hands us its API object once it has mounted. The toolbar needs
  // it to add shapes, so it starts null and the buttons stay disabled until
  // it arrives.
  const [api, setApi] = useState(null);

  /*
   * The saved drawing, read once.
   *
   * Excalidraw only looks at `initialData` when it first mounts, and reading
   * storage on every render would be wasted work — so this is deliberately not
   * meant to update.
   */
  const initialData = useMemo(() => loadScene() ?? undefined, []);

  const saverRef = useRef(null);
  if (saverRef.current === null) {
    saverRef.current = createSceneSaver();
  }

  // Stop the pending save when the page is left, so it cannot fire against a
  // whiteboard that is no longer on screen.
  useEffect(() => {
    const saver = saverRef.current;
    return () => saver.cancel();
  }, []);

  return (
    <div className="flex h-full flex-col gap-3">
      <WhiteboardToolbar api={api} />

      {/* Excalidraw fills its container, so the container needs a real height.
          `min-h-0` lets it shrink inside the flex column rather than pushing
          the toolbar off the top. */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border">
        <Excalidraw
          excalidrawAPI={setApi}
          initialData={initialData}
          theme={theme}
          onChange={(elements, appState) =>
            saverRef.current.save(elements, appState)
          }
          UIOptions={UI_OPTIONS}
          name="DryRun whiteboard"
        />
      </div>
    </div>
  );
}
