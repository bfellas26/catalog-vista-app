import { createFileRoute } from "@tanstack/react-router";
import { Download, Mail } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/common/Badges";
import { placeholderSubscribers } from "@/lib/placeholders";

export const Route = createFileRoute("/business/subscribers")({
  component: SubscribersPage,
});

function SubscribersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Subscribers"
        description="People who opted in for updates."
        actions={
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Source</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {placeholderSubscribers.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{s.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><TagBadge name={(s as any).source || "Website"} variant="gold" /></td>
                <td className="px-4 py-3 text-muted-foreground">{s.subscribedAt || (s as any).joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
