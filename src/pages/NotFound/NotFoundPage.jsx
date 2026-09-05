/**
 * NotFoundPage — shown when the address in the URL bar matches no page.
 *
 * It gives people a way back rather than leaving them at a dead end.
 */

import { Button } from "../../components/ui/Button.jsx";
import { Container } from "../../components/ui/Container.jsx";

export function NotFoundPage() {
  return (
    <Container className="py-28 text-center">
      <p className="font-hand text-6xl text-brand">404</p>

      <h1 className="mt-4 font-hand text-3xl text-text">
        This page took a wrong turn.
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
        The address you followed does not match any page here.
      </p>

      <Button to="/" className="mt-8">
        Back to home
      </Button>
    </Container>
  );
}
