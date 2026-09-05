/**
 * sceneStorage.js — remembers your drawing between visits.
 *
 * The whiteboard saves to your own browser and nowhere else. Close the tab,
 * come back tomorrow, and the sketch is still there. Nothing is uploaded, and
 * there is no account.
 *
 * TWO THINGS THAT MATTER HERE
 *
 * Only part of the app state is saved. Excalidraw's live state holds things
 * that cannot survive being turned into text — a Map of collaborators, the
 * current pointer — and trying to save them throws. So we pick out the handful
 * of fields worth keeping and leave the rest to Excalidraw's own defaults.
 *
 * Saving is delayed. `onChange` fires on every mouse move while you drag a
 * shape; writing to storage that often would make dragging stutter. Instead we
 * wait until you have paused.
 */

const STORAGE_KEY = "dsa-dry-run:whiteboard";

/** How long to wait after the last change before saving, in milliseconds. */
const SAVE_DELAY = 600;

/**
 * The app state worth keeping.
 *
 * Deliberately small: where you had scrolled to, how far you were zoomed in,
 * and the canvas settings you had chosen. Everything else is either transient
 * or cannot be serialised.
 */
function pickSavableState(appState) {
  return {
    viewBackgroundColor: appState.viewBackgroundColor,
    gridSize: appState.gridSize,
    gridModeEnabled: appState.gridModeEnabled,
    scrollX: appState.scrollX,
    scrollY: appState.scrollY,
    zoom: appState.zoom,
    currentItemStrokeColor: appState.currentItemStrokeColor,
    currentItemBackgroundColor: appState.currentItemBackgroundColor,
    currentItemFontFamily: appState.currentItemFontFamily,
  };
}

/**
 * Reads the saved drawing.
 * @returns {{elements: Array, appState: object}|null} null when there is none
 */
export function loadScene() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const scene = JSON.parse(saved);

    // Storage is editable by hand, so never trust its shape.
    if (!Array.isArray(scene?.elements)) return null;

    return {
      elements: scene.elements,
      appState: scene.appState ?? {},
    };
  } catch {
    // Blocked storage, or a saved scene from an older version that no longer
    // parses. Starting with a blank canvas is the right fallback.
    return null;
  }
}

/**
 * Creates a save function that waits until the drawing settles.
 *
 * Each returned saver owns its own timer, so mounting the whiteboard twice
 * never leaves a stray one running.
 *
 * @returns {{save: Function, cancel: Function}}
 */
export function createSceneSaver() {
  let timer = null;

  function save(elements, appState) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            // Deleted elements stay in Excalidraw's array so that undo works.
            // They are of no use once the page is closed, so drop them and
            // keep the saved scene small.
            elements: elements.filter((element) => !element.isDeleted),
            appState: pickSavableState(appState),
          }),
        );
      } catch {
        // Storage full or blocked. The drawing still works for this visit; it
        // just will not be waiting next time. Not worth interrupting anyone.
      }
    }, SAVE_DELAY);
  }

  function cancel() {
    clearTimeout(timer);
  }

  return { save, cancel };
}

/** Forgets the saved drawing. Used by the Clear button. */
export function clearScene() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing we can do, and nothing that needs saying.
  }
}
