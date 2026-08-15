import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/business/products/")({
  beforeLoad: () => {
    throw redirect({ to: "/business/categories", replace: true });
  },
});
