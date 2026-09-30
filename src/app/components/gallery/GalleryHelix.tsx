import { useRef } from "react";
import type { GalleryPhoto } from "@/data/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { LotusMandala } from "../ui-luxe/Heritage";

const STEP = 32; // degrees between photos around the spiral

/**
 * Photos wound around a vertical spiral. The section pins while you scroll and the
 * spiral turns and descends, bringing each moment to the front in turn.
 */
export function GalleryHelix({ photos, onOpen }: { photos: GalleryPhoto[]; onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);
  const helix = useRef<HTMLDivElement>(null);
  const captionTitle = useRef<HTMLParagraphElement>(null);
  const captionCat = useRef<HTMLParagraphElement>(null);
  const captionIndex = useRef<HTMLSpanElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = helix.current;
      if (!el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-helix]"));
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const w = mobile ? 190 : 300;
      const radius = (w / 2 / Math.tan((STEP / 2) * (Math.PI / 180))) * 1.08;
      const rise = mobile ? 70 : 96;
      const n = items.length;

      items.forEach((item, i) => {
        item.style.width = `${w}px`;
        item.style.height = `${w * 1.25}px`;
        item.style.marginLeft = `${-w / 2}px`;
        item.style.marginTop = `${(-w * 1.25) / 2}px`;
        item.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px) translateY(${i * rise}px)`;
      });

      let current = -1;
      const update = (p: number) => {
        const pos = p * (n - 1);
        el.style.transform = `translateZ(${-radius}px) translateY(${-pos * rise}px) rotateY(${-pos * STEP}deg)`;
        items.forEach((item, i) => {
          const d = Math.abs(i - pos);
          item.style.opacity = String(Math.max(0, 1 - d * 0.22));
          item.style.filter = `brightness(${Math.max(0.35, 1 - d * 0.25)})`;
        });
        const idx = Math.round(pos);
        if (idx !== current) {
          current = idx;
          const photo = photos[idx];
          if (captionTitle.current) captionTitle.current.textContent = photo.alt;
          if (captionCat.current) captionCat.current.textContent = photo.cat;
          if (captionIndex.current) captionIndex.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
          if (!prefersReducedMotion()) gsap.fromTo(".hx-caption > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power3.out", overwrite: true });
        }
        if (progressBar.current) progressBar.current.style.transform = `scaleY(${p})`;
      };
      update(0);

      if (prefersReducedMotion()) return;
      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => update(state.p),
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${n * (mobile ? 220 : 320)}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.from(".hx-stage", { scale: 0.7, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_center,#d9e7f9_0%,#eef4fd_65%)]">
      <LotusMandala className="spin-slower pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2" opacity={0.04} />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[20vw] font-extrabold leading-none tracking-tighter outline-text">
        MOMENTS
      </div>

      <div className="hx-stage absolute inset-0" style={{ perspective: "1600px", perspectiveOrigin: "50% 45%" }}>
        <div ref={helix} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {photos.map((p, i) => (
            <button
              key={p.id}
              data-helix
              onClick={() => onOpen(i)}
              className="group absolute left-0 top-0 overflow-hidden rounded-[1.25rem] border border-white bg-surface shadow-[0_30px_70px_-30px_rgba(20,33,63,0.55)]"
              style={{ backfaceVisibility: "hidden" }}
              aria-label={`Open ${p.alt}`}
            >
              <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-royal via-sky to-crimson" />
            </button>
          ))}
        </div>
      </div>

      {/* Caption for the photo facing front */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-12">
        <div className="hx-caption max-w-md">
          <span ref={captionIndex} className="block font-display text-sm tabular-nums text-gold-hi" />
          <p ref={captionCat} className="mt-2 text-[11px] font-semibold tracking-[0.25em] text-fg/50 uppercase" />
          <p ref={captionTitle} className="mt-1 font-display text-xl font-semibold text-fg md:text-3xl" />
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="font-display text-xs tracking-[0.3em] text-fg/45 uppercase">Scroll to turn</span>
          <div className="relative h-24 w-px overflow-hidden bg-fg/15">
            <div ref={progressBar} className="absolute inset-0 origin-top bg-gradient-to-b from-gold to-crimson" style={{ transform: "scaleY(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
