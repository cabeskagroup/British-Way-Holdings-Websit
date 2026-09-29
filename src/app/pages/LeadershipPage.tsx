import { useRef } from "react";
import { Quote } from "lucide-react";
import { leaders } from "@/data/leaders";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { SplitHeading } from "../components/fx/SplitHeading";
import { Reveal } from "../components/fx/Reveal";
import { TiltCard } from "../components/fx/TiltCard";

export function LeadershipPage() {
  const featured = leaders.filter((l) => l.featured);
  const team = leaders.filter((l) => !l.featured);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".ld-portrait").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        gsap.fromTo(el.querySelector("img"), { scale: 1.35 }, { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ld-ring").forEach((el) => {
        gsap.to(el, { rotate: 360, duration: 40, repeat: -1, ease: "none" });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Leadership"
        crumb="Leadership"
        watermark="VISIONARIES"
        image="/logos/hi001.png"
        title={
          <>
            Guided by <span className="accent">visionary</span> leaders.
          </>
        }
        description="Our leadership team brings decades of combined expertise, shaping British Way Holdings into the respected group it is today."
      />

      {/* Featured leaders */}
      <section className="relative px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-28 md:gap-40">
          {featured.map((l, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={l.name} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div className={`relative mx-auto w-full max-w-md ${flip ? "lg:order-2" : ""}`}>
                  <div className="ld-ring absolute -inset-6 rounded-t-full rounded-b-[3rem] border border-dashed border-[#d8b36a]/35" />
                  <div className="orb -inset-10 bg-[#1b3f8f]/40" />
                  <div className="ld-portrait relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] border border-white/10 bg-[#0c1326]">
                    <SmartImage src={l.image} alt={l.name} className="h-full w-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04060d]/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b3f8f]/25 to-transparent mix-blend-multiply" />
                  </div>
                  <div className="glass-strong absolute -bottom-6 left-1/2 w-max -translate-x-1/2 rounded-full px-6 py-3 text-center">
                    <p className="font-display text-xs font-semibold tracking-[0.3em] text-[#f3dca0] uppercase">{l.title}</p>
                  </div>
                </div>
                <div className={`flex flex-col gap-7 ${flip ? "lg:order-1" : ""}`}>
                  <span className="eyebrow">0{i + 1} · {l.title}</span>
                  <SplitHeading className="font-display text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
                    {l.name}
                  </SplitHeading>
                  <Reveal className="flex flex-col gap-7" stagger={0.12} y={30}>
                    <p className="text-[1.05rem] leading-relaxed text-mist">{l.bio}</p>
                    {l.message && (
                      <blockquote className="glass luxe-border relative rounded-[2rem] p-8">
                        <Quote className="absolute -top-5 left-8 h-10 w-10 rounded-full bg-[#d8b36a] p-2 text-[#1a1204]" />
                        <p className="font-serif-luxe text-2xl leading-snug text-white/90 italic">“{l.message}”</p>
                      </blockquote>
                    )}
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Management team */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="orb right-0 top-0 h-[420px] w-[420px] bg-[#d7263d]/15" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Management team"
            title={
              <>
                The people who make it <span className="accent">happen.</span>
              </>
            }
          />
          <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1} y={70}>
            {team.map((l) => (
              <TiltCard key={l.name} className="h-full rounded-[2rem]" max={8}>
                <div className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1326]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <SmartImage src={l.image} alt={l.name} className="h-full w-full object-cover object-top grayscale transition-all duration-[1.2s] group-hover:scale-105 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1326] via-[#0c1326]/20 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                    <p className="text-[11px] font-semibold tracking-[0.25em] text-[#f3dca0] uppercase">{l.title}</p>
                    <h3 className="font-display text-xl font-semibold text-white">{l.name}</h3>
                    <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-white/70 opacity-0 transition-all duration-700 group-hover:max-h-40 group-hover:opacity-100">
                      {l.bio}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
          <Reveal y={20} className="mt-16 flex justify-center">
            <LuxeButton to="/contact">Connect with our team</LuxeButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
