import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/_customer/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">Review items before sending an enquiry.</p>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Your cart is empty"
            description="Explore the catalog to add items."
            action={<Button asChild className="bg-primary hover:bg-primary-dark"><Link to="/">Browse catalog</Link></Button>}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card-surface divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button onClick={() => setQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-accent">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-accent">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="ml-auto text-sm text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="card-surface h-fit p-5">
            <h3 className="font-semibold">Summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Items</dt><dd>{items.reduce((s, i) => s + i.qty, 0)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <dt>Estimated total</dt><dd>${total.toFixed(2)}</dd>
              </div>
            </dl>
            <Button className="mt-4 w-full bg-primary hover:bg-primary-dark">Continue enquiry</Button>
            <Button asChild variant="outline" className="mt-2 w-full"><Link to="/">Continue shopping</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
