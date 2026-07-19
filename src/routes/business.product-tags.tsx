import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { TagBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { placeholderTags } from "@/lib/placeholders";

export const Route = createFileRoute("/business/product-tags")({
  component: ProductTagsPage,
});

function ProductTagsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Product Tags"
        description="Highlight products with contextual labels."
        actions={
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-1.5 h-4 w-4" /> Add tag
          </Button>
        }
      />

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Tag</th>
              <th className="px-4 py-3 text-left font-medium">Products</th>
              <th className="px-4 py-3 text-left font-medium">Style</th>
            </tr>
          </thead>
          <tbody>
            {placeholderTags.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.used}</td>
                <td className="px-4 py-3">
                  <TagBadge name={t.name} variant={t.color as "gold" | "primary" | "warning" | "danger"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
