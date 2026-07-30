import { Outlet, Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
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
import { jewelleryProducts } from "@/lib/jewellery-data";
import { z } from "zod";

const customerSearchSchema = z.object({
  onlyCatalogue: z.boolean().or(z.string().transform((v) => v === "true")).optional(),
});

export const Route = createFileRoute("/_customer")({
  validateSearch: (search) => customerSearchSchema.parse(search),
  component: CustomerLayout,
});

function CustomerLayout() {
  const search = Route.useSearch();
  const onlyCatalogue = !!search.onlyCatalogue;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const { cartOpen, setCartOpen } = useUIStore();

  return (
    <div className="flex min-h-screen flex-col bg-[#faf6f1] text-[#3a1f2d] font-sans antialiased">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-[#3a1f2d]/5 bg-[#faf6f1]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/catalog" search={(prev) => prev} className="group flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#3a1f2d]/10">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-[#3a1f2d]">
              Lumière <span className="font-light italic text-[#3a1f2d]/85">Jewels</span>
            </span>
          </Link>

          <nav className="ml-8 hidden items-center gap-6 text-sm font-light text-[#3a1f2d]/70 md:flex">
            <Link
              to="/catalog"
              search={(prev) => prev}
              className="hover:text-[#3a1f2d] transition"
              activeProps={{ className: "text-[#3a1f2d] font-medium" }}
            >
              Collection
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {!onlyCatalogue && (
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <button className="relative rounded-full p-2.5 text-[#3a1f2d]/70 hover:bg-[#3a1f2d]/5 hover:text-[#3a1f2d] transition">
                    <ShoppingBag className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute top-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-[#3a1f2d] text-[9px] font-bold text-white">
                        {cartItems.reduce((count, item) => count + item.qty, 0)}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <CartDrawerContent />
              </Sheet>
            )}

            <button
              className="rounded-full p-2.5 text-[#3a1f2d]/70 hover:bg-[#3a1f2d]/5 hover:text-[#3a1f2d] md:hidden transition"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#3a1f2d]/5 bg-white px-6 py-4 md:hidden space-y-3">
            <Link
              to="/catalog"
              search={(prev) => prev}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium hover:text-[#3a1f2d]"
            >
              Collection
            </Link>
          </div>
        )}
      </header>

      {/* Main View Transition wrapper */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {!onlyCatalogue && <Footer />}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-[#3a1f2d]/5 bg-white text-[#3a1f2d]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#3a1f2d]/10">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-display text-lg font-semibold text-[#3a1f2d]">
              Lumière Jewels
            </span>
          </div>
          <p className="mt-4 text-xs text-[#3a1f2d]/60 font-light leading-relaxed">
            Hand-crafted fine jewellery. Crafting beautiful designs since 1996.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#3a1f2d]/80">Shop</p>
          <ul className="mt-4 space-y-2.5 text-sm text-[#3a1f2d]/70 font-light">
            <li>
              <Link to="/catalog" className="hover:text-[#3a1f2d] transition">
                Catalog
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#3a1f2d]/80">Contact</p>
          <ul className="mt-4 space-y-2.5 text-xs text-[#3a1f2d]/70 font-light">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-50" /> concierge@lumierejewels.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 opacity-50" /> +351 21 000 0000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-50" /> Lisbon, PT
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#3a1f2d]/80">Follow</p>
          <div className="mt-4 flex gap-2">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full border border-[#3a1f2d]/10 p-2 text-[#3a1f2d]/60 transition hover:border-[#3a1f2d]/40 hover:text-[#3a1f2d] hover:bg-[#faf6f1]/50"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#3a1f2d]/5 px-4 py-6 text-center text-[10px] uppercase tracking-wider text-[#3a1f2d]/40 sm:px-6 lg:px-8">
        © 2026 Lumière Jewels. All rights reserved.
      </div>
    </footer>
  );
}

function CartDrawerContent() {
  const { items, setQty, remove } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const getProductImage = (id: string) => {
    return jewelleryProducts.find((p) => p.id === id)?.images[0] || "";
  };

  const handleWhatsappEnquiry = () => {
    if (items.length === 0) return;

    const formattedItems = items
      .map(
        (item) =>
          `• ${item.name}\n  Qty: ${item.qty}\n  Price: ₹${item.price.toLocaleString("en-IN")} each\n  Subtotal: ₹${(
            item.price * item.qty
          ).toLocaleString("en-IN")}`,
      )
      .join("\n\n");

    const message = `Hi! I would like to make an enquiry regarding the following items in my catalogue cart:\n\n${formattedItems}\n\nEstimated Total: ₹${total.toLocaleString(
      "en-IN",
    )}\n\nThank you!`;

    const url = `https://wa.me/917904561269?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleEmailEnquiry = () => {
    if (items.length === 0) return;

    const formattedItems = items
      .map(
        (item) =>
          `• ${item.name} (Qty: ${item.qty}, Price: ₹${item.price.toLocaleString("en-IN")} each, Subtotal: ₹${(
            item.price * item.qty
          ).toLocaleString("en-IN")})`,
      )
      .join("\n");

    const subject = "Catalogue Item Enquiry - Lumière Jewels";
    const body = `Hi,\n\nI would like to make an enquiry regarding the following items from the catalogue:\n\n${formattedItems}\n\nTotal Estimated Price: ₹${total.toLocaleString(
      "en-IN",
    )}\n\nThank you!`;

    const mailtoUrl = `mailto:bfellas26@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  return (
    <SheetContent className="flex w-full flex-col bg-white text-[#3a1f2d] border-[#3a1f2d]/5 sm:max-w-md">
      <SheetHeader className="pb-4 border-b border-[#3a1f2d]/5">
        <SheetTitle className="font-display text-xl font-semibold">Your Cart</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <ShoppingBag className="h-10 w-10 text-[#3a1f2d]/20" />
            <p className="mt-4 text-base font-medium">Your cart is empty</p>
            <p className="text-xs text-[#3a1f2d]/50 font-light mt-1">
              Browse the collections to add items for enquiry.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const img = getProductImage(item.id);
              return (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-[#3a1f2d]/5 bg-[#faf6f1]/30 p-4 shadow-sm"
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-xl object-cover border border-[#3a1f2d]/5"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-xl bg-[#faf6f1] border border-[#3a1f2d]/5" />
                  )}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs font-semibold text-[#3a1f2d]/70 mt-0.5">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-[#3a1f2d]/15 bg-white scale-90 -ml-1">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="p-1 px-2.5 text-[#3a1f2d]/70 hover:bg-[#faf6f1] transition h-7 rounded-l-lg border-none"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="p-1 px-2.5 text-[#3a1f2d]/70 hover:bg-[#faf6f1] transition h-7 rounded-r-lg border-none"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-[#3a1f2d]/45 hover:text-red-500 rounded p-1 hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-[#3a1f2d]/5 pt-4 mt-auto space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3a1f2d]/60">
            Total Estimated Price
          </span>
          <span className="text-xl font-bold font-display text-[#3a1f2d]">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleWhatsappEnquiry}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl h-10 border-none font-medium text-xs flex items-center justify-center gap-2"
            disabled={items.length === 0}
          >
            Send WhatsApp Enquiry
          </Button>
          <Button
            onClick={handleEmailEnquiry}
            className="w-full bg-[#3a1f2d] hover:bg-[#3a1f2d]/90 text-white rounded-xl h-10 border-none font-medium text-xs flex items-center justify-center gap-2"
            disabled={items.length === 0}
          >
            <Mail className="h-3.5 w-3.5" />
            Send Email Enquiry
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
