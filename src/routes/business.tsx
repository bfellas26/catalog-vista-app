import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Tags,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import { AdminShell, type NavItem } from "@/components/layouts/AdminShell";

const nav: NavItem[] = [
  { to: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/business/categories", label: "Categories", icon: FolderTree },
  { to: "/business/products", label: "Products", icon: Package },
  { to: "/business/product-tags", label: "Product Tags", icon: Tags },
  { to: "/business/subscribers", label: "Subscribers", icon: Users },
  { to: "/business/enquiries", label: "Enquiries", icon: MessageSquare },
  { to: "/business/settings", label: "Settings", icon: Settings },
];

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
