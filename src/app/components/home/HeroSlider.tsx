import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { onIntroDone } from "../fx/intro";
import { LuxeButton } from "../ui-luxe/LuxeButton";
import { CountUp } from "../fx/CountUp";

const slides = [
  {
    image: "/logos/hi001.png",
    mobileImage: "/logos/mi001.png",
    label: "The Group",
    title: ["Shaping", "the", "future", "through", "*excellence."],
    subtitle: "A diversified Sri Lankan group leading education, hospitality, media, sports and entertainment.",
    cta: "Discover our story",
    to: "/about",
  },
  {
    image: "/logos/hi002.png",
    mobileImage: "/logos/mi002.png",
    label: "Academies",
    title: ["Empowering", "the", "leaders", "of", "*tomorrow."],
    subtitle: "Thousands graduate every year from our world-class institutions, ready to lead in a global world.",
    cta: "Our institutions",
    to: "/about#companies",
  },
  {
    image: "/logos/hi003.png",
    mobileImage: "/logos/mi003.png",
    label: "Hospitality",
    title: ["Where", "elegance", "meets", "*hospitality."],
    subtitle: "The Pharo Hotel — boutique luxury, award-winning dining and unforgettable events.",
    cta: "Explore The Pharo",
    to: "/companies/pharo-hotel",
  },
  {
    image: "/logos/hi004.png",
    mobileImage: "/logos/mi004.png",
    label: "Media & Events",
    title: ["Stories", "that", "move", "*audiences."],
    subtitle: "Productions, premieres and live experiences that bring Sri Lanka together.",
    cta: "Meet Emika Productions",
    to: "/companies/emika-productions",
  },
];

const stats = [
  { value: "8", label: "Group companies" },
  { value: "2000+", label: "Team members" },
  { value: "20+", label: "Global partnerships" },
  { value: "40+", label: "Awards & honours" },
];

const DURATION = 6.5;

export function HeroSlider() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const progress = useRef<gsap.core.Tween | null>(null);
  // Slide being wiped over; read during render before the effect below updates it.
  const prevIndex = useRef(0);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), []);

  // Intro choreography after the preloader
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setStarted(true);
        return;
      }
      const tl = gsap.timeline({ paused: true, onStart: () => setStarted(true) });
      tl.from(".hero-media", { scale: 1.3, opacity: 0, duration: 2.2, ease: "expo.out" })
        .from(".hero-fade", { y: 40, opacity: 0, stagger: 0.12, duration: 1.1, ease: "expo.out" }, 0.5)
        .from(".hero-stat", { y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out" }, 0.9);
      const off = onIntroDone(() => tl.play());

      // Content drifts away as you scroll past the hero
      gsap.to(".hero-content", {
        yPercent: -25,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".hero-media-wrap", {
        yPercent: 15,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: root },
  );

  // Slide change: wipe in the new image, rise the new headline, restart the progress bar
  useGSAP(
    () => {
      if (!started) return;
      const reduce = prefersReducedMotion();
      const slide = root.current?.querySelector(`[data-slide="${index}"]`);
      if (slide && !reduce) {
        gsap.fromTo(slide, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.4, ease: "expo.inOut" });
        gsap.fromTo(slide.querySelector("img"), { scale: 1.25 }, { scale: 1.05, duration: DURATION + 1.4, ease: "none" });
      }
      if (!reduce) {
        gsap.fromTo(".hero-word", { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, stagger: 0.07, duration: 1.2, ease: "expo.out", delay: 0.25 });
        gsap.fromTo(".hero-sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.55 });
      }
      prevIndex.current = index;
      progress.current?.kill();
      gsap.set(".hero-progress", { scaleX: 0 });
      progress.current = gsap.to(`.hero-progress[data-i="${index}"]`, {
        scaleX: 1,
        duration: DURATION,
        ease: "none",
        onComplete: () => go(index + 1),
      });
    },
    { scope: root, dependencies: [index, started] },
  );

  // Background follows the mouse slightly for depth
  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe || window.matchMedia("(hover: none)").matches) return;
      const xTo = gsap.quickTo(".hero-media", "x", { duration: 1.6, ease: "power3.out" });
      const yTo = gsap.quickTo(".hero-media", "y", { duration: 1.6, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -24);
        yTo((e.clientY / window.innerHeight - 0.5) * -16);
      });
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  useEffect(() => () => progress.current?.kill(), []);

  const slide = slides[index];

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden md:block md:h-[100svh] md:min-h-[680px]">
      <div className="hero-media-wrap absolute inset-0">
        <div className="hero-media absolute -inset-6">
          {slides.map((s, i) => (
            <div
              key={s.image}
              data-slide={i}
              className="absolute inset-0"
              style={{
                zIndex: i === index ? 2 : 1,
                visibility: i === index || i === prevIndex.current ? "visible" : "hidden",
              }}
            >
              <picture>
                <source media="(max-width: 767px)" srcSet={s.mobileImage} />
                <img src={s.image} alt="" className="h-full w-full object-cover object-[70%_center]" fetchPriority={i === 0 ? "high" : "auto"} />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-[#04060d] via-[#04060d]/75 to-transparent md:via-[#04060d]/45" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[#04060d] via-transparent to-[#04060d]/60" />
      <div className="grid-lines pointer-events-none absolute inset-0 z-[3] opacity-50" />

      <div className="hero-content relative z-[4] mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-10 pt-28 md:h-full md:px-10 md:pb-36">
        <div className="hero-fade mb-7 flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#d8b36a]" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d8b36a]" />
          </span>
          <span className="whitespace-nowrap font-display text-[11px] font-semibold tracking-[0.35em] text-[#f3dca0] uppercase">{slide.label}</span>
          <span className="hidden h-px w-10 bg-white/20 sm:block" />
          <span className="hidden whitespace-nowrap font-display text-[11px] tracking-[0.3em] text-white/50 uppercase sm:inline">British Way Holdings</span>
        </div>

        <h1 key={index} className="max-w-4xl font-display text-[clamp(2.9rem,8.2vw,7.6rem)] font-semibold leading-[0.93] tracking-[-0.045em] text-white">
          {slide.title.map((w, i) => {
            const accent = w.startsWith("*");
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className={`hero-word inline-block ${accent ? "font-serif-luxe gold-text italic font-medium" : ""}`}>{accent ? w.slice(1) : w}</span>
                {i < slide.title.length - 1 && " "}
              </span>
            );
          })}
        </h1>

        <p key={`s${index}`} className="hero-sub mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
          {slide.subtitle}
        </p>

        <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
          <LuxeButton to={slide.to}>{slide.cta}</LuxeButton>
          <LuxeButton to="/about#companies" variant="ghost">
            Explore the group
          </LuxeButton>
        </div>
      </div>

      {/* Slide index with progress */}
      <div className="absolute bottom-40 right-6 z-[5] hidden flex-col gap-4 md:right-10 md:flex lg:bottom-44">
        {slides.map((s, i) => (
          <button key={s.label} onClick={() => go(i)} className="hero-fade group flex items-center gap-4 text-right" aria-label={`Show ${s.label}`}>
            <span className={`font-display text-xs tracking-[0.25em] uppercase transition-colors ${i === index ? "text-white" : "text-white/35 group-hover:text-white/70"}`}>
              {s.label}
            </span>
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span data-i={i} className="hero-progress absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#d8b36a] to-[#f3dca0]" />
            </span>
            <span className={`font-display text-xs ${i === index ? "text-[#f3dca0]" : "text-white/35"}`}>0{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="relative z-[5] px-4 pb-5 md:absolute md:inset-x-0 md:bottom-0 md:px-10 md:pb-8">
        <div className="glass mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-3xl md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`hero-stat flex flex-col gap-1 px-5 py-4 md:px-8 md:py-6 ${i > 0 ? "md:border-l md:border-white/10" : ""} ${i % 2 ? "border-l border-white/10 md:border-l" : ""} ${i > 1 ? "border-t border-white/10 md:border-t-0" : ""}`}>
              <CountUp value={s.value} className="font-display text-2xl font-semibold text-white md:text-4xl" />
              <span className="text-[11px] tracking-[0.2em] text-white/50 uppercase">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
