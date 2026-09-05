/**
 * App — the frame that every page sits inside.
 *
 * It is deliberately tiny. All it does is stack three things vertically:
 *
 *   Header      always visible, sticks to the top
 *   AppRoutes   the current page, whichever one that is
 *   Footer      always visible, at the bottom
 *
 * If you are looking for actual features, they are in src/features/.
 */

import { Footer } from "./components/layout/Footer.jsx";
import { Header } from "./components/layout/Header.jsx";
import { AppRoutes } from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    // `min-h-screen` + `flex-1` on the main area keeps the footer at the bottom
    // even on short pages.
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}
