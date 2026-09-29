import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { SplitHeading } from "../fx/SplitHeading";
import { onIntroDone } from "../fx/intro";
import { SmartImage } from "./SmartImage";
import { LotusMandala } from "./Heritage";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  /** Giant outlined word drifting behind the title. */
  watermark?: string;
  crumb: string;
  children?: ReactNode;
  accent?: string;
  /** Show the slowly turning lotus mandala (Sri Lankan heritage motif). */
  lotus?: boolean;
}

/** Cinematic opening banner for inner pages. */
export function PageHero({ eyebrow, title, description, image, watermark, crumb, children, accent = "#3d7be0", lotus }: PageHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ paused: true });
      tl.from(".ph-fade", { y: 30, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out" }, 0.3).from(
        ".ph-bg",
        { scale: 1.25, opacity: 0, duration: 2, ease: "expo.out" },
        0,
      );
      const off = onIntroDone(() => tl.play());

      gsap.to(".ph-bg", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".ph-watermark", {
        xPercent: -25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[78svh] items-end overflow-hidden pb-20 pt-40 md:min-h-[86vh] md:pb-28">
      {image && (
        <div className="ph-bg absolute inset-0">
          <SmartImage src={image} alt="" eager className="h-full w-full object-cover opacity-45" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04060d]/70 via-[#04060d]/55 to-[#04060d]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#04060d] via-[#04060d]/60 to-transparent" />
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="orb -left-40 top-10 h-[420px] w-[420px] opacity-40" style={{ background: accent }} />
      <div className="orb -right-32 bottom-0 h-[360px] w-[360px] bg-[#d7263d] opacity-20" />

      {lotus && <LotusMandala className="spin-slower pointer-events-none absolute -right-48 top-1/2 h-[760px] w-[760px] -translate-y-1/2 md:-right-24" opacity={0.22} />}

      {watermark && (
        <div className="ph-watermark pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[22vw] font-extrabold leading-none tracking-tighter outline-text select-none">
          {watermark}
        </div>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <nav className="ph-fade mb-8 flex items-center gap-2 font-display text-xs tracking-widest text-white/50 uppercase">
          <Link to="/" className="transition-colors hover:text-[#f3dca0]">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#d8b36a]">{crumb}</span>
        </nav>
        <span className="ph-fade eyebrow mb-6">{eyebrow}</span>
        <SplitHeading
          as="h1"
          trigger="intro"
          delay={0.2}
          className="mt-6 max-w-5xl font-display text-[clamp(2.8rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white"
        >
          {title}
        </SplitHeading>
        {description && <p className="ph-fade mt-8 max-w-2xl text-lg leading-relaxed text-mist">{description}</p>}
        {children && <div className="ph-fade mt-10">{children}</div>}
      </div>
    </section>
  );
}
