import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Mail, RefreshCw } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/common/Badges";
import { EmptyState } from "@/components/common/EmptyState";
import { subscribersApi, type Subscriber } from "@/services/subscribersApi";
import type { TimestampField } from "@/services/enquiriesApi";
import { placeholderSubscribers } from "@/lib/placeholders";
import { useAuthStore } from "@/store";

export const Route = createFileRoute("/business/subscribers")({
  component: SubscribersPage,
});

// TODO: Temporary mock data — delete this block once the backend is up.
const MOCK_SUBSCRIBERS: Subscriber[] = placeholderSubscribers.map((s) => ({
  documentId: s.id,
  accountId: s.accountId,
  subscriberName: s.name,
  phoneNumber: s.phone,
  emailAddress: s.email,
  subscribedAt: s.subscribedAt,
  isDeleted: false,
}));

function formatTimestamp(ts: TimestampField): string {
  if (!ts) return "—";
  if (typeof ts === "object" && "_seconds" in ts) {
    return new Date(ts._seconds * 1000).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  const d = new Date(ts as string);
  if (isNaN(d.getTime())) return ts as string;
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function SubscribersPage() {
  const accountId = useAuthStore((s) => s.user?.accountId);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    if (!accountId) {
      setError("No account ID found in session. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // TODO: Backend not up yet. To go live: uncomment the line below and
      // delete the MOCK line under it (plus the MOCK_SUBSCRIBERS block above).
      // const res = await subscribersApi.getSubscribersByAccount(accountId);
      const res = { data: MOCK_SUBSCRIBERS };
      setSubscribers(res.data ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load subscribers.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  return (
    <PageContainer>
      <PageHeader
        title="Subscribers"
        description="People who opted in for updates."
        actions={
          <>
            <Button variant="outline" onClick={fetchSubscribers} disabled={loading}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="card-surface px-6 py-16 text-center text-sm text-muted-foreground">
          Loading subscribers…
        </div>
      ) : error ? (
        <div className="card-surface px-6 py-16 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchSubscribers}>
            Try again
          </Button>
        </div>
      ) : subscribers.length === 0 ? (
        <EmptyState
          title="No subscribers yet"
          description="When someone subscribes from your catalog, they'll appear here."
          icon={<Mail className="h-6 w-6" />}
        />
      ) : (
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
              {subscribers.map((s) => (
                <tr key={s.documentId} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{s.emailAddress}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TagBadge name="Website" variant="gold" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatTimestamp(s.subscribedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
