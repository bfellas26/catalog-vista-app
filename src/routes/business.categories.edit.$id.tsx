import { createFileRoute, redirect } from "@tanstack/react-router";

// Category editing is now handled via modal on the /business/categories page.
export const Route = createFileRoute("/business/categories/edit/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/business/categories" });
  },
});
