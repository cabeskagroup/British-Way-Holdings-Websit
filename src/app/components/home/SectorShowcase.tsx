import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { sectors } from "@/data/sectors";
import { companies } from "@/data/companies";
import { gsap, useGSAP } from "@/app/lib/gsap";
import { SmartImage } from "../ui-luxe/SmartImage";
import { LogoChip } from "../ui-luxe/LogoChip";

/**
 * "What we do": on desktop the section pins and the sectors glide past
 * horizontally as you scroll; on smaller screens they stack as cards.
 */
export function SectorShowcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>(".sector-img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -10 }, {
            xPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: img.closest(".sector-panel"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
          });
        });
        gsap.utils.toArray<HTMLElement>(".sector-word").forEach((w) => {
          gsap.fromTo(w, { xPercent: 25 }, {
            xPercent: -25,
            ease: "none",
            scrollTrigger: { trigger: w.closest(".sector-panel"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
          });
        });
        gsap.utils.toArray<HTMLElement>(".sector-copy").forEach((c) => {
          gsap.from(c.children, {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: c.closest(".sector-panel"), containerAnimation: scroll, start: "left 75%", end: "left 35%", scrub: 1 },
          });
        });
        gsap.to(".sector-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".sector-panel").forEach((p) => {
          gsap.from(p, { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative overflow-hidden py-24 lg:h-screen lg:py-0">
      <div className="orb left-1/3 top-1/4 h-[500px] w-[500px] bg-pearl/70" />
      <div
        ref={track}
        className="relative flex flex-col gap-6 px-6 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:px-[6vw]"
      >
        {/* Intro panel */}
        <div className="sector-panel flex shrink-0 flex-col justify-center gap-8 lg:w-[34vw] lg:pr-8">
          <span className="eyebrow">What we do</span>
          <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-fg">
            One family, <span className="accent">five worlds</span> of excellence.
          </h2>
          <p className="max-w-md text-mist">
            Hotels, academies, productions, sports and entertainment. Each is a leader in its field, and all share one standard of care.
          </p>
          <div className="hidden items-center gap-3 font-display text-xs tracking-[0.3em] text-fg/50 uppercase lg:flex">
            Keep scrolling <MoveRight size={16} className="text-gold" />
          </div>
        </div>

        {sectors.map((s) => {
          const members = companies.filter((c) => s.companies.includes(c.slug));
          return (
            <article
              key={s.id}
              className="sector-panel on-dark group relative flex min-h-[560px] shrink-0 overflow-hidden rounded-[2rem] border border-fg/10 lg:h-[78vh] lg:min-h-0 lg:w-[72vw] lg:max-w-[1150px] lg:rounded-[2.5rem]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="sector-img absolute inset-y-0 -left-[12%] w-[124%]">
                  <SmartImage src={s.image} fallbackSrc={s.fallbackImage} alt={s.title} className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-base via-base/70 to-base/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-base/80 to-transparent" />
              <div className="orb -bottom-20 -left-20 h-80 w-80 opacity-50" style={{ background: s.color }} />

              <div className="sector-word pointer-events-none absolute left-0 top-[18%] whitespace-nowrap font-display text-[clamp(4rem,13vw,13rem)] font-extrabold leading-none tracking-[-0.05em] outline-text">
                {s.word}
              </div>

              <div className="absolute right-6 top-6 text-right md:right-10 md:top-10">
                <p className="font-display text-3xl font-semibold text-fg md:text-5xl">{s.stat.value}</p>
                <p className="mt-1 text-[11px] tracking-[0.2em] text-fg/60 uppercase">{s.stat.label}</p>
              </div>

              <div className="sector-copy relative mt-auto flex w-full flex-col gap-5 p-6 md:p-10 lg:max-w-[70%]">
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm font-semibold" style={{ color: s.color }}>
                    {s.index}
                  </span>
                  <span className="h-px w-12" style={{ background: s.color }} />
                  <span className="font-display text-xs tracking-[0.3em] text-fg/60 uppercase">{s.tagline}</span>
                </div>
                <h3 className="font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.03em] text-fg">{s.title}</h3>
                <p className="max-w-xl text-[15px] leading-relaxed text-fg/70">{s.description}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {members.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/companies/${c.slug}`}
                      className="glass group/chip flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition-colors hover:border-fg/30"
                    >
                      <LogoChip company={c} shape="round" className="h-9 w-9" padding="p-1" />
                      <span className="font-display text-[13px] font-medium text-fg">{c.name}</span>
                      <ArrowUpRight size={14} className="text-gold-hi transition-transform group-hover/chip:-translate-y-0.5 group-hover/chip:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
        <div className="hidden w-[6vw] shrink-0 lg:block" />
      </div>

      {/* Progress */}
      <div className="absolute inset-x-[6vw] bottom-8 hidden h-px bg-fg/10 lg:block">
        <div className="sector-progress h-full origin-left scale-x-0 bg-gradient-to-r from-gold via-[#d8b36a] to-crimson" />
      </div>
    </section>
  );
}
