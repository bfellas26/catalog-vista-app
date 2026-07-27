import { Outlet, createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { AdminShell, type NavItem } from "@/components/layouts/AdminShell";

const nav: NavItem[] = [{ to: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard }];

export const Route = createFileRoute("/business")({
  component: BusinessLayout,
});

function BusinessLayout() {
  return (
    <AdminShell brand="Aurora Studio" nav={nav} role="Business Admin">
      <Outlet />
    </AdminShell>
  );
}
