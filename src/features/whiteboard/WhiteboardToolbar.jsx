/**
 * WhiteboardToolbar — the "insert a shape" strip above the canvas.
 *
 * Excalidraw already gives you rectangles and arrows. What it does not give
 * you is eight identical boxes in a row, evenly spaced, numbered underneath —
 * and drawing that by hand is a chore with nothing to do with understanding
 * the algorithm. These buttons do it in one click.
 *
 * Shapes land in the middle of wherever you are looking, not at a fixed spot,
 * so inserting one never drops it somewhere off screen.
 */

import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

import { Button } from "../../components/ui/Button.jsx";
import { DSA_SHAPES } from "./dsaShapes.js";
import { clearScene } from "./sceneStorage.js";

export function WhiteboardToolbar({ api }) {
  /** Where the middle of the visible canvas is, in the drawing's own coordinates. */
  function visibleCentre() {
    const { scrollX, scrollY, width, height, zoom } = api.getAppState();

    return {
      x: -scrollX + width / (2 * zoom.value),
      y: -scrollY + height / (2 * zoom.value),
    };
  }

  function insert(shape) {
    if (!api) return;

    const centre = visibleCentre();

    // Nudge up and left so the shape is centred rather than starting at the
    // middle and running off to the right.
    const added = convertToExcalidrawElements(
      shape.build({ x: centre.x - 180, y: centre.y - 60 }),
    );

    api.updateScene({ elements: [...api.getSceneElements(), ...added] });
  }

  function handleClear() {
    if (!api) return;

    // Wiping someone's drawing is not undoable once the page reloads, so ask.
    const confirmed = window.confirm(
      "Clear the whiteboard? This cannot be undone once you leave the page.",
    );
    if (!confirmed) return;

    api.resetScene();
    clearScene();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold tracking-wide text-muted uppercase">
        Insert
      </span>

      {DSA_SHAPES.map((shape) => (
        <Button
          key={shape.id}
          variant="secondary"
          size="sm"
          onClick={() => insert(shape)}
          disabled={!api}
          title={shape.hint}
        >
          {shape.label}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleClear}
        disabled={!api}
        title="Erase everything on the canvas"
        className="ml-auto"
      >
        Clear
      </Button>
    </div>
  );
}
