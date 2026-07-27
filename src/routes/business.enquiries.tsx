import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { StatusBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { placeholderEnquiries } from "@/lib/placeholders";
import { Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/business/enquiries")({
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const [enquiriesList, setEnquiriesList] = useState(placeholderEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<(typeof placeholderEnquiries)[0] | null>(
    null,
  );

  const handleStatusChange = (newStatus: string) => {
    if (!selectedEnquiry) return;
    setEnquiriesList((prev) =>
      prev.map((item) =>
        item.id === selectedEnquiry.id
          ? {
              ...item,
              status: newStatus,
              updatedAt: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            }
          : item,
      ),
    );
    setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    toast.success(`Enquiry status updated to ${newStatus}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Enquiries"
        description="View and manage customer enquiries matching your enquiries table schema."
      />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Customer Name</th>
                <th className="px-4 py-3 text-left font-medium">Contact Details</th>
                <th className="px-4 py-3 text-left font-medium">Message Snippet</th>
                <th className="px-4 py-3 text-left font-medium">Account ID</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created At</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiriesList.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-border last:border-0 hover:bg-accent/30 transition"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{e.customerName}</p>
                    <p className="text-xs text-muted-foreground font-mono">By: {e.createdBy}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{e.email}</p>
                    <p className="text-xs text-muted-foreground">{e.phone}</p>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">{e.message}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {e.accountId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedEnquiry(e)}>
                      <Eye className="mr-1 h-3.5 w-3.5" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Status Modal */}
      {selectedEnquiry && (
        <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Enquiry Details</span>
                <StatusBadge status={selectedEnquiry.status} />
              </DialogTitle>
              <DialogDescription>
                Full details corresponding to the enquiries collection document schema.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm pt-2">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 font-mono text-xs">
                <div>
                  <span className="text-muted-foreground">Account ID:</span>
                  <p className="font-medium text-foreground">{selectedEnquiry.accountId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created By:</span>
                  <p className="font-medium text-foreground">{selectedEnquiry.createdBy}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created At:</span>
                  <p className="font-medium text-foreground">{selectedEnquiry.createdAt}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated At:</span>
                  <p className="font-medium text-foreground">{selectedEnquiry.updatedAt}</p>
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
                  {["Pending", "In Progress", "Replied", "Closed"].map((st) => (
                    <Button
                      key={st}
                      type="button"
                      size="sm"
                      variant={selectedEnquiry.status === st ? "default" : "outline"}
                      onClick={() => handleStatusChange(st)}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
