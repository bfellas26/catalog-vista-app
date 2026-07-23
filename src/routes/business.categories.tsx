import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, FolderTree, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategoryStore } from "@/store";
import { toast } from "sonner";

export const Route = createFileRoute("/business/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories, deleteCategory } = useCategoryStore();

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        description="Organize products matching your categories database schema."
        actions={
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link to="/business/categories/new">
              <Plus className="mr-1.5 h-4 w-4" /> Add category
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-surface group p-5 transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted border border-border shrink-0">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.categoryName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-primary bg-primary/10">
                      <FolderTree className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={c.isActive ? "default" : "secondary"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {c.isDeleted && <Badge variant="destructive">Deleted</Badge>}
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Order: {c.displayOrder}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-lg font-semibold">{c.categoryName}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {c.description || "No description provided."}
              </p>

              <div className="mt-4 pt-3 border-t border-border space-y-1 text-xs text-muted-foreground font-mono">
                <div className="flex items-center justify-between">
                  <span>Account: {c.accountId}</span>
                  <span>By: {c.createdBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Updated: {c.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 pt-2">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link to="/business/categories/edit/$id" params={{ id: c.id }}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  deleteCategory(c.id);
                  toast.success("Category deleted");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
