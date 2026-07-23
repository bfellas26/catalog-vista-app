import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/common/Badges";
import { placeholderCategories, placeholderProducts } from "@/lib/placeholders";

export const Route = createFileRoute("/_customer/catalog")({
  head: () => ({
    meta: [
      { title: "Aurora Studio — Thoughtfully designed goods" },
      {
        name: "description",
        content: "Explore Aurora Studio's catalog of curated goods for modern living.",
      },
    ],
  }),
  component: CustomerHome,
});

function CustomerHome() {
  const featured = placeholderProducts.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3 text-gold" />
              Spring collection 2025
            </div>
            <h1 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Thoughtfully designed goods for modern living.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              A carefully curated catalog of pieces that combine craft, comfort
              and quiet character. Browse the collection.
            </p>

            <div className="mt-8 flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search the catalog…" className="pl-9" />
              </div>
              <Button className="bg-primary hover:bg-primary-dark">Search</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent to-gold/10">
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <div className="text-center">
                  <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-card shadow-sm">
                    <span className="font-display text-2xl font-bold text-primary">A</span>
                  </div>
                  <p className="text-xs font-medium tracking-widest uppercase">Brand banner placeholder</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured standalone products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured</h2>
            <p className="mt-1 text-sm text-muted-foreground">Hand-picked pieces this month.</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to="/product/$id" params={{ id: p.id }} className="group block">
                <div className="aspect-square overflow-hidden rounded-2xl bg-accent transition group-hover:shadow-md" />
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    {p.tags.slice(0, 1).map((t) => <TagBadge key={t} name={t} variant="gold" />)}
                  </div>
                  <p className="mt-1.5 font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">${p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Browse categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find what you're looking for.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderCategories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to="/category/$id"
                  params={{ id: c.id }}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 font-display text-lg font-bold text-primary">
                    {c.categoryName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.categoryName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card-surface flex flex-col items-center gap-6 p-10 text-center sm:p-14">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Stay in the loop</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Occasional emails about new arrivals and quiet updates. No spam.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <Input placeholder="you@email.com" type="email" />
            <Button type="submit" className="bg-primary hover:bg-primary-dark">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
