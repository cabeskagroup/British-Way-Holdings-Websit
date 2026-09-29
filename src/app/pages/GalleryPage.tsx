import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { galleryPhotos as photos, galleryCategories as categories } from "@/data/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { TiltCard } from "../components/fx/TiltCard";
import { useLenis } from "../components/fx/SmoothScroll";

export function GalleryPage() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const filtered = active === "All" ? photos : photos.filter((p) => p.cat === active);
  const photo = open !== null ? filtered[open] : null;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".gl-item", { y: 80, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 1.1, ease: "expo.out" });
    },
    { scope: gridRef, dependencies: [active] },
  );

  // Lightbox: lock scrolling and wire the keyboard
  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open === null, filtered.length, lenis]); // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(
    () => {
      if (open === null || prefersReducedMotion()) return;
      gsap.fromTo(
        ".lb-image",
        { scale: 0.92, opacity: 0, rotationY: -8 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: "expo.out", transformPerspective: 1200 },
      );
      gsap.fromTo(".lb-caption", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "expo.out" });
    },
    { scope: boxRef, dependencies: [open] },
  );

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        crumb="Gallery"
        watermark="MOMENTS"
        image="/logos/glry01.jpg"
        title={
          <>
            Moments of <span className="accent">excellence.</span>
          </>
        }
        description="Ceremonies, workshops, premieres and community programmes from across the British Way family."
      />

      <section className="relative px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((c) => {
              const count = c === "All" ? photos.length : photos.filter((p) => p.cat === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-display text-[13px] font-medium transition-all duration-300 ${
                    active === c
                      ? "border-transparent bg-gradient-to-r from-[#d8b36a] to-[#f3dca0] text-[#1a1204] shadow-[0_10px_30px_-10px_rgba(216,179,106,0.8)]"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {c}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${active === c ? "bg-black/15" : "bg-white/10"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div ref={gridRef} className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filtered.map((p, i) => (
              <div key={p.id} className="gl-item mb-5 break-inside-avoid">
                <TiltCard className="rounded-[1.75rem]" max={6}>
                  <button
                    onClick={() => setOpen(i)}
                    className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-white/10 text-left"
                    aria-label={`Open ${p.alt}`}
                  >
                    <SmartImage src={p.src} alt={p.alt} className="w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-end justify-between gap-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#f3dca0] uppercase">{p.cat}</p>
                        <p className="mt-1 font-display text-base font-semibold text-white">{p.alt}</p>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
                        <Maximize2 size={16} />
                      </span>
                    </div>
                  </button>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox (portalled so it sits above the navbar) */}
      {photo &&
        createPortal(
          <div
            ref={boxRef}
            className="fixed inset-0 z-[160] flex flex-col bg-[#04060d]/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={photo.alt}
          >
            <div className="flex items-center justify-between p-4 md:p-6">
              <span className="font-display text-sm tabular-nums text-white/60">
                {String((open ?? 0) + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => setOpen(null)}
                className="glass grid h-12 w-12 place-items-center rounded-full text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 md:px-24" onClick={() => setOpen(null)}>
              <img
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                onClick={(e) => e.stopPropagation()}
                className="lb-image max-h-[70vh] max-w-full rounded-2xl object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
                }}
                className="glass absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white hover:bg-white/10 md:left-8"
                aria-label="Previous photo"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((i) => (i === null ? i : (i + 1) % filtered.length));
                }}
                className="glass absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white hover:bg-white/10 md:right-8"
                aria-label="Next photo"
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div className="lb-caption p-6 text-center">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-[#f3dca0] uppercase">{photo.cat}</p>
              <p className="mt-2 font-display text-lg text-white">{photo.alt}</p>
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-6" data-lenis-prevent>
              {filtered.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setOpen(i)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === open ? "border-[#d8b36a] opacity-100" : "border-transparent opacity-40 hover:opacity-80"}`}
                  aria-label={p.alt}
                >
                  <img src={p.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
