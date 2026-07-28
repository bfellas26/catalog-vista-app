import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { StatusBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { enquiriesApi, type Enquiry, type EnquiryStatus, type TimestampField } from "@/services/enquiriesApi";
import { useAuthStore } from "@/store";
import { Eye, Trash2, RefreshCw, Inbox } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/business/enquiries")({
  component: EnquiriesPage,
});

const STATUS_OPTIONS: EnquiryStatus[] = ["NEW", "CONTACTED", "CLOSED"];

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

function EnquiriesPage() {
  const accountId = useAuthStore((s) => s.user?.accountId);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEnquiries = async () => {
    if (!accountId) {
      setError("No account ID found in session. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await enquiriesApi.getEnquiriesByAccount(accountId);
      setEnquiries(res.data ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load enquiries.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    setStatusLoading(true);
    try {
      await enquiriesApi.updateEnquiryStatus(selectedEnquiry.documentId, newStatus);
      const updated = { ...selectedEnquiry, status: newStatus };
      setEnquiries((prev) =>
        prev.map((e) => (e.documentId === selectedEnquiry.documentId ? updated : e)),
      );
      setSelectedEnquiry(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      toast.error(msg);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await enquiriesApi.deleteEnquiry(deleteTarget.documentId);
      setEnquiries((prev) => prev.filter((e) => e.documentId !== deleteTarget.documentId));
      toast.success("Enquiry deleted successfully");
      setDeleteTarget(null);
      if (selectedEnquiry?.documentId === deleteTarget.documentId) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete enquiry.";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Enquiries"
        description="View and manage customer enquiries from your digital catalogue."
        actions={
          <Button variant="outline" size="sm" onClick={fetchEnquiries} disabled={loading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="card-surface overflow-hidden">
        {loading && (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/60" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchEnquiries}>
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && enquiries.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <Inbox className="h-8 w-8 opacity-40" />
            <p className="text-sm">No enquiries found for this account.</p>
          </div>
        )}

        {!loading && !error && enquiries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">Message</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Created At</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr
                    key={e.documentId}
                    className="border-b border-border last:border-0 hover:bg-accent/30 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{e.customerName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">{e.email}</p>
                      <p className="text-xs text-muted-foreground">{e.phone}</p>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                      {e.message}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatTimestamp(e.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedEnquiry(e)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                          onClick={() => setDeleteTarget(e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEnquiry && (
        <Dialog
          open={!!selectedEnquiry}
          onOpenChange={(open) => !open && setSelectedEnquiry(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Enquiry Details</span>
                <StatusBadge status={selectedEnquiry.status} />
              </DialogTitle>
              <DialogDescription>
                Review the full enquiry and update its status below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm pt-2">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 font-mono text-xs">
                <div>
                  <span className="text-muted-foreground">Document ID:</span>
                  <p className="font-medium text-foreground truncate">{selectedEnquiry.documentId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account ID:</span>
                  <p className="font-medium text-foreground">{selectedEnquiry.accountId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created At:</span>
                  <p className="font-medium text-foreground">{formatTimestamp(selectedEnquiry.createdAt)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated At:</span>
                  <p className="font-medium text-foreground">{formatTimestamp(selectedEnquiry.updatedAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Customer Name</Label>
                  <p className="font-semibold">{selectedEnquiry.customerName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedEnquiry.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedEnquiry.phone}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Message</Label>
                <div className="mt-1 rounded-lg border border-border bg-card p-3 text-sm text-foreground">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-xs text-muted-foreground mb-2 block">Update Status</Label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((st) => (
                    <Button
                      key={st}
                      type="button"
                      size="sm"
                      disabled={statusLoading}
                      variant={selectedEnquiry.status === st ? "default" : "outline"}
                      onClick={() => handleStatusChange(st)}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                  onClick={() => {
                    setDeleteTarget(selectedEnquiry);
                    setSelectedEnquiry(null);
                  }}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete Enquiry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the enquiry from{" "}
              <span className="font-semibold">{deleteTarget?.customerName}</span>. The record will
              be marked as deleted on the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
