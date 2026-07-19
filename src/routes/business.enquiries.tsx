import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { StatusBadge } from "@/components/common/Badges";
import { placeholderEnquiries } from "@/lib/placeholders";

export const Route = createFileRoute("/business/enquiries")({
  component: EnquiriesPage,
});

function EnquiriesPage() {
  return (
    <PageContainer>
      <PageHeader title="Enquiries" description="Customer requests from your catalog." />
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Items</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {placeholderEnquiries.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.email}</p>
                </td>
                <td className="px-4 py-3">{e.items}</td>
                <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{e.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
