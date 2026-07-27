import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, Sparkles, ArrowRight, ShieldCheck, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/common/Badges";
import {
  jewelleryCategories,
  jewelleryProducts,
  formatINR,
  heroImage,
} from "@/lib/jewellery-data";
import { ProductModal } from "@/components/customer/ProductModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_customer/catalog")({
  head: () => ({
    meta: [
      { title: "Lumière Jewels — Handcrafted fine jewellery" },
      {
        name: "description",
        content:
          "Discover Lumière Jewels — diamond solitaires, 22K gold heirlooms and modern everyday pieces. Hallmarked, ethically sourced.",
      },
      { property: "og:title", content: "Lumière Jewels — Handcrafted fine jewellery" },
      {
        property: "og:description",
        content: "Diamond solitaires, 22K gold heirlooms and modern everyday pieces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    return jewelleryProducts.filter(
      (p) =>
        (activeCat === "all" || p.categoryId === activeCat) &&
        (q === "" ||
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.metal.toLowerCase().includes(q.toLowerCase())),
    );
  }, [q, activeCat]);

  const featured = jewelleryProducts.slice(0, 6);

  return (
    <div className="bg-[#faf6f1]">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f1c]/95 via-[#3a1f2d]/85 to-[#7a4a2d]/70" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200 backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Festive edit 2026
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Jewellery that <span className="italic text-amber-300">holds</span> a story.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Hand-crafted diamond solitaires, 22K gold heirlooms and modern everyday pieces —
              made by karigars, hallmarked by conscience.
            </p>

            <div className="mt-10 flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search rings, necklaces, gold…"
                  className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus-visible:ring-amber-300/40"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500"
              >
                Explore
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-300" /> BIS Hallmarked</span>
              <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-amber-300" /> Free insured shipping</span>
              <span className="inline-flex items-center gap-1.5"><Award className="h-4 w-4 text-amber-300" /> Lifetime buyback</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4">
              {[0, 3, 2, 4].map((i, k) => (
                <motion.button
                  key={k}
                  onClick={() => setOpenId(jewelleryProducts[i].id)}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={cn(
                    "group aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 shadow-2xl",
                    k === 0 && "translate-y-6",
                    k === 1 && "-translate-y-4",
                    k === 2 && "-translate-y-2",
                    k === 3 && "translate-y-4",
                  )}
                >
                  <img
                    src={jewelleryProducts[i].images[0]}
                    alt={jewelleryProducts[i].name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#3a1f2d] sm:text-4xl">
              Curated collections
            </h2>
          </div>
          <button
            onClick={() => setActiveCat("all")}
            className="text-sm font-medium text-[#3a1f2d]/70 hover:text-[#3a1f2d]"
          >
            View all →
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jewelleryCategories.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => {
                setActiveCat(c.id);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-black text-left shadow-lg transition hover:shadow-2xl"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent",
              )} />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br mix-blend-overlay opacity-40",
                c.accent,
              )} />
              <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                <p className="text-xs font-medium tracking-widest text-amber-200 uppercase">{c.tagline}</p>
                <h3 className="mt-1.5 font-display text-2xl font-bold">{c.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-white/70">{c.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ============ PRODUCTS ============ */}
      <section id="products" className="relative overflow-hidden bg-gradient-to-b from-[#f3e9dc] to-[#faf6f1] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">The collection</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#3a1f2d] sm:text-4xl">
                {activeCat === "all"
                  ? "Every piece, one place"
                  : jewelleryCategories.find((c) => c.id === activeCat)?.name}
              </h2>
            </div>
            <p className="text-sm text-[#3a1f2d]/60">{filtered.length} pieces</p>
          </div>

          {/* Category chips */}
          <div className="mb-10 flex flex-wrap gap-2">
            <CatChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
              All
            </CatChip>
            {jewelleryCategories.map((c) => (
              <CatChip
                key={c.id}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              >
                {c.name}
              </CatChip>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 8) * 0.04 }}
                onClick={() => setOpenId(p.id)}
                className="group relative overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-100 to-rose-100">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {p.tags.slice(0, 1).map((t) => (
                      <TagBadge key={t} name={t} variant="gold" />
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-medium">Tap to view details</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-[#3a1f2d]">{p.name}</p>
                  <p className="mt-0.5 text-xs text-[#3a1f2d]/60">{p.metal}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold text-[#3a1f2d]">{formatINR(p.price)}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-[#3a1f2d]/40 line-through">
                        {formatINR(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED STRIP ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0f1c] via-[#3a1f2d] to-[#1a0f1c] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">Loved this month</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Bestsellers</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 3).map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ y: -6 }}
                onClick={() => setOpenId(p.id)}
                className="group relative overflow-hidden rounded-3xl text-left"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-6">
                  <p className="font-display text-xl font-bold">{p.name}</p>
                  <p className="mt-1 text-sm text-amber-300">{formatINR(p.price)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        productId={openId}
        onClose={() => setOpenId(null)}
        products={activeCat === "all" ? jewelleryProducts : filtered}
      />
    </div>
  );
}

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active
          ? "border-[#3a1f2d] bg-[#3a1f2d] text-amber-200 shadow-lg"
          : "border-[#3a1f2d]/15 bg-white text-[#3a1f2d]/70 hover:border-[#3a1f2d]/40 hover:text-[#3a1f2d]",
      )}
    >
      {children}
    </button>
  );
}
