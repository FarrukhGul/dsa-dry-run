/**
 * AppRoutes — the site map. Every address the app answers to is listed here.
 *
 * Reading it top to bottom tells you every page that exists:
 *   /             the landing page
 *   /dry-run      the editor + step-by-step visualiser
 *   /whiteboard   the Excalidraw drawing board
 *   /problems     the problem library
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
import { ProblemsPage } from "../pages/Problems/ProblemsPage.jsx";

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

export function AppRoutes() {
  return (
    // <Suspense> shows the fallback while a lazily-loaded page downloads.
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dry-run" element={<DryRunPage />} />
        <Route path="/whiteboard" element={<WhiteboardPage />} />
        <Route path="/problems" element={<ProblemsPage />} />

        {/* "*" means "anything that didn't match above". */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
