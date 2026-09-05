/**
 * WhiteboardPage — a hand-drawn canvas for sketching an approach.
 *
 * Thin, like every page: it gives the whiteboard a height to fill and gets out
 * of the way. Everything else lives in features/whiteboard/.
 */

import { Container } from "../../components/ui/Container.jsx";
import { Whiteboard } from "../../features/whiteboard/Whiteboard.jsx";

/*
 * Tall enough to draw in, with a floor so it does not collapse on a short
 * window. The subtraction accounts for the header, the page padding and the
 * note underneath.
 */
const CANVAS_HEIGHT = "h-[calc(100vh-11rem)] min-h-[500px]";

export function WhiteboardPage() {
  return (
    <Container size="wide" className="py-6">
      <div className={CANVAS_HEIGHT}>
        <Whiteboard />
      </div>

      <p className="mt-3 text-xs text-muted">
        Your drawing is saved in this browser as you work — it is never
        uploaded. Use the menu inside the canvas to export it as a PNG or SVG.
      </p>
    </Container>
  );
}
