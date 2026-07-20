import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Store, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login/")({
  head: () => ({
    meta: [{ title: "Login Gateway — Catalogo" }],
  }),
  component: LoginIndexPage,
});

function LoginIndexPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Branding Column */}
      <div className="relative hidden overflow-hidden bg-primary p-12 lg:block">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="relative flex h-full flex-col justify-between text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground text-primary">
              <span className="font-display font-bold">C</span>
            </div>
            <span className="font-display text-lg font-semibold">Catalogo</span>
          </Link>

          <div className="max-w-md">
            <h1 className="font-display text-4xl leading-tight font-bold">
              Welcome to the Catalogo portal.
            </h1>
            <p className="mt-4 text-primary-foreground/80 leading-relaxed text-sm">
              Whether you are managing your store's catalogues or overseeing the entire SaaS platform, choose your gateway to sign in.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/60 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>
      </div>

      {/* Gateway Panel Choice */}
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 block lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-display text-sm font-bold">C</span>
              </div>
              <span className="font-display text-md font-semibold">Catalogo</span>
            </Link>
          </div>

          <div className="mb-10 text-left">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Choose your portal
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select the appropriate account gateway and proceed to sign in.
            </p>
          </div>

          <div className="space-y-6">
            {/* Business Card Choice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/login/business"
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md cursor-pointer group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Store className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    Business Login
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Access your digital product catalog, configure categories, products, enquiries, and manage subscribers list.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Super Admin Card Choice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Link
                to="/login/admin"
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md cursor-pointer group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    Super Admin Login
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Access SaaS platform configuration, oversee registered clients list, plans structure, settings and activity analytics.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 text-center text-xs text-muted-foreground lg:hidden">
            <Link to="/" className="hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
