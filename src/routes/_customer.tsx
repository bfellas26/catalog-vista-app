import { Outlet, Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Menu,
  X,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useCartStore, useUIStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/_customer")({
  component: CustomerLayout,
});

function CustomerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const { cartOpen, setCartOpen } = useUIStore();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-sm font-bold">A</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Aurora Studio
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              Home
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-64 rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                placeholder="Search catalog…"
              />
            </div>

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <CartDrawerContent />
            </Sheet>

            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-card px-4 py-3 md:hidden">
            <Link to="/" className="block py-2 text-sm">
              Home
            </Link>
            <Link to="/contact" className="block py-2 text-sm">
              Contact
            </Link>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-sm font-bold">A</span>
            </div>
            <span className="font-display text-lg font-semibold">Aurora Studio</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Thoughtfully designed goods for modern living.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Catalog</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@aurora.studio</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 010-0199</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lisbon, PT</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Follow</p>
          <div className="mt-3 flex gap-2">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        © 2025 Aurora Studio. Powered by Catalogo.
      </div>
    </footer>
  );
}

function CartDrawerContent() {
  const { items, setQty, remove } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-md">
      <SheetHeader>
        <SheetTitle className="font-display">Your cart</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Your cart is empty</p>
            <p className="text-xs text-muted-foreground">Browse the catalog to add items.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 rounded-xl border border-border p-3">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="rounded border border-border p-1 hover:bg-accent"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="rounded border border-border p-1 hover:bg-accent"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="text-lg font-bold">${total.toFixed(2)}</span>
        </div>
        <Button className="mt-3 w-full bg-primary hover:bg-primary-dark" disabled={items.length === 0}>
          Continue enquiry
        </Button>
      </div>
    </SheetContent>
  );
}
