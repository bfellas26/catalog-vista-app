import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/common/Badges";
import { placeholderProducts } from "@/lib/placeholders";
import { useCartStore } from "@/store";
import { z } from "zod";

const productSearchSchema = z.object({
  catalogueonly: z.boolean().or(z.string().transform((v) => v === "true")).optional(),
});

export const Route = createFileRoute("/_customer/product/$id")({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: ProductDetailsPage,
});

function ProductDetailsPage() {
  const { id } = Route.useParams();
  const { catalogueonly: catalogueonlyParam } = Route.useSearch();
  const catalogueonly = !!catalogueonlyParam;
  const navigate = useNavigate();
  const idx = placeholderProducts.findIndex((p) => p.id === id);
  const product = placeholderProducts[Math.max(0, idx)] ?? placeholderProducts[0];
  const prev = placeholderProducts[idx - 1];
  const next = placeholderProducts[idx + 1];

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const add = useCartStore((s) => s.add);

  const gallery = [0, 1, 2, 3];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/catalog" search={(prev) => prev} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to catalog
        </Link>
        <div className="flex gap-1">
          {prev && (
            <Button asChild variant="outline" size="sm">
              <Link to="/product/$id" params={{ id: prev.id }} search={(prev) => prev}>
                <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
              </Link>
            </Button>
          )}
          {next && (
            <Button asChild variant="outline" size="sm">
              <Link to="/product/$id" params={{ id: next.id }} search={(prev) => prev}>
                Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-10 lg:grid-cols-2"
      >
        {/* Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-3xl bg-accent" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((g) => (
              <button
                key={g}
                onClick={() => setActiveImg(g)}
                className={`aspect-square overflow-hidden rounded-xl border-2 bg-accent transition ${
                  activeImg === g ? "border-primary" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-1">
            {(product.tagIds || []).map((t: string) => (
              <TagBadge key={t} name={t} variant="gold" />
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            {product.productName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Category: {product.categoryId}
          </p>
          {!catalogueonly && (
            <p className="mt-6 text-3xl font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          )}

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description || "Crafted with a considered choice of materials and finished by hand."}
          </p>

          {!catalogueonly && (
            <>
              <div className="mt-8 flex items-center gap-4">
                <div className="inline-flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-accent"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="p-2 hover:bg-accent">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  className="flex-1 bg-primary hover:bg-primary-dark"
                  onClick={() => {
                    add({
                      id: product.id,
                      name: product.productName || (product as any).name,
                      price: product.price,
                      qty,
                    });
                    toast.success("Added to cart");
                  }}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to cart
                </Button>
              </div>

              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => navigate({ to: "/cart" })}
              >
                View cart
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
