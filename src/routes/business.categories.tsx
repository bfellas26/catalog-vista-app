import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { motion } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { placeholderCategories } from "@/lib/placeholders";

export const Route = createFileRoute("/business/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        description="Organize your products into shoppable groups."
        actions={
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link to="/business/categories/new">
              <Plus className="mr-1.5 h-4 w-4" /> Add category
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderCategories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-surface group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <FolderTree className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{c.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {c.products} products · updated {c.updated}
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link to="/business/categories/edit/$id" params={{ id: c.id }}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
