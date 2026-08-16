import { createFileRoute, redirect } from "@tanstack/react-router";

// Product editing is now handled via modal on the category detail or categories index page.
export const Route = createFileRoute("/business/products/edit/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/business/categories" });
  },
});
