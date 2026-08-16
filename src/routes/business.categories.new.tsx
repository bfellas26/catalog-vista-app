import { createFileRoute, redirect } from "@tanstack/react-router";

// Category creation is now handled via modal on the /business/categories page.
export const Route = createFileRoute("/business/categories/new")({
  beforeLoad: () => {
    throw redirect({ to: "/business/categories" });
  },
});
