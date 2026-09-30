import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/data/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { useLenis } from "../fx/SmoothScroll";

interface LightboxProps {
  photos: GalleryPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Full-screen photo viewer with keyboard, arrows and a thumbnail strip. */
export function Lightbox({ photos, index, onIndex, onClose }: LightboxProps) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const photo = photos[index];
  const go = (d: number) => onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".lb-image", { scale: 0.9, opacity: 0, rotationY: -10 }, { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: "expo.out", transformPerspective: 1200 });
      gsap.fromTo(".lb-caption", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "expo.out" });
    },
    { scope: root, dependencies: [index] },
  );

  if (!photo) return null;

  return createPortal(
    <div ref={root} className="on-dark fixed inset-0 z-[160] flex flex-col bg-base/95 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label={photo.alt}>
      <div className="flex items-center justify-between p-4 md:p-6">
        <span className="font-display text-sm tabular-nums text-fg/60">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button onClick={onClose} className="glass grid h-12 w-12 place-items-center rounded-full text-fg hover:bg-fg/10" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={onClose}>
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          onClick={(e) => e.stopPropagation()}
          className="lb-image max-h-full max-w-full rounded-2xl object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="glass absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-fg hover:bg-fg/10 md:left-8"
          aria-label="Previous photo"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="glass absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-fg hover:bg-fg/10 md:right-8"
          aria-label="Next photo"
        >
          <ChevronRight size={22} />
        </button>
      </div>
      <div className="lb-caption p-5 text-center">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-hi uppercase">{photo.cat}</p>
        <p className="mt-2 font-display text-lg text-fg">{photo.alt}</p>
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-6" data-lenis-prevent>
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onIndex(i)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === index ? "border-gold opacity-100" : "border-transparent opacity-40 hover:opacity-80"}`}
            aria-label={p.alt}
          >
            <img src={p.src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
