import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

// Turns pathname segments into breadcrumb items.
export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, i) => {
    const to = "/" + parts.slice(0, i + 1).join("/");
    const label = part
      .replace(/\$/g, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { to, label };
  });

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link
        to="/"
        className="flex items-center gap-1 transition-colors duration-150 hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((c, i) => (
        <span key={c.to} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-foreground">{c.label}</span>
          ) : (
            <Link
              to={c.to as string}
              className="transition-colors duration-150 hover:text-foreground"
            >
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
