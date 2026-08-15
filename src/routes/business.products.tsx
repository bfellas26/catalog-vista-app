import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/business/products")({
  component: ProductsLayout,
});

function ProductsLayout() {
  return <Outlet />;
}
