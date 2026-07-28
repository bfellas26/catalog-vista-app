import { useEffect, useRef, useState } from "react";
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

// Peek gap on each side (px) — adjacent card edge visible by this amount
const PEEK = 28;
const GAP = 12;

export function ProductModal({ productId, onClose, products }: Props) {
  const startIndex = Math.max(0, products.findIndex((p) => p.id === productId));
  const [current, setCurrent] = useState(startIndex);
  const [fullscreenImg, setFullscreenImg] = useState<number | null>(null);

  // Native swipe tracking state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiping = useRef(false);

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

  // Native touch/pointer handlers for reliable mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swiping.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only handle if horizontal swipe is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // If vertical movement dominates, mark as scrolling not swiping
    if (dy > dx && dy > 10) {
      swiping.current = true;
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Top bar: close + indicator dots */}
            <div
              className="flex items-center justify-between px-4 pt-safe pt-3 pb-2 z-[99]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {products.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`block rounded-full transition-all ${
                        i === current
                          ? "w-5 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Desktop nav chevrons (shown only on lg+) */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  disabled={current === 0}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white transition disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  disabled={current === products.length - 1}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white transition disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              {/* spacer for small screens to balance the layout */}
              <div className="lg:hidden w-9" />
            </div>

            {/* Cards viewport */}
            <div
              className="w-full relative overflow-hidden flex items-start pb-4"
              style={{ maxHeight: "calc(100vh - 80px)" }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Sliding track: all cards laid out horizontally */}
              <motion.div
                className="flex items-start"
                style={{ gap: GAP }}
                animate={{
                  x: -(current * (window.innerWidth - PEEK * 2 + GAP)) + PEEK,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
              >
                {products.map((p, idx) => (
                  <div
                    key={p.id}
                    style={{ width: window.innerWidth - PEEK * 2, flexShrink: 0 }}
                    className={cn(
                      "transition-opacity duration-300",
                      idx === current ? "opacity-100" : "opacity-50 pointer-events-none"
                    )}
                  >
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#3a1f2d]/5 overflow-hidden">
                      <ProductCardContent
                        product={p}
                        onFullscreen={(i) => setFullscreenImg(i)}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-full overflow-hidden">
      {/* Image */}
      <div className="bg-[#faf6f1] p-4 sm:p-6 flex flex-col gap-3 overflow-y-auto">
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
          <div className="flex justify-center gap-2 flex-wrap">
            {product.images.map((src, idx) => (
              <button
                key={src + idx}
                onClick={() => setImgIdx(idx)}
                className={cn(
                  "h-10 w-10 shrink-0 rounded-md overflow-hidden border-2 transition",
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
      <div className="p-5 sm:p-6 md:p-8 flex flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-amber-700 uppercase">
              Signature
            </p>
            <h2 className="mt-1.5 font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight text-[#3a1f2d]">
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

        <p className="mt-3 font-display text-xl sm:text-2xl font-bold text-[#3a1f2d]">
          {formatINR(product.price)}
        </p>

        <div className="mt-4 border-t border-[#3a1f2d]/10 pt-3 text-sm text-[#3a1f2d]/75 leading-relaxed font-light">
          {product.description}
        </div>

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
