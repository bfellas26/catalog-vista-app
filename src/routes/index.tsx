import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Store,
  Package,
  Users,
  BarChart3,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catalogo — Digital Catalog SaaS for modern brands" },
      {
        name: "description",
        content:
          "Catalogo is a multi-tenant digital catalog platform. Manage products, categories, subscribers and enquiries — all from one beautiful dashboard.",
      },
      { property: "og:title", content: "Catalogo — Digital Catalog SaaS" },
      {
        property: "og:description",
        content: "A multi-tenant digital catalog platform for modern brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: Package,
    title: "Product catalog",
    body: "Organize products, variants, tags and rich media in a clean, structured catalog.",
  },
  {
    icon: Store,
    title: "Multi-tenant by design",
    body: "Every brand gets its own storefront, admin portal and customer-facing catalog.",
  },
  {
    icon: Users,
    title: "Subscribers & enquiries",
    body: "Capture customer interest, manage enquiries and grow a subscriber base.",
  },
  {
    icon: BarChart3,
    title: "Insights that matter",
    body: "Track views, top products and category performance at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    body: "Super Admins manage the platform. Business Admins run their own catalog.",
  },
  {
    icon: Zap,
    title: "Fast to launch",
    body: "Sensible defaults, thoughtful UX — go from sign-up to live catalog in minutes.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-sm font-bold">C</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Catalogo
            </span>
          </Link>

          <nav className="ml-8 hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <Link to="/catalog" className="hover:text-foreground">Demo catalog</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link to="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-dark">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3 text-gold" />
              Digital Catalog Platform
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Beautifully organized catalogs,{" "}
              <span className="text-primary">effortlessly shared.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Catalogo is a multi-tenant SaaS that helps modern brands manage
              products, categories, subscribers and customer enquiries — all
              from one calm, thoughtful dashboard.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                  Sign In <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/catalog">
                <Button size="lg" variant="outline">
                  View a demo catalog
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything you need to run a modern catalog
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for brands that care about how their products are presented —
            and for platforms that want to host many of them at once.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-surface p-6"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © 2025 Catalogo. Crafted for modern brands.
        </div>
      </footer>
    </div>
  );
}

function PortalCard({
  icon: Icon,
  title,
  body,
  cta,
  to,
  variant = "primary",
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  cta: string;
  to: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <div className="card-surface flex flex-col p-6">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <Link to={to} className="mt-6">
        <Button
          className={
            variant === "primary"
              ? "w-full bg-primary text-primary-foreground hover:bg-primary-dark"
              : "w-full"
          }
          variant={variant === "primary" ? "default" : "outline"}
        >
          {cta} <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
