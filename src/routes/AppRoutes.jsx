/**
 * AppRoutes — the site map. Every address the app answers to is listed here.
 *
 * Reading it top to bottom tells you every page that exists:
 *   /             the landing page
 *   /dry-run      the editor + step-by-step visualiser
 *   /whiteboard   the Excalidraw drawing board
 *   /problems     the problem library
 *   /developer    who built it
 *   anything else a friendly "page not found"
 *
 * Adding a page takes two edits: add a <Route> here, and add a link in
 * src/components/layout/Header.jsx.
 */

import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { PageLoading } from "../components/ui/PageLoading.jsx";
import { HomePage } from "../pages/Home/HomePage.jsx";
import { NotFoundPage } from "../pages/NotFound/NotFoundPage.jsx";

/*
 * The two heavy pages are loaded LAZILY — their code is only downloaded when
 * somebody actually opens them.
 *
 * Why: the dry run page carries the code editor and the whiteboard carries the
 * whole of Excalidraw. Either one loaded up front would make the landing page
 * slow for everybody, including visitors who only came to read about the
 * project. Keeping them apart is what holds the first page under 80 KB.
 */
const DryRunPage = lazy(() =>
  import("../pages/DryRun/DryRunPage.jsx").then((module) => ({
    default: module.DryRunPage,
  })),
);

const WhiteboardPage = lazy(() =>
  import("../pages/Whiteboard/WhiteboardPage.jsx").then((module) => ({
    default: module.WhiteboardPage,
  })),
);

// The problem library is lazy too: 150 worked solutions is a lot of text, and
// nobody browsing the home page needs it.
const ProblemsPage = lazy(() =>
  import("../pages/Problems/ProblemsPage.jsx").then((module) => ({
    default: module.ProblemsPage,
  })),
);

// The developer page is lazy for the same reason: it carries GSAP, which
// nothing else on the site uses. Loading an animation library for visitors who
// never open this one page would be a poor trade.
const DeveloperPage = lazy(() =>
  import("../pages/Developer/DeveloperPage.jsx").then((module) => ({
    default: module.DeveloperPage,
  })),
);

export function AppRoutes() {
  return (
    // <Suspense> shows the fallback while a lazily-loaded page downloads.
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dry-run" element={<DryRunPage />} />
        <Route path="/whiteboard" element={<WhiteboardPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/developer" element={<DeveloperPage />} />

        {/* "*" means "anything that didn't match above". */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
