import { useRef } from "react";
import { Link } from "react-router";
import { galleryPhotos } from "@/data/gallery";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";

const ring = galleryPhotos.slice(0, 12);
const STEP = 360 / ring.length;

/** A carousel of moments turning slowly in 3D; scrolling spins it faster. */
export function GalleryRing() {
  const root = useRef<HTMLDivElement>(null);
  const carousel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = carousel.current;
      if (!el) return;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const w = mobile ? 150 : 240;
      const radius = (w / 2 / Math.tan((STEP / 2) * (Math.PI / 180))) * 1.12;
      el.querySelectorAll<HTMLElement>("[data-ring-item]").forEach((item, i) => {
        item.style.width = `${w}px`;
        item.style.height = `${w * 1.3}px`;
        item.style.margin = `${(-w * 1.3) / 2}px 0 0 ${-w / 2}px`;
        item.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`;
      });
      gsap.set(el, { z: -radius, rotationX: -8 });
      if (prefersReducedMotion()) return;

      const spin = gsap.to(el, { rotationY: -360, duration: 60, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.min(6, Math.abs(self.getVelocity()) / 250);
          gsap.to(spin, {
            timeScale: 1 + v,
            duration: 0.3,
            overwrite: true,
            onComplete: () => void gsap.to(spin, { timeScale: 1, duration: 1.2, overwrite: true }),
          });
        },
      });
      const pause = () => gsap.to(spin, { timeScale: 0.1, duration: 0.6 });
      const resume = () => gsap.to(spin, { timeScale: 1, duration: 0.6 });
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", resume);
      return () => {
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerleave", resume);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[460px] md:h-[640px]" style={{ perspective: "1400px" }}>
      <div className="absolute inset-x-0 bottom-6 mx-auto h-24 w-2/3 rounded-[100%] bg-[#3d7be0]/25 blur-3xl" />
      <div ref={carousel} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
        {ring.map((p) => (
          <Link
            key={p.id}
            to="/gallery"
            data-ring-item
            className="group absolute left-0 top-0 overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
            style={{ backfaceVisibility: "hidden" }}
            aria-label={p.alt}
          >
            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute inset-x-3 bottom-3 translate-y-2 font-display text-xs font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {p.alt}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
