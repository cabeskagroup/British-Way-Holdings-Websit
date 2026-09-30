import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { companies } from "@/data/companies";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { LogoChip } from "../ui-luxe/LogoChip";

// Inner ring: the education family. Outer ring: hospitality, media, sport and entertainment.
const inner = ["bwea", "bwis", "british-campus", "thames-college"];
const outer = companies.map((c) => c.slug).filter((s) => !inner.includes(s));

const rings = [
  { slugs: inner, size: 56, duration: 38, direction: 1 },
  { slugs: outer, size: 92, duration: 60, direction: -1 },
];

/**
 * The group's companies travelling on two concentric circular orbits around the
 * BW emblem. Rings turn in opposite directions; each logo counter-rotates so it
 * always stays upright. Hovering a logo slows everything and names the company.
 */
export function LogoOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const spins = useRef<gsap.core.Timeline | null>(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline();
      rings.forEach((ring, i) => {
        const turn = 360 * ring.direction;
        tl.to(`[data-ring="${i}"]`, { rotation: turn, duration: ring.duration, ease: "none", repeat: -1 }, 0);
        tl.to(`[data-ring="${i}"] .orbit-upright`, { rotation: -turn, duration: ring.duration, ease: "none", repeat: -1 }, 0);
      });
      spins.current = tl;

      gsap.from(".orbit-inner", {
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      gsap.from(".orbit-path", {
        scale: 0.6,
        opacity: 0,
        stagger: 0.15,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const setHover = (slug: string | null) => {
    setHovered(slug);
    if (spins.current) gsap.to(spins.current, { timeScale: slug ? 0.08 : 1, duration: 0.6, ease: "power2.out" });
  };
  const active = companies.find((c) => c.slug === hovered);

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[600px] select-none">
      {/* Glow and orbit paths */}
      <div className="orb inset-[18%] bg-pearl/70" />
      {rings.map((ring, i) => (
        <div
          key={i}
          className="orbit-path pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: `${ring.size}%`, height: `${ring.size}%` }}
        >
          <div className={`absolute inset-0 rounded-full border ${i ? "border-dashed border-gold/35" : "border-sky/35"}`} />
          <div
            className={`${i ? "spin-slower" : "spin-slow"} absolute -inset-px rounded-full`}
            style={{
              background: `conic-gradient(from ${i * 120}deg, transparent 0deg, ${i ? "rgba(211,24,42,0.55)" : "rgba(45,95,196,0.7)"} 40deg, transparent 90deg)`,
              mask: "radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 2px), #000 100%, transparent 100%)",
              WebkitMask: "radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 2px), #000 100%, transparent 100%)",
            }}
          />
        </div>
      ))}

      {/* Core emblem */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="pulse-ring absolute inset-0 rounded-full border border-gold/60" />
        <div className="pulse-ring absolute inset-0 rounded-full border border-[#3d7be0]/50" style={{ animationDelay: "1.3s" }} />
        <div className="logo-chip relative grid h-[88px] w-[88px] place-items-center rounded-full sm:h-28 sm:w-28 md:h-32 md:w-32">
          <img src="/logos/bwh-mark.png" alt="British Way Holdings" className="w-[62%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]" style={{ filter: "brightness(0.95)" }} />
        </div>
      </div>

      {/* Rings of logos */}
      {rings.map((ring, ri) => (
        <div
          key={ri}
          data-ring={ri}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${ring.size}%`, height: `${ring.size}%` }}
        >
          {ring.slugs.map((slug, i) => {
            const c = companies.find((x) => x.slug === slug)!;
            const angle = (i / ring.slugs.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <div
                key={slug}
                className="absolute h-0 w-0"
                style={{ left: `${50 + Math.cos(angle) * 50}%`, top: `${50 + Math.sin(angle) * 50}%` }}
              >
                <div className="orbit-upright">
                  <button
                    onPointerEnter={() => setHover(slug)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(slug)}
                    onBlur={() => setHover(null)}
                    onClick={() => navigate(`/companies/${slug}`)}
                    aria-label={c.name}
                    className="pointer-events-auto absolute -left-[27px] -top-[27px] h-[54px] w-[54px] transition-transform duration-500 hover:scale-125 sm:-left-[38px] sm:-top-[38px] sm:h-[76px] sm:w-[76px] md:-left-[44px] md:-top-[44px] md:h-[88px] md:w-[88px]"
                  >
                    {/* Intro pop is animated on this wrapper so it never fights the hover zoom */}
                    <span className="orbit-inner absolute inset-0">
                      <span className="absolute -inset-3 rounded-full opacity-30 blur-xl" style={{ background: c.accent }} />
                      <span
                        className={`absolute -inset-[3px] rounded-full bg-gradient-to-br from-sky via-royal to-crimson transition-opacity ${
                          hovered === slug ? "opacity-100" : "opacity-70"
                        }`}
                      />
                      <LogoChip company={c} shape="round" className="relative h-full w-full" padding="p-2.5" />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Hover caption */}
      <div
        className={`glass-strong pointer-events-none absolute -bottom-4 left-1/2 z-20 w-max max-w-[90%] -translate-x-1/2 rounded-2xl px-5 py-3 text-center transition-all duration-500 ${
          active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="font-display text-sm font-semibold text-fg">{active?.name ?? " "}</p>
        <p className="text-xs text-gold-hi">{active?.cat ?? " "}</p>
      </div>
    </div>
  );
}
