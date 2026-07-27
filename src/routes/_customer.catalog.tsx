import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, ShoppingBag, Minus, Plus, Mail, MapPin, Phone, Check } from "lucide-react";
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

const catalogSearchSchema = z.object({
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
  const { product: openId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [q, setQ] = useState("");
  const addCartItem = useCartStore((s) => s.add);
  const removeCartItem = useCartStore((s) => s.remove);
  const setCartQty = useCartStore((s) => s.setQty);
  const cartItems = useCartStore((s) => s.items);

  const setOpenId = (id: string | null) => {
    navigate({
      search: { product: id || undefined },
      replace: true,
    });
  };

  // Standalone products (no category)
  const standaloneProducts = useMemo(() => {
    return jewelleryProducts.filter(
      (p) => !p.categoryId && (q === "" || p.name.toLowerCase().includes(q.toLowerCase())),
    );
  }, [q]);

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
                className="w-full h-12 pl-12 pr-4 rounded-full border-[#3a1f2d]/15 bg-[#faf6f1]/50 text-[#3a1f2d] placeholder:text-[#3a1f2d]/40 focus-visible:ring-2 focus-visible:ring-[#3a1f2d]/30 focus:border-[#3a1f2d]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED STANDALONE PRODUCTS */}
      {standaloneProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#3a1f2d]/60 uppercase">
              Signature releases
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">Featured Products</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#3a1f2d]/5 text-left shadow-sm transition hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-[#faf6f1]">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-medium text-[#3a1f2d] group-hover:text-[#3a1f2d]/80 transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="mt-2 font-display text-lg font-bold text-[#3a1f2d]">
                        {formatINR(p.price)}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between h-8 mb-3">
                      {qty === 0 ? (
                        <Button
                          onClick={() => {
                            addCartItem({ id: p.id, name: p.name, price: p.price, qty: 1 });
                            toast.success(`${p.name} added to cart`, { duration: 1500 });
                          }}
                          size="sm"
                          className="w-full bg-[#3a1f2d] text-white hover:bg-[#3a1f2d]/90 font-medium text-xs rounded-lg h-full border-none flex items-center justify-center gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg border border-[#3a1f2d]/15 bg-white h-full w-full">
                          <button
                            onClick={() => {
                              if (qty === 1) {
                                removeCartItem(p.id);
                                toast.success(`${p.name} removed from cart`, { duration: 1500 });
                              } else {
                                setCartQty(p.id, qty - 1);
                              }
                            }}
                            className="p-1 px-3 text-[#3a1f2d]/70 hover:bg-[#faf6f1]/50 transition h-full rounded-l-lg flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#3a1f2d]">{qty}</span>
                          <button
                            onClick={() => {
                              setCartQty(p.id, qty + 1);
                            }}
                            className="p-1 px-3 text-[#3a1f2d]/70 hover:bg-[#faf6f1]/50 transition h-full rounded-r-lg flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[#3a1f2d]/5">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#3a1f2d]/60 uppercase">
            Browse Collections
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">Curated Categories</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jewelleryCategories.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-sm border border-[#3a1f2d]/5 aspect-[4/5] flex flex-col justify-end"
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
                <Link
                  to="/category/$id"
                  params={{ id: c.id }}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 group-hover:text-amber-100 transition-colors"
                >
                  View Category →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. SUBSCRIPTION SECTION */}
      <section className="bg-[#3a1f2d] text-white py-20 px-4">
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

      {/* 7. CONTACT SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-[#3a1f2d]/5">
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

      {/* 8. PRODUCT MODAL */}
      <ProductModal
        productId={openId ?? null}
        onClose={() => setOpenId(null)}
        products={q ? standaloneProducts : jewelleryProducts}
      />
    </div>
  );
}
