import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { companies } from "@/data/companies";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { LogoChip } from "../ui-luxe/LogoChip";

// Inner ring: education flagships. Outer ring: the rest of the family.
const inner = ["bwea", "bwis", "british-campus"];
const outerSlugs = companies.map((c) => c.slug).filter((s) => !inner.includes(s));

const rings = [
  { slugs: inner, radius: 0.3, speed: 0.16, tilt: 0.42 },
  { slugs: outerSlugs, radius: 0.47, speed: -0.1, tilt: 0.42 },
];

/**
 * The group's companies orbiting the BW mark on two tilted rings. Logos in front
 * grow and sharpen, the ones behind shrink and blur, giving a 3D carousel feel.
 * Hover pauses the orbit and names the company; click opens it.
 */
export function LogoOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-orbit]"));
      const reduce = prefersReducedMotion();
      let t = 0;
      let boost = 0;
      let speedFactor = 1;

      const place = () => {
        const size = el.clientWidth;
        items.forEach((item) => {
          const ring = rings[Number(item.dataset.ring)];
          const i = Number(item.dataset.i);
          const angle = (i / ring.slugs.length) * Math.PI * 2 + t * ring.speed * Math.PI * 2;
          const r = ring.radius * size;
          const depth = Math.sin(angle); // -1 back … 1 front
          const x = Math.cos(angle) * r;
          const y = depth * r * ring.tilt;
          const scale = 0.72 + (depth + 1) * 0.2;
          gsap.set(item, {
            x,
            y,
            scale,
            zIndex: Math.round(100 + depth * 50),
            opacity: 0.45 + (depth + 1) * 0.275,
            filter: `blur(${Math.max(0, -depth) * 1.6}px)`,
          });
        });
      };

      const tick = (_time: number, delta: number) => {
        const target = hoveredRef.current ? 0.05 : 1;
        speedFactor += (target - speedFactor) * 0.06;
        boost *= 0.94;
        t += (delta / 1000) * (0.12 * speedFactor + boost);
        place();
      };

      place();
      if (reduce) return;

      gsap.from(el.querySelectorAll(".orbit-inner"), {
        scale: 0,
        opacity: 0,
        stagger: 0.07,
        duration: 1.2,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      // Spin faster while the page is being scrolled
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          boost = gsap.utils.clamp(-0.6, 0.6, self.getVelocity() / 4000);
        },
      });

      // Only animate while on screen
      const vis = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
      });
      window.addEventListener("resize", place);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        vis.kill();
        window.removeEventListener("resize", place);
      };
    },
    { scope: root },
  );

  const setHover = (slug: string | null) => {
    hoveredRef.current = slug;
    setHovered(slug);
  };
  const active = companies.find((c) => c.slug === hovered);

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[620px] select-none">
      {/* Orbit paths */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3dca0" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3d7be0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#d7263d" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {rings.map((r, i) => (
          <ellipse key={i} cx="50" cy="50" rx={r.radius * 100} ry={r.radius * 100 * r.tilt} fill="none" stroke="url(#orbit-stroke)" strokeWidth="0.25" strokeDasharray={i ? "0.8 1.2" : undefined} />
        ))}
      </svg>

      {/* Core */}
      <div className="absolute left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2">
        <div className="pulse-ring absolute inset-0 rounded-full border border-[#d8b36a]/50" />
        <div className="pulse-ring absolute inset-0 rounded-full border border-[#3d7be0]/40" style={{ animationDelay: "1.3s" }} />
        <div className="orb -inset-10 bg-[#3d7be0]/40" />
        <div className="spin-slow absolute -inset-5 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent, rgba(243,220,160,0.55), transparent 30%, rgba(61,123,224,0.5), transparent 60%)" , mask: "radial-gradient(circle, transparent 62%, #000 64%)", WebkitMask: "radial-gradient(circle, transparent 62%, #000 64%)" }} />
        <div className="glass-strong relative grid h-20 w-20 place-items-center rounded-full sm:h-28 sm:w-28 md:h-36 md:w-36">
          <img src="/logos/bwh-mark.png" alt="British Way Holdings" className="w-[62%]" />
        </div>
      </div>

      {/* Orbiting logos */}
      {rings.map((ring, ri) =>
        ring.slugs.map((slug, i) => {
          const c = companies.find((x) => x.slug === slug)!;
          return (
            <button
              key={slug}
              data-orbit
              data-ring={ri}
              data-i={i}
              onPointerEnter={() => setHover(slug)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(slug)}
              onBlur={() => setHover(null)}
              onClick={() => navigate(`/companies/${slug}`)}
              className="absolute left-1/2 top-1/2 -ml-[29px] -mt-[29px] h-[58px] w-[58px] sm:-ml-[40px] sm:-mt-[40px] sm:h-[80px] sm:w-[80px] md:-ml-[54px] md:-mt-[54px] md:h-[108px] md:w-[108px]"
              aria-label={c.name}
            >
              <span className="orbit-inner absolute inset-0">
                <span className="absolute -inset-2 rounded-full opacity-60 blur-xl" style={{ background: c.accent }} />
                <LogoChip company={c} shape="round" className={`relative h-full w-full transition-shadow duration-300 ${hovered === slug ? "ring-2 ring-[#f3dca0]" : ""}`} padding="p-2.5" />
              </span>
            </button>
          );
        }),
      )}

      {/* Hover caption */}
      <div
        className={`glass pointer-events-none absolute bottom-0 left-1/2 z-[200] w-max max-w-[90%] -translate-x-1/2 rounded-2xl px-5 py-3 text-center transition-all duration-500 ${
          active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="font-display text-sm font-semibold text-white">{active?.name ?? " "}</p>
        <p className="text-xs text-[#f3dca0]">{active?.cat ?? " "}</p>
      </div>
    </div>
  );
}
