import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, ArrowLeft, Minus, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { jewelleryCategories, jewelleryProducts, formatINR } from "@/lib/jewellery-data";
import { ProductModal } from "@/components/customer/ProductModal";
import { useCartStore } from "@/store";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { printProduct } from "@/lib/print-product";

const categorySearchSchema = z.object({
  product: z.string().optional(),
});

export const Route = createFileRoute("/_customer/category/$id")({
  validateSearch: (search) => categorySearchSchema.parse(search),
  component: CategoryPage,
});

function CategoryPage() {
  const { id } = Route.useParams();
  const { product: openId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const addCartItem = useCartStore((s) => s.add);
  const removeCartItem = useCartStore((s) => s.remove);
  const setCartQty = useCartStore((s) => s.setQty);
  const cartItems = useCartStore((s) => s.items);

  const category = useMemo(() => {
    return jewelleryCategories.find((c) => c.id === id) ?? jewelleryCategories[0];
  }, [id]);

  const [q, setQ] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < 500000) count++;
    if (selectedTags.length > 0) count += selectedTags.length;
    return count;
  }, [priceRange, selectedTags]);

  // Get all unique tags for products in this category
  const availableTags = useMemo(() => {
    const catProducts = jewelleryProducts.filter((p) => p.categoryId === id);
    const tags = new Set<string>();
    catProducts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [id]);

  // Filtered & Sorted products
  const products = useMemo(() => {
    let result = jewelleryProducts.filter((p) => p.categoryId === id);

    // Apply Search
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase()),
      );
    }

    // Apply Price Range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Apply Tags
    if (selectedTags.length > 0) {
      result = result.filter((p) => p.tags.some((t) => selectedTags.includes(t)));
    }

    // Sort
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [id, q, priceRange, selectedTags, sortBy]);

  const setOpenId = (productId: string | null) => {
    navigate({
      search: { product: productId || undefined },
      replace: true,
    });
  };

  const handleTagToggle = (tag: string, checked: boolean) => {
    setSelectedTags((prev) => (checked ? [...prev, tag] : prev.filter((t) => t !== tag)));
  };

  const resetFilters = () => {
    setQ("");
    setPriceRange([0, 500000]);
    setSelectedTags([]);
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#3a1f2d]">
      {/* Category Banner */}
      <section className="bg-[#3a1f2d] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#3a1f2d]/10">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-200 hover:text-amber-100 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Back to catalog
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl sm:text-4xl font-light tracking-tight">
                {category.name}
              </h1>
              <p className="mt-1.5 text-white/70 font-light leading-relaxed text-sm">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main catalog view */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
        {/* Search, Filter & Sort Panel container */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#3a1f2d]/5 shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#3a1f2d]/40" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search in ${category.name}...`}
                className="w-full h-10 pl-10 pr-4 rounded-xl border-[#3a1f2d]/10 bg-[#faf6f1]/30 text-sm focus-visible:ring-1 focus-visible:ring-[#3a1f2d]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              <Button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                variant="outline"
                size="sm"
                className={cn(
                  "h-10 px-4 rounded-xl border-[#3a1f2d]/10 text-sm font-medium flex items-center gap-2 transition-all",
                  filtersExpanded || activeFiltersCount > 0
                    ? "bg-[#3a1f2d] text-white hover:bg-[#3a1f2d]/90 hover:text-white"
                    : "bg-white text-[#3a1f2d] hover:bg-[#faf6f1]"
                )}
              >
                <Filter className="h-4 w-4" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#3a1f2d]/60 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-10 px-3 bg-white border border-[#3a1f2d]/10 rounded-xl text-sm font-light outline-none focus:ring-1 focus:ring-[#3a1f2d]"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collapsible Expandable Filters Panel */}
          <AnimatePresence>
            {filtersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid gap-6 md:grid-cols-2 bg-white p-6 rounded-2xl border border-[#3a1f2d]/5 shadow-sm">
                  {/* Price Filter */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#3a1f2d]/60">
                        Price Range
                      </h3>
                      <button
                        onClick={resetFilters}
                        className="text-xs text-[#3a1f2d]/60 hover:text-[#3a1f2d] hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                    <Slider
                      min={0}
                      max={500000}
                      step={5000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-1"
                    />
                    <div className="flex justify-between text-xs text-[#3a1f2d]/70 font-mono">
                      <span>{formatINR(priceRange[0])}</span>
                      <span>{formatINR(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Tag Filter */}
                  {availableTags.length > 0 && (
                    <div className="space-y-4 md:border-l md:border-[#3a1f2d]/5 md:pl-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#3a1f2d]/60">
                        Stones & Style
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => handleTagToggle(tag, !isSelected)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-light transition select-none border",
                                isSelected
                                  ? "bg-[#3a1f2d]/10 border-[#3a1f2d] text-[#3a1f2d] font-normal"
                                  : "bg-white border-[#3a1f2d]/10 text-[#3a1f2d]/70 hover:bg-[#faf6f1]"
                              )}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

            {/* Results Output */}
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-[#3a1f2d]/60 uppercase tracking-widest">
                Viewing {products.length} products
              </p>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#3a1f2d]/5 py-20 px-4 text-center">
                <p className="text-base font-light text-[#3a1f2d]/60">
                  No products match your current filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-xs font-semibold text-[#3a1f2d] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {products.map((p, idx) => {
                  const cartItem = cartItems.find((item) => item.id === p.id);
                  const qty = cartItem ? cartItem.qty : 0;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => setOpenId(p.id)}
                      className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#3a1f2d]/5 text-left shadow-sm transition hover:shadow-xl hover:-translate-y-1 flex flex-col"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#faf6f1]">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            printProduct(p);
                          }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-white/90 backdrop-blur text-[#3a1f2d]/70 hover:text-[#3a1f2d] shadow-sm transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10"
                          aria-label="Print product"
                          title="Print / Save as PDF"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display font-medium text-xs sm:text-base text-[#3a1f2d] truncate">
                            {p.name}
                          </h3>
                          <p className="mt-0.5 font-display text-xs sm:text-base font-bold text-[#3a1f2d]">
                            {formatINR(p.price)}
                          </p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                          {qty === 0 ? (
                            <button
                              onClick={() => {
                                addCartItem({ id: p.id, name: p.name, price: p.price, qty: 1 });
                                toast.success(`${p.name} added`, { duration: 1500 });
                              }}
                              className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full bg-[#3a1f2d] text-white hover:bg-[#3a1f2d]/90 transition"
                              aria-label="Add to cart"
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          ) : (
                            <div className="inline-flex items-center rounded-full border border-[#3a1f2d]/15 bg-white h-7 sm:h-9 px-1">
                              <button
                                onClick={() => {
                                  if (qty === 1) removeCartItem(p.id);
                                  else setCartQty(p.id, qty - 1);
                                }}
                                className="grid h-full w-5 sm:w-7 place-items-center text-[#3a1f2d]/70 hover:text-[#3a1f2d]"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </button>
                              <span className="min-w-[1rem] sm:min-w-[1.25rem] text-center text-[10px] sm:text-xs font-semibold text-[#3a1f2d]">
                                {qty}
                              </span>
                              <button
                                onClick={() => setCartQty(p.id, qty + 1)}
                                className="grid h-full w-5 sm:w-7 place-items-center text-[#3a1f2d]/70 hover:text-[#3a1f2d]"
                                aria-label="Increase"
                              >
                                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
      </div>

      {/* In-place Category Products Modal */}
      <ProductModal
        productId={openId ?? null}
        onClose={() => setOpenId(null)}
        products={products}
      />
    </div>
  );
}
