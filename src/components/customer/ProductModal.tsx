import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/common/Badges";
import { useCartStore } from "@/store";
import { toast } from "sonner";
import { formatINR, jewelleryProducts, type Jewel } from "@/lib/jewellery-data";
import { cn } from "@/lib/utils";

type Props = {
  productId: string | null;
  onClose: () => void;
  products?: Jewel[];
};

export function ProductModal({ productId, onClose, products = jewelleryProducts }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [thumbIdx, setThumbIdx] = useState(0);
  const startIndex = Math.max(0, products.findIndex((p) => p.id === productId));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: startIndex < 0 ? 0 : startIndex,
    duration: 28,
  });

  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrent(emblaApi.selectedScrollSnap());
      setThumbIdx(0);
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (productId && emblaApi) {
      const idx = products.findIndex((p) => p.id === productId);
      if (idx >= 0) emblaApi.scrollTo(idx, true);
    }
  }, [productId, emblaApi, products]);

  useEffect(() => {
    if (!productId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreen) setFullscreen(false);
        else onClose();
      }
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key.toLowerCase() === "f") setFullscreen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [productId, emblaApi, fullscreen, onClose]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const add = useCartStore((s) => s.add);
  const open = productId !== null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative overflow-hidden bg-gradient-to-br from-[#1a0f1c] via-[#2a1930] to-[#1a0f1c] text-white shadow-2xl",
              fullscreen
                ? "h-full w-full rounded-none"
                : "max-h-[92vh] w-full max-w-6xl rounded-3xl",
            )}
          >
            {/* Toolbar */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              <button
                onClick={() => setFullscreen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Prev/Next buttons — always visible, larger in fullscreen */}
            <button
              onClick={scrollPrev}
              className={cn(
                "absolute top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25",
                fullscreen ? "left-6 h-14 w-14" : "left-3 h-11 w-11 sm:left-5",
              )}
              aria-label="Previous product"
            >
              <ChevronLeft className={fullscreen ? "h-6 w-6" : "h-5 w-5"} />
            </button>
            <button
              onClick={scrollNext}
              className={cn(
                "absolute top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25",
                fullscreen ? "right-6 h-14 w-14" : "right-3 h-11 w-11 sm:right-5",
              )}
              aria-label="Next product"
            >
              <ChevronRight className={fullscreen ? "h-6 w-6" : "h-5 w-5"} />
            </button>

            {/* Embla viewport (swipe left/right through products) */}
            <div ref={emblaRef} className="h-full overflow-hidden">
              <div className="flex h-full">
                {products.map((p, i) => (
                  <div
                    key={p.id}
                    className="relative min-w-0 flex-[0_0_100%]"
                  >
                    <ProductSlide
                      product={p}
                      active={i === current}
                      fullscreen={fullscreen}
                      thumbIdx={thumbIdx}
                      setThumbIdx={setThumbIdx}
                      onAdd={() => {
                        add({ id: p.id, name: p.name, price: p.price, qty: 1 });
                        toast.success(`${p.name} added to cart`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom pagination pills */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
              <div className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
                {current + 1} / {products.length} • swipe or use arrow keys
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductSlide({
  product,
  active,
  fullscreen,
  thumbIdx,
  setThumbIdx,
  onAdd,
}: {
  product: Jewel;
  active: boolean;
  fullscreen: boolean;
  thumbIdx: number;
  setThumbIdx: (i: number) => void;
  onAdd: () => void;
}) {
  const img = product.images[Math.min(thumbIdx, product.images.length - 1)];

  return (
    <div
      className={cn(
        "grid h-full w-full gap-0",
        fullscreen ? "lg:grid-cols-[1.3fr_1fr]" : "md:grid-cols-2",
      )}
    >
      {/* Image side */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-rose-950/30 to-black">
        <motion.img
          key={img}
          src={img}
          alt={product.name}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: active ? 1 : 1.05, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full w-full select-none object-cover",
            fullscreen ? "min-h-[60vh]" : "min-h-[320px] md:min-h-[520px]",
          )}
          draggable={false}
        />
        {/* soft vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Thumbs */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
          {product.images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setThumbIdx(i)}
              className={cn(
                "h-12 w-12 overflow-hidden rounded-lg border-2 transition",
                i === thumbIdx ? "border-amber-400 shadow-lg" : "border-white/20 opacity-70 hover:opacity-100",
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Details side */}
      <div className={cn(
        "relative flex flex-col overflow-y-auto p-6 sm:p-8",
        fullscreen ? "lg:p-12" : "",
      )}>
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((t) => (
            <TagBadge key={t} name={t} variant="gold" />
          ))}
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {product.name}
        </h2>
        <p className="mt-2 text-sm text-white/60">
          {product.metal} • {product.weight} • {product.purity}
        </p>

        <div className="mt-6 flex items-end gap-3">
          <span className="font-display text-3xl font-bold text-amber-300 sm:text-4xl">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="pb-1 text-sm text-white/40 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-white/70">
          {product.description}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
          <div>
            <dt className="text-white/50">Metal</dt>
            <dd className="mt-0.5 font-medium">{product.metal}</dd>
          </div>
          <div>
            <dt className="text-white/50">Weight</dt>
            <dd className="mt-0.5 font-medium">{product.weight}</dd>
          </div>
          <div>
            <dt className="text-white/50">Purity</dt>
            <dd className="mt-0.5 font-medium">{product.purity}</dd>
          </div>
          {product.stones && (
            <div>
              <dt className="text-white/50">Stones</dt>
              <dd className="mt-0.5 font-medium">{product.stones}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
          <Button
            onClick={onAdd}
            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500"
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to enquiry
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Heart className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50">
          <Sparkles className="h-3 w-3 text-amber-300" />
          Hallmarked • BIS certified • Lifetime buyback
        </p>
      </div>
    </div>
  );
}
