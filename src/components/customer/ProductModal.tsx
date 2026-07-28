import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ChevronLeft, ChevronRight, Maximize2, Printer } from "lucide-react";
import { useCartStore } from "@/store";
import { toast } from "sonner";
import { formatINR, type Jewel } from "@/lib/jewellery-data";
import { cn } from "@/lib/utils";
import { printProduct } from "@/lib/print-product";

type Props = {
  productId: string | null;
  onClose: () => void;
  products: Jewel[];
};

export function ProductModal({ productId, onClose, products }: Props) {
  const startIndex = Math.max(
    0,
    products.findIndex((p) => p.id === productId),
  );
  const [current, setCurrent] = useState(startIndex);
  const [fullscreenImg, setFullscreenImg] = useState<number | null>(null);

  useEffect(() => {
    if (productId) {
      const idx = products.findIndex((p) => p.id === productId);
      if (idx >= 0) setCurrent(idx);
    }
  }, [productId, products]);

  useEffect(() => {
    if (!productId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenImg !== null) setFullscreenImg(null);
        else onClose();
      } else if (e.key === "ArrowRight" && fullscreenImg === null) {
        setCurrent((c) => Math.min(products.length - 1, c + 1));
      } else if (e.key === "ArrowLeft" && fullscreenImg === null) {
        setCurrent((c) => Math.max(0, c - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [productId, fullscreenImg, onClose, products.length]);

  const open = productId !== null;
  if (!open || products.length === 0) return null;

  const product = products[Math.min(current, products.length - 1)] || products[0];

  const goNext = () => setCurrent((c) => Math.min(products.length - 1, c + 1));
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[99] grid h-10 w-10 place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Nav chevrons */}
            {products.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  disabled={current === 0}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[95] grid h-11 w-11 place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white transition disabled:opacity-25 disabled:pointer-events-none"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  disabled={current === products.length - 1}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[95] grid h-11 w-11 place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white transition disabled:opacity-25 disabled:pointer-events-none"
                  aria-label="Next product"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Card with swipe */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  drag="x"
                  dragElastic={0.15}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_e, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) goNext();
                    else if (info.offset.x > 60 || info.velocity.x > 400) goPrev();
                  }}
                  style={{ touchAction: "pan-y" }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#3a1f2d]/5 overflow-hidden cursor-grab active:cursor-grabbing"
                >
                  <ProductCardContent
                    product={product}
                    onFullscreen={(i) => setFullscreenImg(i)}
                  />
                </motion.div>
              </AnimatePresence>

              {products.length > 1 && (
                <div className="mt-3 text-center text-xs text-white/60 select-none">
                  {current + 1} / {products.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen image */}
      <AnimatePresence>
        {fullscreenImg !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setFullscreenImg(null)}
          >
            <button
              onClick={() => setFullscreenImg(null)}
              className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white z-[90]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenImg((p) =>
                      p !== null ? (p - 1 + product.images.length) % product.images.length : null,
                    );
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white z-[90]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenImg((p) =>
                      p !== null ? (p + 1) % product.images.length : null,
                    );
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white z-[90]"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <motion.img
              key={fullscreenImg}
              src={product.images[fullscreenImg]}
              alt={product.name}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-full max-h-full object-contain rounded-lg select-none"
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProductCardContent({
  product,
  onFullscreen,
}: {
  product: Jewel;
  onFullscreen: (idx: number) => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const cartItems = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const cartItem = cartItems.find((i) => i.id === product.id);
  const qty = cartItem ? cartItem.qty : 0;

  useEffect(() => setImgIdx(0), [product.id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
      {/* Image */}
      <div className="bg-[#faf6f1] p-4 sm:p-6 md:p-7 flex flex-col gap-3">
        <button
          onClick={() => onFullscreen(imgIdx)}
          className="relative aspect-square w-full overflow-hidden rounded-xl bg-white border border-[#3a1f2d]/5 group"
        >
          <img
            src={product.images[imgIdx]}
            alt={product.name}
            draggable={false}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/85 backdrop-blur text-[#3a1f2d] shadow opacity-0 group-hover:opacity-100 transition">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
        {product.images.length > 1 && (
          <div className="flex justify-center gap-2">
            {product.images.map((src, idx) => (
              <button
                key={src + idx}
                onClick={() => setImgIdx(idx)}
                className={cn(
                  "h-11 w-11 shrink-0 rounded-md overflow-hidden border-2 transition",
                  idx === imgIdx
                    ? "border-[#3a1f2d]"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 sm:p-7 md:p-8 flex flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-amber-700 uppercase">
              Signature
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-[#3a1f2d]">
              {product.name}
            </h2>
          </div>
          <button
            onClick={() => printProduct(product)}
            className="shrink-0 grid h-9 w-9 place-items-center rounded-full border border-[#3a1f2d]/15 text-[#3a1f2d]/70 hover:bg-[#faf6f1] hover:text-[#3a1f2d] transition"
            aria-label="Print product details"
            title="Print / Save as PDF"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 font-display text-2xl font-bold text-[#3a1f2d]">
          {formatINR(product.price)}
        </p>

        {product.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#3a1f2d]/5 text-[#3a1f2d]/70 uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-[#3a1f2d]/10 pt-3 text-sm text-[#3a1f2d]/75 leading-relaxed font-light line-clamp-4">
          {product.description}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {[
            ["Metal", product.metal],
            ["Purity", product.purity],
            ["Weight", product.weight],
            ["Stones", product.stones],
          ]
            .filter(([, v]) => !!v)
            .map(([k, v]) => (
              <div key={k as string} className="flex flex-col">
                <dt className="text-[10px] uppercase tracking-widest text-[#3a1f2d]/50">{k}</dt>
                <dd className="mt-0.5 font-medium text-[#3a1f2d]">{v}</dd>
              </div>
            ))}
        </dl>

        <div className="mt-auto pt-5 flex justify-end">
          {qty === 0 ? (
            <button
              onClick={() => {
                add({ id: product.id, name: product.name, price: product.price, qty: 1 });
                toast.success(`${product.name} added`, { duration: 1500 });
              }}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#3a1f2d] text-white hover:bg-[#3a1f2d]/90 transition shadow-sm"
              aria-label="Add to cart"
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            <div className="inline-flex items-center rounded-full border border-[#3a1f2d]/15 bg-white h-10">
              <button
                onClick={() => {
                  if (qty === 1) {
                    remove(product.id);
                  } else {
                    setQty(product.id, qty - 1);
                  }
                }}
                className="grid h-full w-9 place-items-center text-[#3a1f2d]/70 hover:text-[#3a1f2d] rounded-l-full"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-semibold text-[#3a1f2d]">
                {qty}
              </span>
              <button
                onClick={() => setQty(product.id, qty + 1)}
                className="grid h-full w-9 place-items-center text-[#3a1f2d]/70 hover:text-[#3a1f2d] rounded-r-full"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
