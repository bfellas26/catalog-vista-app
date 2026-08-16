import { createFileRoute, redirect } from "@tanstack/react-router";

// Product creation is now handled via modal on the category detail or categories index page.
export const Route = createFileRoute("/business/products/new")({
  beforeLoad: () => {
    throw redirect({ to: "/business/categories" });
  },
});
