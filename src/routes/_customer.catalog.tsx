import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, Minus, Plus, Mail, MapPin, Phone, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  jewelleryCategories,
  jewelleryProducts,
  formatINR,
  heroImage,
  brandMark,
} from "@/lib/jewellery-data";
import { ProductModal } from "@/components/customer/ProductModal";
import { useCartStore } from "@/store";
import { toast } from "sonner";
import { z } from "zod";
import { printProduct } from "@/lib/print-product";

const catalogSearchSchema = z.object({
  catalogueonly: z.boolean().or(z.string().transform((v) => v === "true")).optional(),
  product: z.string().optional(),
});

export const Route = createFileRoute("/_customer/catalog")({
  validateSearch: (search) => catalogSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Lumière Jewels — Handcrafted Fine Jewellery" },
      {
        name: "description",
        content:
          "Discover Lumière Jewels — Diamond solitaires, 22K gold heirlooms and modern everyday pieces.",
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { product: openId, catalogueonly: catalogueonlyParam } = Route.useSearch();
  const catalogueonly = !!catalogueonlyParam;
  const navigate = useNavigate({ from: Route.fullPath });
  const [q, setQ] = useState("");
  const addCartItem = useCartStore((s) => s.add);
  const removeCartItem = useCartStore((s) => s.remove);
  const setCartQty = useCartStore((s) => s.setQty);
  const cartItems = useCartStore((s) => s.items);

  const setOpenId = (id: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        product: id || undefined,
      }),
      replace: true,
    });
  };

  // Global search across ALL products
  const isSearching = q.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const query = q.trim().toLowerCase();
    return jewelleryProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.metal?.toLowerCase().includes(query) ||
        p.stones?.toLowerCase().includes(query) ||
        p.tags?.some((t) => t?.toLowerCase().includes(query)),
    );
  }, [q, isSearching]);

  // Standalone products (no category)
  const standaloneProducts = useMemo(() => {
    return jewelleryProducts.filter((p) => !p.categoryId);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#3a1f2d]">
      {/* 1. HERO SECTION */}
      <section className="relative h-[65vh] min-h-[450px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f1c]/90 via-[#2a1723]/80 to-[#faf6f1]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className="font-display text-5xl font-extralight tracking-tight sm:text-6xl lg:text-7xl">
              Lumière <span className="italic font-normal">Jewels</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed">
              Quiet luxury handcrafted for life's golden stories. Detailed by hand, designed for
              forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. BRAND BANNER */}
      <section className="relative z-20 -mt-16 mx-auto max-w-5xl px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#3a1f2d]/5 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-[#3a1f2d]/10 mb-6 bg-[#faf6f1]"
          >
            <img src={brandMark} alt="Lumière Logo" className="h-full w-full object-cover" />
          </motion.div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[#3a1f2d]">
            Lumière Jewels
          </h2>
          <p className="mt-2 text-sm text-[#3a1f2d]/60 italic max-w-md">
            "Artistry, purity, and excellence since 1996. Fine jewellery reimagined for modern
            elegance."
          </p>

          {/* 3. GLOBAL SEARCH */}
          <div className="mt-10 w-full max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#3a1f2d]/40" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rings, necklaces, bracelets, gold…"
                className="w-full h-12 pl-12 pr-10 rounded-full border-[#3a1f2d]/15 bg-[#faf6f1]/50 text-[#3a1f2d] placeholder:text-[#3a1f2d]/40 focus-visible:ring-2 focus-visible:ring-[#3a1f2d]/30 focus:border-[#3a1f2d]"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#3a1f2d]/50 hover:text-[#3a1f2d] p-1 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. GLOBAL SEARCH RESULTS OR DEFAULT HOME CONTENT */}
      {isSearching ? (
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#3a1f2d]/10 pb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#3a1f2d]/60 uppercase">
                Search Results
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
                Results for "{q}"
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#3a1f2d]/60 font-mono">
                {searchResults.length} {searchResults.length === 1 ? "product" : "products"} found
              </span>
              <Button
                onClick={() => setQ("")}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs rounded-xl border-[#3a1f2d]/15"
              >
                Clear Search
              </Button>
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#3a1f2d]/5 p-12 text-center shadow-sm my-6">
              <p className="text-base font-light text-[#3a1f2d]/60">
                No products found matching "{q}".
              </p>
              <p className="text-xs text-[#3a1f2d]/40 mt-1">
                Try searching for rings, gold, solitaire, necklace, or bracelet.
              </p>
              <Button
                onClick={() => setQ("")}
                className="mt-4 bg-[#3a1f2d] hover:bg-[#3a1f2d]/90 text-white rounded-xl h-9 px-4 text-xs border-none"
              >
                View All Categories
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((p, idx) => {
                const cartItem = cartItems.find((item) => item.id === p.id);
                const qty = cartItem ? cartItem.qty : 0;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => setOpenId(p.id)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#3a1f2d]/5 text-left shadow-sm transition hover:shadow-xl hover:-translate-y-1 flex flex-col"
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
                          printProduct(p, catalogueonly);
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
                        {!catalogueonly && (
                          <p className="mt-0.5 font-display text-xs sm:text-base font-bold text-[#3a1f2d]">
                            {formatINR(p.price)}
                          </p>
                        )}
                      </div>
                      {!catalogueonly && (
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
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 5. FEATURED STANDALONE PRODUCTS */}
          {standaloneProducts.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#3a1f2d]/60 uppercase">
                  Featured releases
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">Featured Products</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {standaloneProducts.map((p, idx) => {
                  const cartItem = cartItems.find((item) => item.id === p.id);
                  const qty = cartItem ? cartItem.qty : 0;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setOpenId(p.id)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#3a1f2d]/5 text-left shadow-sm transition hover:shadow-xl hover:-translate-y-1 flex flex-col"
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
                            printProduct(p, catalogueonly);
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
                          {!catalogueonly && (
                            <p className="mt-0.5 font-display text-xs sm:text-base font-bold text-[#3a1f2d]">
                              {formatINR(p.price)}
                            </p>
                          )}
                        </div>
                        {!catalogueonly && (
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
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 6. CATEGORIES GRID */}
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-[#3a1f2d]/5">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#3a1f2d]/60 uppercase">
                Browse Collections
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">Curated Categories</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jewelleryCategories.map((c, idx) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate({ to: "/category/$id", params: { id: c.id }, search: (prev) => prev })}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-sm border border-[#3a1f2d]/5 aspect-[4/5] flex flex-col justify-end text-left cursor-pointer"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a1723]/95 via-[#2a1723]/50 to-transparent" />

                  <div className="relative p-6 sm:p-8 text-white z-10">
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{c.name}</h3>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">{c.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 group-hover:text-amber-100 transition-colors">
                      View Category →
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 7. SUBSCRIPTION SECTION */}
      {!catalogueonly && (
        <section className="bg-[#3a1f2d] text-white py-8 px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Stay updated</h2>
            <p className="mt-3 text-sm text-white/70 font-light leading-relaxed">
              Subscribe to our newsletter and receive private collection invitations, updates on
              custom releases, and styling notes.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thank you for subscribing!");
              }}
              className="mt-6 flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                required
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full h-11 focus-visible:ring-amber-300"
              />
              <Button
                type="submit"
                className="bg-white text-[#3a1f2d] hover:bg-white/90 rounded-full h-11 px-6 font-medium border-none"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      )}

      {/* 8. CONTACT SECTION */}
      {!catalogueonly && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 border-t border-[#3a1f2d]/5">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Get in Touch</h2>
              <p className="mt-4 text-sm text-[#3a1f2d]/70 leading-relaxed font-light">
                Visit our Lisbon boutique flagship or coordinate with our specialists for bespoke
                consultations, adjustments, and sizing requests.
              </p>
              <dl className="mt-8 space-y-4 text-sm text-[#3a1f2d]/80">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#3a1f2d]/50 shrink-0" />
                  <dd>123 Fine Design Quarter, Lisbon, Portugal</dd>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#3a1f2d]/50 shrink-0" />
                  <dd>+351 21 000 0000</dd>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#3a1f2d]/50 shrink-0" />
                  <dd>concierge@lumierejewels.com</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#3a1f2d]/5 shadow-sm space-y-4">
              <h3 className="font-display text-xl font-semibold">Bespoke Inquiry</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="First Name" className="border-[#3a1f2d]/10 h-10 text-sm" />
                <Input placeholder="Last Name" className="border-[#3a1f2d]/10 h-10 text-sm" />
              </div>
              <Input placeholder="Email" type="email" className="border-[#3a1f2d]/10 h-10 text-sm" />
              <textarea
                placeholder="Describe your bespoke request..."
                rows={4}
                className="w-full p-3 rounded-lg border border-[#3a1f2d]/10 text-sm outline-none focus:ring-1 focus:ring-[#3a1f2d]"
              />
              <Button
                onClick={() => toast.success("Inquiry sent successfully!")}
                className="w-full bg-[#3a1f2d] hover:bg-[#3a1f2d]/90 text-white rounded-lg h-10 border-none"
              >
                Send Enquiry
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 9. PRODUCT MODAL */}
      <ProductModal
        productId={openId ?? null}
        onClose={() => setOpenId(null)}
        products={isSearching ? searchResults : standaloneProducts}
        catalogueonly={catalogueonly}
      />
    </div>
  );
}
