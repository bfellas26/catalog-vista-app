import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "./business.categories";

export const Route = createFileRoute("/business/categories/")({
  component: CategoriesPage,
});
