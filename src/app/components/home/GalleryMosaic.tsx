import { useRef, useState } from "react";
import { Expand } from "lucide-react";
import { galleryPhotos, type GalleryPhoto } from "@/data/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { Lightbox } from "../gallery/Lightbox";

// Photo id and the short card title shown on the home page.
const picks: [number, string][] = [
  [11, "Convocation 2026, Galle-Matara"],
  [8, "“Manamala Katha” premiere"],
  [3, "Ma Piya Wandana ceremony"],
  [5, "All Island Dance Competition 2026"],
  [4, "Bizz Talks, a historic milestone"],
  [16, "The Pharo Hotel"],
];
const photos = picks.map(([id]) => galleryPhotos.find((p) => p.id === id)).filter(Boolean) as GalleryPhoto[];

// Bento spans per card, in the same order as `picks`.
const spans = [
  "sm:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "sm:col-span-2 lg:col-span-4",
];

/** A calm bento grid of moments: cards unveil as they scroll in and their photos drift gently. */
export function GalleryMosaic() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".gm-card").forEach((card, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 88%", once: true } });
        tl.fromTo(
          card,
          { clipPath: "inset(18% 8% 18% 8% round 2rem)", opacity: 0 },
          { clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1, duration: 1.3, ease: "expo.out", delay: (i % 3) * 0.08 },
        ).from(card.querySelectorAll(".gm-copy > *"), { y: 24, opacity: 0, stagger: 0.08, duration: 0.8 }, "-=0.8");

        gsap.fromTo(
          card.querySelector(".gm-media"),
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="grid auto-rows-[300px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[320px] md:gap-5 lg:grid-cols-12">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setOpen(i)}
            className={`gm-card glass luxe-border group flex min-w-0 flex-col rounded-[2rem] p-2.5 text-left ${spans[i]}`}
            aria-label={`View photo: ${p.alt}`}
          >
            <div className="relative flex-1 overflow-hidden rounded-[1.5rem] bg-surface">
              <div className="gm-media absolute -inset-y-[8%] inset-x-0">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full scale-[1.1] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.17]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-base/40 to-transparent" />
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-fg/20 bg-black/35 text-fg/85 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
                <Expand size={15} />
              </span>
            </div>

            <div className="gm-copy flex items-end justify-between gap-4 px-3 pb-2 pt-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-gold uppercase">{p.cat}</p>
                <p className={`mt-1.5 line-clamp-2 font-display font-semibold text-fg ${i === 0 ? "text-lg md:text-xl" : "text-[15px]"}`}>{picks[i][1]}</p>
              </div>
              <span className="shrink-0 font-display text-xs text-fg/35">0{i + 1}</span>
            </div>
          </button>
        ))}
      </div>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
