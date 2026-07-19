import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Trial: "bg-gold/15 text-gold",
  Open: "bg-primary/10 text-primary",
  Responded: "bg-warning/15 text-warning",
  Closed: "bg-muted text-muted-foreground",
  "In stock": "bg-success/10 text-success",
  "Out of stock": "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        statusMap[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function TagBadge({
  name,
  variant = "default",
}: {
  name: string;
  variant?: "default" | "gold" | "primary" | "warning" | "danger";
}) {
  const styles = {
    default: "bg-muted text-muted-foreground",
    gold: "bg-gold/15 text-gold",
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium",
        styles[variant],
      )}
    >
      {name}
    </span>
  );
}
