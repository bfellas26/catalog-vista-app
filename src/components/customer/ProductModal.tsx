import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store";
import { toast } from "sonner";
import { formatINR, type Jewel } from "@/lib/jewellery-data";
import { cn } from "@/lib/utils";

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
  const [activeFullscreenImageIdx, setActiveFullscreenImageIdx] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(720);

  // Sync index when productId shifts from outside
  useEffect(() => {
    if (productId) {
      const idx = products.findIndex((p) => p.id === productId);
      if (idx >= 0) {
        setCurrent(idx);
      }
    }
  }, [productId, products]);

  // Handle window resizing to calculate responsive cardWidth size in pixels
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setCardWidth(768);
      } else if (w >= 768) {
        // iPad/Tablet size: fill viewport and peek by 44px
        setCardWidth(w - 120);
      } else {
        // Mobile size: fill viewport and peek by 30px
        setCardWidth(Math.max(280, w - 92));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle keyboard events (escape key to close)
  useEffect(() => {
    if (!productId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeFullscreenImageIdx !== null) setActiveFullscreenImageIdx(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [productId, activeFullscreenImageIdx, onClose]);

  const open = productId !== null;
  if (!open || products.length === 0) return null;

  const product = products[Math.min(current, products.length - 1)] || products[0];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Close Button placed on the dark backdrop boundary */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[99] grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white shadow-md transition cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Container: transparent viewport containing the swipe stack */}
            {(() => {
              const containerWidth = Math.min(window.innerWidth, 1024);
              const x_0 = (containerWidth - cardWidth) / 2;
              const x_last = x_0 - (products.length - 1) * (cardWidth + 16);

              return (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl overflow-hidden h-[85vh] max-h-[580px] sm:max-h-[640px] lg:max-h-[680px] flex flex-col justify-center items-center"
                >
                  {/* Swipable Card Slider */}
                  <div className="flex-1 overflow-hidden relative w-full h-full flex items-center">
                    <motion.div
                      drag="x"
                      dragElastic={0.2}
                      dragConstraints={{ left: x_last, right: x_0 }}
                      animate={{
                        x: x_0 - current * (cardWidth + 16),
                      }}
                      onDragEnd={(event, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x < -swipeThreshold && current < products.length - 1) {
                          setCurrent(current + 1);
                        } else if (info.offset.x > swipeThreshold && current > 0) {
                          setCurrent(current - 1);
                        }
                      }}
                      className="flex gap-4 h-full items-center py-4 select-none cursor-grab active:cursor-grabbing"
                    >
                      {products.map((p, idx) => (
                        <SwipeCardContent
                          key={p.id}
                          product={p}
                          active={idx === current}
                          cardWidth={cardWidth}
                          onFullscreen={(imgIdx) => setActiveFullscreenImageIdx(imgIdx)}
                        />
                      ))}
                    </motion.div>
                  </div>

                  {/* Desktop Nav Chevrons (only helper controls showing when multiple products exist) */}
                  {products.length > 1 && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:flex justify-between pointer-events-none px-4 z-[95]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (current > 0) setCurrent(current - 1);
                        }}
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-full bg-black/30 hover:bg-black/50 text-white transition pointer-events-auto",
                          current === 0 && "opacity-20 pointer-events-none"
                        )}
                        aria-label="Previous product"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (current < products.length - 1) setCurrent(current + 1);
                        }}
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-full bg-black/30 hover:bg-black/50 text-white transition pointer-events-auto",
                          current === products.length - 1 && "opacity-20 pointer-events-none"
                        )}
                        aria-label="Next product"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Overlay */}
      <AnimatePresence>
        {activeFullscreenImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/95 flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveFullscreenImageIdx(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition z-[90] cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Chevron Button */}
            {product.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFullscreenImageIdx((prev) =>
                    prev !== null
                      ? (prev - 1 + product.images.length) % product.images.length
                      : null,
                  );
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-[90] cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Right Chevron Button */}
            {product.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFullscreenImageIdx((prev) =>
                    prev !== null ? (prev + 1) % product.images.length : null,
                  );
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-[90] cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Main Image Slider Container */}
            <div className="relative w-full max-w-3xl aspect-square sm:aspect-[4/3] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" custom={activeFullscreenImageIdx}>
                <motion.img
                  key={activeFullscreenImageIdx}
                  src={product.images[activeFullscreenImageIdx]}
                  alt={`${product.name} zoom`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(event, info) => {
                    if (info.offset.x < -60) {
                      setActiveFullscreenImageIdx((prev) =>
                        prev !== null ? (prev + 1) % product.images.length : null,
                      );
                    } else if (info.offset.x > 60) {
                      setActiveFullscreenImageIdx((prev) =>
                        prev !== null
                          ? (prev - 1 + product.images.length) % product.images.length
                          : null,
                      );
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing select-none"
                />
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-8 flex gap-2 z-[90]">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFullscreenImageIdx(idx)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300 cursor-pointer",
                      idx === activeFullscreenImageIdx
                        ? "bg-white w-6"
                        : "bg-white/40 hover:bg-white/70",
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SwipeCardContent({
  product,
  onFullscreen,
  active,
  cardWidth,
}: {
  product: Jewel;
  onFullscreen: (idx: number) => void;
  active: boolean;
  cardWidth: number;
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((s) => s.add);

  // Reset indices when product changes
  useEffect(() => {
    setActiveImgIdx(0);
    setQty(1);
  }, [product]);

  const activeImage =
    product.images[Math.min(activeImgIdx, product.images.length - 1)] || product.images[0];

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, qty });
    toast.success(`${qty}x ${product.name} added to cart`, { duration: 1500 });
  };

  return (
    <div
      style={{ width: cardWidth }}
      className={cn(
        "shrink-0 bg-white rounded-3xl shadow-2xl border border-[#3a1f2d]/5 flex flex-col sm:flex-row h-full overflow-hidden transition-all duration-300 relative",
        active ? "scale-100 opacity-100" : "scale-95 opacity-40 pointer-events-none"
      )}
    >
      {/* Image Gallery Column */}
      <div className="w-full sm:w-1/2 flex flex-col p-4 sm:p-6 lg:p-8 bg-[#faf6f1] justify-center items-center border-b sm:border-b-0 sm:border-r border-[#3a1f2d]/5 overflow-y-auto sm:overflow-y-visible">
        {/* Main image - Aspect square */}
        <div
          onClick={() => active && onFullscreen(activeImgIdx)}
          className={cn(
            "relative aspect-square w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[340px] overflow-hidden rounded-2xl bg-white border border-[#3a1f2d]/5 shadow-sm group",
            active && "cursor-zoom-in"
          )}
        >
          <img
            src={activeImage}
            alt={product.name}
            draggable={false}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 lg:mt-4 overflow-x-auto w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[340px] py-1 select-none">
            {product.images.map((src, idx) => (
              <button
                key={src + idx}
                onClick={() => active && setActiveImgIdx(idx)}
                className={cn(
                  "box-border h-9 w-9 lg:h-11 lg:w-11 shrink-0 rounded-lg overflow-hidden border-2 bg-white transition",
                  idx === activeImgIdx
                    ? "border-[#3a1f2d]"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
                disabled={!active}
              >
                <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Column */}
      <div className="w-full sm:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto overflow-x-hidden max-h-[50vh] sm:max-h-full">
        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">
            {product.name}
          </h2>

          <div className="font-display text-xl lg:text-2xl font-bold text-[#3a1f2d]">
            {formatINR(product.price)}
          </div>

          <div className="border-t border-[#3a1f2d]/5 pt-3 lg:pt-4">
            <p className="text-xs sm:text-sm font-light leading-relaxed text-[#3a1f2d]/80 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Quantity and Add buttons */}
        <div className="mt-4 sm:mt-6 lg:mt-8 border-t border-[#3a1f2d]/5 pt-4 lg:pt-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center rounded-lg border border-[#3a1f2d]/15 bg-white shrink-0 h-10 w-28">
              <button
                onClick={() => active && setQty((q) => Math.max(1, q - 1))}
                className="w-9 text-[#3a1f2d]/70 hover:bg-[#faf6f1] transition h-full rounded-l-lg flex items-center justify-center"
                disabled={!active}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold select-none">{qty}</span>
              <button
                onClick={() => active && setQty((q) => q + 1)}
                className="w-9 text-[#3a1f2d]/70 hover:bg-[#faf6f1] transition h-full rounded-r-lg flex items-center justify-center"
                disabled={!active}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={() => active && handleAdd()}
              className="w-full sm:flex-grow bg-[#3a1f2d] hover:bg-[#3a1f2d]/90 text-white rounded-lg h-10 text-sm font-medium border-none flex-grow"
              disabled={!active}
            >
              <ShoppingBag className="mr-1.5 h-4 w-4 inline" /> Add to Enquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
