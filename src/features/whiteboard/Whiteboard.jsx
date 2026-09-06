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

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
/**
 * How far apart the dots are, in Excalidraw's own scene units.
 *
 * Scene units rather than pixels is the whole point: the paper is measured in
 * the same coordinates as your drawing, so a dot stays under the same part of
 * a shape however far you zoom.
 */
const DOT_SPACING = 22;

/**
 * Excalidraw's out-of-the-box canvas colours.
 *
 * Finding one of these in storage tells us nothing about what anyone wanted —
 * it is just the default, saved automatically. Anything else was picked on
 * purpose from the canvas background control.
 */
const DEFAULT_BACKGROUNDS = new Set([
  "transparent",
  "#ffffff",
  "#fff",
  "white",
  "#121212",
]);

/** The saved background if it was deliberately chosen, otherwise transparent. */
function chosenBackground(saved) {
  if (!saved) return "transparent";
  return DEFAULT_BACKGROUNDS.has(saved.trim().toLowerCase())
    ? "transparent"
    : saved;
}

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

  // The dotted paper. Written to directly rather than through React state:
  // panning fires onChange on every frame, and re-rendering the whole
  // whiteboard that often would be a disaster.
  const dotsRef = useRef(null);

  /*
   * The saved drawing, read once.
   *
   * Excalidraw only looks at `initialData` when it first mounts, and reading
   * storage on every render would be wasted work — so this is deliberately not
   * meant to update.
   */
  const initialData = useMemo(() => {
    const saved = loadScene();

    return {
      ...(saved ?? {}),
      appState: {
        ...(saved?.appState ?? {}),

        /*
         * A transparent canvas, so the dotted paper behind it shows through.
         *
         * The subtlety: the scene saver stores the background colour on every
         * change, so simply having opened the whiteboard once leaves
         * Excalidraw's default white sitting in storage. Treating that as "a
         * choice the user made" would hide the dots from everybody who had
         * ever visited before — which is exactly what happened.
         *
         * So a default is not a choice. Only a colour the user actually picked
         * survives, and the dots sit behind it.
         */
        viewBackgroundColor: chosenBackground(
          saved?.appState?.viewBackgroundColor,
        ),
      },
    };
  }, []);

  /**
   * Moves the dots with the drawing.
   *
   * Excalidraw places a point of your drawing on screen at
   * `(sceneX + scrollX) * zoom`, so the paper has to follow the same rule:
   *
   *   spacing   22 scene units, which is 22 x zoom on screen
   *   offset    where the origin has been dragged to, wrapped into one tile
   *
   * Wrapping with modulo is what makes this cheap. The pattern repeats every
   * tile, so shifting it by one whole tile looks identical to not shifting it
   * at all — meaning the offset never has to grow beyond a single tile's width
   * no matter how far you pan.
   */
  function syncPaper(appState) {
    const dots = dotsRef.current;
    if (!dots || !appState) return;

    const zoom = appState.zoom?.value ?? 1;
    const spacing = DOT_SPACING * zoom;

    // The extra `+ spacing` before the second modulo keeps the result positive
    // when you pan the other way; JavaScript's % can return a negative.
    const offsetX = (((appState.scrollX * zoom) % spacing) + spacing) % spacing;
    const offsetY = (((appState.scrollY * zoom) % spacing) + spacing) % spacing;

    dots.style.backgroundSize = `${spacing}px ${spacing}px`;
    dots.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  }

  // Line the paper up with wherever the saved scene left the canvas, before
  // the first frame is painted rather than after it.
  useLayoutEffect(() => {
    if (api) syncPaper(api.getAppState());
  }, [api]);

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
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-bg">
        {/*
          The dotted paper, as its own layer behind the canvas.

          Separate rather than a background on the container, so that redrawing
          it as you pan never forces the canvas above it to be redrawn too.
        */}
        <div
          ref={dotsRef}
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute inset-0"
        />

        <div className="relative h-full">
          <Excalidraw
            excalidrawAPI={setApi}
            initialData={initialData}
            theme={theme}
            onChange={(elements, appState) => {
              syncPaper(appState);
              saverRef.current.save(elements, appState);
            }}
            UIOptions={UI_OPTIONS}
            name="DryRun whiteboard"
          />
        </div>
      </div>
    </div>
  );
}
