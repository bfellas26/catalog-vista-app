import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store";
import { EmptyState } from "@/components/common/EmptyState";
import { formatINR, jewelleryProducts } from "@/lib/jewellery-data";

export const Route = createFileRoute("/_customer/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-[#3a1f2d]">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3a1f2d]/60 hover:text-[#3a1f2d] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Continue browsing
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
        Your Cart
      </h1>
      <p className="mt-2 text-sm text-[#3a1f2d]/60 font-light">
        Review items and modify quantities before continuing on WhatsApp.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 bg-white rounded-3xl border border-[#3a1f2d]/5 p-12 text-center shadow-sm">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8 text-[#3a1f2d]/20" />}
            title="Your cart is empty"
            description="Explore the collections to add items for enquiry."
            action={
              <Button
                asChild
                className="bg-[#3a1f2d] hover:bg-[#3a1f2d]/90 text-white rounded-xl h-10 border-none font-medium text-xs mt-4"
              >
                <Link to="/catalog">Browse catalogue</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Item List */}
          <div className="bg-white rounded-3xl border border-[#3a1f2d]/5 p-6 shadow-sm divide-y divide-[#3a1f2d]/5 space-y-4">
            {items.map((item, idx) => {
              const img = getProductImage(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex gap-4 py-4 first:pt-0 last:pb-0",
                    idx > 0 && "pt-6 border-t border-[#3a1f2d]/5",
                  )}
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover border border-[#3a1f2d]/5 shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 rounded-2xl bg-[#faf6f1] border border-[#3a1f2d]/5" />
                  )}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-medium text-sm sm:text-base leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#3a1f2d]/60 mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="inline-flex items-center rounded-lg border border-[#3a1f2d]/15 bg-white">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="p-1 px-2.5 text-[#3a1f2d]/70 hover:bg-[#faf6f1] transition h-8 rounded-l-lg border-none"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="p-1 px-2.5 text-[#3a1f2d]/70 hover:bg-[#faf6f1] transition h-8 rounded-r-lg border-none"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-[#3a1f2d]/45 hover:text-red-500 rounded p-1.5 hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-sm sm:text-base pr-2 select-none shrink-0 font-display">
                    {formatINR(item.price * item.qty)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary Card */}
          <div className="bg-white rounded-3xl border border-[#3a1f2d]/5 p-6 shadow-sm h-fit space-y-6">
            <h3 className="font-display font-semibold text-lg pb-3 border-b border-[#3a1f2d]/5">
              Enquiry Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-light text-[#3a1f2d]/70">
                <span>Unique Items</span>
                <span className="font-medium font-mono">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm font-light text-[#3a1f2d]/70">
                <span>Total Items Count</span>
                <span className="font-medium font-mono">
                  {items.reduce((s, i) => s + i.qty, 0)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#3a1f2d]/5 pt-4 text-base font-semibold leading-none select-none">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3a1f2d]/60 mt-0.5 animate-pulse">
                  Total Estimated
                </span>
                <span className="text-lg font-bold font-display text-[#3a1f2d]">
                  {formatINR(total)}
                </span>
              </div>
            </div>
            <div className="pt-2 space-y-2.5">
              <Button
                onClick={handleWhatsappEnquiry}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl h-11 border-none font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="h-4 w-4 fill-current" />
                Send WhatsApp Enquiry
              </Button>
              <Button
                onClick={handleEmailEnquiry}
                className="w-full bg-[#3a1f2d] hover:bg-[#3a1f2d]/90 text-white rounded-xl h-11 border-none font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Mail className="h-4 w-4" />
                Send Email Enquiry
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#3a1f2d]/10 hover:bg-[#faf6f1] text-[#3a1f2d]/80 rounded-xl h-10 hover:text-[#3a1f2d] text-xs mt-1"
              >
                <Link to="/catalog">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cn class merger helper
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
