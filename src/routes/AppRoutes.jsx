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
import { WhiteboardPage } from "../pages/Whiteboard/WhiteboardPage.jsx";

/*
 * The dry run page is loaded LAZILY — its code is only downloaded when someone
 * actually opens /dry-run.
 *
 * Why: it contains the Monaco code editor, which is by far the biggest thing in
 * the app. Loading it up front would make the landing page slow for everyone,
 * including visitors who only came to read about the project.
 */
const DryRunPage = lazy(() =>
  import("../pages/DryRun/DryRunPage.jsx").then((module) => ({
    default: module.DryRunPage,
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
