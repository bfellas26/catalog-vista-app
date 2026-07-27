import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserPlus } from "lucide-react";
import { AdminShell, type NavItem } from "@/components/layouts/AdminShell";

const nav: NavItem[] = [
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/clients/new", label: "Add Client", icon: UserPlus },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell brand="Catalogo Admin" nav={nav} role="Super Admin">
      <Outlet />
    </AdminShell>
  );
}

// Silence unused import warning; Link is re-exported for children in some setups.
void Link;
