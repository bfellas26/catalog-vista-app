import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { TagBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { placeholderProducts, placeholderCategories } from "@/lib/placeholders";

export const Route = createFileRoute("/_customer/category/$id")({
  component: CategoryPage,
});

const availableTags = ["New", "Bestseller", "Limited"];

function CategoryPage() {
  const { id } = Route.useParams();
  const category = placeholderCategories.find((c) => c.id === id) ?? placeholderCategories[0];

  const [q, setQ] = useState("");
  const [price, setPrice] = useState([0, 200]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const products = useMemo(() => {
    return placeholderProducts.filter(
      (p) =>
        (p.productName || (p as any).name || "").toLowerCase().includes(q.toLowerCase()) &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        (activeTags.length === 0 || activeTags.some((t) => ((p as any).tags || p.tagIds || []).includes(t))),
    );
  }, [q, price, activeTags]);

  return (
    <div>
      {/* Category banner */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-widest text-gold uppercase">Category</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{category.categoryName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search in ${category.categoryName}…`} className="pl-9" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        {/* Filter sidebar */}
        <aside className="card-surface h-fit p-5">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Filters</h3>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Price</p>
              <Slider value={price} onValueChange={setPrice} max={200} step={5} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>${price[0]}</span><span>${price[1]}</span>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Tags</p>
              <div className="space-y-2">
                {availableTags.map((t) => (
                  <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={activeTags.includes(t)}
                      onCheckedChange={(v) =>
                        setActiveTags((prev) => (v ? [...prev, t] : prev.filter((x) => x !== t)))
                      }
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => { setPrice([0, 200]); setActiveTags([]); setQ(""); }}
            >
              Reset filters
            </Button>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{products.length} results</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link to="/product/$id" params={{ id: p.id }} className="group block">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-accent transition group-hover:shadow-md" />
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {((p as any).tags || p.tagIds || []).map((t: string) => <TagBadge key={t} name={t} variant="gold" />)}
                    </div>
                    <p className="mt-1.5 font-medium">{p.productName || (p as any).name}</p>
                    <p className="text-sm text-muted-foreground">${p.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
