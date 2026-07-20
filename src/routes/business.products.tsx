import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter, MoreHorizontal, Pencil, Trash2, Package, FolderTree, Tags } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { SearchBar } from "@/components/common/SearchBar";
import { StatusBadge, TagBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { placeholderProducts, placeholderCategories, placeholderTags } from "@/lib/placeholders";

export const Route = createFileRoute("/business/products")({
  component: ProductsPage,
});

type TabType = "products" | "categories" | "tags";

function ProductsPage() {
  const [tab, setTab] = useState<TabType>("products");
  const [q, setQ] = useState("");

  const filteredProducts = placeholderProducts.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );

  const tabsInfo = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "categories" as const, label: "Categories", icon: FolderTree },
    { id: "tags" as const, label: "Product Tags", icon: Tags },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Product Management"
        description="Organize your shop catalogue, categories, and tags."
        actions={
          tab === "products" ? (
            <Button asChild className="bg-primary hover:bg-primary-dark">
              <Link to="/business/products/new">
                <Plus className="mr-1.5 h-4 w-4" /> Add product
              </Link>
            </Button>
          ) : tab === "categories" ? (
            <Button asChild className="bg-primary hover:bg-primary-dark">
              <Link to="/business/categories/new">
                <Plus className="mr-1.5 h-4 w-4" /> Add category
              </Link>
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-1.5 h-4 w-4" /> Add tag
            </Button>
          )
        }
      />

      {/* Modern Premium Tabs Control */}
      <div className="flex border-b border-border mb-6">
        {tabsInfo.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setQ("");
              }}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "products" && (
          <motion.div
            key="products-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-surface">
              <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar placeholder="Search products…" value={q} onChange={setQ} />
                <Button variant="outline" size="sm">
                  <Filter className="mr-1.5 h-4 w-4" /> Filters
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Product</th>
                      <th className="px-4 py-3 text-left font-medium">Category</th>
                      <th className="px-4 py-3 text-left font-medium">Price</th>
                      <th className="px-4 py-3 text-left font-medium">Tags</th>
                      <th className="px-4 py-3 text-left font-medium">Stock</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-accent" />
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3 font-medium">${p.price}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((t) => <TagBadge key={t} name={t} variant="primary" />)}
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={p.stock} /></td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="rounded-md p-1.5 hover:bg-accent">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to="/business/products/edit/$id" params={{ id: p.id }}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                <span>Showing {filteredProducts.length} of {placeholderProducts.length}</span>
                <div className="flex gap-1">
                  <button className="rounded-md border border-border px-2 py-1 hover:bg-accent">Previous</button>
                  <button className="rounded-md border border-border px-2 py-1 hover:bg-accent">Next</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "categories" && (
          <motion.div
            key="categories-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
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
          </motion.div>
        )}

        {tab === "tags" && (
          <motion.div
            key="tags-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
