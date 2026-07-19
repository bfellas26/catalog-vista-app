import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { placeholderProducts } from "@/lib/placeholders";

export const Route = createFileRoute("/business/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const filtered = placeholderProducts.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="All items in your catalog."
        actions={
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link to="/business/products/new">
              <Plus className="mr-1.5 h-4 w-4" /> Add product
            </Link>
          </Button>
        }
      />

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
              {filtered.map((p) => (
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
          <span>Showing {filtered.length} of {placeholderProducts.length}</span>
          <div className="flex gap-1">
            <button className="rounded-md border border-border px-2 py-1 hover:bg-accent">Previous</button>
            <button className="rounded-md border border-border px-2 py-1 hover:bg-accent">Next</button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
