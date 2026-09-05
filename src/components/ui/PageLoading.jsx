/**
 * PageLoading — shown for the moment while a lazily-loaded page downloads.
 *
 * See src/routes/AppRoutes.jsx, where the dry run page is loaded on demand.
 */

import { Container } from "./Container.jsx";

export function PageLoading() {
  return (
    <Container className="py-28 text-center">
      {/* role="status" tells screen readers that something is loading. */}
      <div role="status" className="text-sm text-muted">
        <span className="mx-auto mb-4 block h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
        Loading the editor…
      </div>
    </Container>
  );
}
