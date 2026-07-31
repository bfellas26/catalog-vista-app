import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, Search, Bell, ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function AdminShell({
  brand,
  nav,
  role,
  children,
}: {
  brand: string;
  nav: NavItem[];
  role: string;
  children: ReactNode;
}) {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border bg-card transition-all lg:block",
          sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <SidebarInner brand={brand} nav={nav} pathname={pathname} collapsed={!sidebarOpen} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute inset-y-0 left-0 w-64 border-r border-border bg-card"
          >
            <SidebarInner brand={brand} nav={nav} pathname={pathname} />
          </motion.aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/70 hover:border-ring/30 focus:border-ring focus:ring-[3px] focus:ring-ring/15"
                placeholder="Search…"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
            </button>
            <ProfileMenu role={role} />
          </div>
        </header>

        {/* Breadcrumb bar */}
        <div className="border-b border-border bg-background/50 px-4 py-3 sm:px-6">
          <Breadcrumbs />
        </div>

        {/* Content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-w-0"
            key={pathname}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarInner({
  brand,
  nav,
  pathname,
  collapsed,
}: {
  brand: string;
  nav: NavItem[];
  pathname: string;
  collapsed?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <span className="font-display text-sm font-bold">C</span>
        </div>
        {!collapsed && (
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            {brand}
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="border-t border-border p-3">
          <div className="rounded-xl bg-accent/60 p-3">
            <p className="text-xs font-semibold text-foreground">Need help?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Check docs or contact support.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu({ role }: { role: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AK
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-foreground">Alex Kim</p>
            <p className="text-[10px] text-muted-foreground">{role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/login">Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
