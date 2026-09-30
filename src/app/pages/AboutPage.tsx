import { useRef } from "react";
import { Check } from "lucide-react";
import { companies } from "@/data/companies";
import { visionMissionItems, coreValues } from "@/data/aboutContent";
import { milestones } from "@/data/heritage";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { CompanyCard } from "../components/ui-luxe/CompanyCard";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { Reveal } from "../components/fx/Reveal";
import { CountUp } from "../components/fx/CountUp";
import { TiltCard } from "../components/fx/TiltCard";
import { Parallax } from "../components/fx/Parallax";
import { HeritageHall } from "../components/heritage/HeritageHall";

const highlights = [
  "ISO-accredited programmes",
  "International partnerships",
  "Award-winning faculty",
  "State-of-the-art facilities",
  "Online learning platforms",
  "Industry-aligned curriculum",
];

const numbers = [
  { value: "20+", label: "Years of excellence" },
  { value: "8", label: "Group companies" },
  { value: "50,000+", label: "Students every year" },
  { value: "2000+", label: "People in the family" },
];

function Timeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".tl-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item) => {
        const fromLeft = item.dataset.side === "left";
        gsap.from(item.querySelector(".tl-card"), {
          x: fromLeft ? -80 : 80,
          rotationY: fromLeft ? 20 : -20,
          opacity: 0,
          transformPerspective: 1200,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
        gsap.from(item.querySelector(".tl-dot"), { scale: 0, duration: 0.8, ease: "back.out(3)", scrollTrigger: { trigger: item, start: "top 70%", once: true } });
        gsap.from(item.querySelector(".tl-year"), {
          yPercent: 60,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mt-20">
      <div className="absolute bottom-0 left-5 top-0 w-px bg-fg/10 md:left-1/2" />
      <div className="tl-line absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-royal via-sky to-crimson md:left-1/2" />
      <div className="flex flex-col gap-16 md:gap-24">
        {milestones.map((m, i) => {
          const left = i % 2 === 0;
          return (
            <div key={m.year} data-side={left ? "left" : "right"} className="tl-item relative grid items-center gap-6 pl-14 md:grid-cols-2 md:gap-20 md:pl-0">
              <span className="tl-dot absolute left-5 top-8 z-10 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-base ring-2 ring-sky md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                <span className="h-2 w-2 rounded-full bg-crimson" />
              </span>
              <div className={`${left ? "md:order-1 md:text-right" : "md:order-2"} overflow-hidden`}>
                <p className="tl-year font-serif-luxe text-6xl text-transparent italic md:text-8xl" style={{ WebkitTextStroke: "1px var(--gold)" }}>
                  {m.year}
                </p>
              </div>
              <div className={`${left ? "md:order-2" : "md:order-1"}`} style={{ perspective: 1200 }}>
                <div className="tl-card glass luxe-border group overflow-hidden rounded-[1.75rem]">
                  <div className="relative h-52 overflow-hidden">
                    <SmartImage
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                      style={m.historic ? { filter: "sepia(0.55) contrast(1.05)" } : undefined}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                    {m.historic && (
                      <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-white uppercase backdrop-blur">
                        Archive
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <h3 className="font-display text-xl font-semibold text-fg">{m.title}</h3>
                    <p className="text-sm leading-relaxed text-mist">{m.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About British Way"
        crumb="About"
        watermark="HERITAGE"
        image="/logos/opt/aboutus.jpg"
        title={
          <>
            A legacy of <span className="accent">excellence</span> since 2004.
          </>
        }
        lotus
        description="A proudly Sri Lankan group built on trust, excellence and a relentless commitment to transforming lives, carrying the island's heritage of care and learning to the world."
      >
        <div className="flex flex-wrap gap-4">
          <LuxeButton to="/about#heritage">Enter the Heritage Hall</LuxeButton>
          <LuxeButton to="/about#companies" variant="ghost">
            Our companies
          </LuxeButton>
        </div>
      </PageHero>

      {/* Story */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Our story"
              title={
                <>
                  From one academy to a <span className="accent">family of eight.</span>
                </>
              }
            />
            <Reveal className="flex flex-col gap-5 text-[1.02rem] leading-relaxed text-mist" stagger={0.12}>
              <p>
                British Way Holdings (Pvt) Ltd was founded with a singular purpose: to elevate the standards of education and professional development in Sri
                Lanka. Over the past 20 years, we have grown from a single English academy into a diversified holding group spanning eight distinct
                enterprises.
              </p>
              <p>
                Today, our group serves over 50,000 students annually, employs hundreds of dedicated professionals, and maintains international partnerships
                with leading universities and institutions across the United Kingdom and beyond.
              </p>
            </Reveal>
            <Reveal className="grid gap-3 sm:grid-cols-2" stagger={0.06} y={20}>
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 rounded-2xl border border-fg/5 bg-fg/[0.03] px-4 py-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky to-royal text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-sm text-fg/80">{h}</span>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal className="relative" y={80}>
            <div className="relative">
              <Parallax className="aspect-[4/5] rounded-[2.5rem] border border-fg/10" speed={8}>
                <SmartImage src="/logos/opt/aboutus.jpg" alt="British Way Holdings leadership" className="h-full w-full object-cover" />
              </Parallax>
              <div className="glass-strong float absolute -bottom-8 -left-4 rounded-3xl p-6 md:-left-10">
                <CountUp value="20+" className="font-display text-5xl font-semibold text-fg" />
                <p className="mt-1 text-xs tracking-[0.2em] text-gold-hi uppercase">Years of excellence</p>
              </div>
              <div className="absolute -right-4 -top-8 hidden w-44 overflow-hidden rounded-3xl border-4 border-surface shadow-2xl md:block lg:-right-10">
                <SmartImage src="/logos/opt/britishway.jpg" alt="British Way English Academy" className="aspect-square w-full object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="relative border-y border-fg/5 bg-base-2/60 px-6 py-16 md:px-10">
        <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4" stagger={0.1}>
          {numbers.map((n) => (
            <div key={n.label} className="flex flex-col gap-2">
              <CountUp value={n.value} className="font-display text-4xl font-semibold text-fg md:text-6xl" />
              <span className="text-xs tracking-[0.25em] text-fg/50 uppercase">{n.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Vision & mission */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="center"
            eyebrow="Vision & mission"
            title={
              <>
                What <span className="accent">drives</span> us.
              </>
            }
          />
          <Reveal className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.15} y={70}>
            {visionMissionItems.map((item, i) => (
              <TiltCard key={item.title} className="rounded-[2rem]" max={6}>
                <div
                  className="on-dark relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-[2rem] border border-fg/10 p-8 md:p-12"
                  style={{ background: i === 0 ? "linear-gradient(145deg,#2d5fc4,#13295f 70%)" : "linear-gradient(145deg,#d3182a,#7a1320 75%)" }}
                >
                  <div className="orb -right-16 -top-16 h-56 w-56 bg-fg/10" />
                  <span className="absolute right-8 top-6 font-display text-[7rem] font-bold leading-none text-fg/5">0{i + 1}</span>
                  <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-fg/10 backdrop-blur">
                    <img src={item.icon} alt="" className="h-9 w-9 object-contain invert" />
                  </div>
                  <div className="relative mt-10">
                    <h3 className="font-display text-3xl font-semibold text-fg md:text-4xl">{item.title}</h3>
                    <p className="mt-4 text-[1.02rem] leading-relaxed text-fg/75">{item.text}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Journey */}
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
        <div className="orb left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 bg-pearl/70" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            align="center"
            eyebrow="Our journey"
            title={
              <>
                Milestones that <span className="accent">made us.</span>
              </>
            }
            description="Two decades of growth, from one classroom to a group that educates, hosts, entertains and inspires."
          />
          <Timeline />
        </div>
      </section>

      {/* Heritage Hall */}
      <section id="heritage" className="relative scroll-mt-24 px-4 py-24 md:px-10 md:py-32">
        <div className="absolute inset-x-0 top-1/3 h-2/3 bg-[radial-gradient(ellipse_at_center,rgba(205,223,246,0.8),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The Heritage Hall"
            title={
              <>
                Walk through our <span className="accent">history</span> in 3D.
              </>
            }
            description="A virtual museum of the British Way story. Drag to look around, walk with W A S D, or press Tour for a guided visit past every milestone to our Hall of Honours. On a VR headset, choose Enter VR."
            className="mb-12 px-2"
          />
          <Reveal y={60}>
            <HeritageHall />
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Core values"
            title={
              <>
                The principles that <span className="accent">guide us.</span>
              </>
            }
          />
          <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08} y={60}>
            {coreValues.map((v, i) => (
              <TiltCard key={v.title} className="h-full rounded-[1.75rem]" max={10}>
                <div className="glass luxe-border group relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] p-7">
                  <span className="font-display text-xs text-fg/30">0{i + 1}</span>
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-pearl/70 to-transparent ring-1 ring-sky/30 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                    <img src={v.icon} alt="" className="h-9 w-9 object-contain opacity-80" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-fg">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-mist">{v.desc}</p>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="relative scroll-mt-24 px-6 pb-24 pt-8 md:px-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Group companies"
            title={
              <>
                Meet the <span className="accent">family.</span>
              </>
            }
            description="Eight companies across education, hospitality, media, sports and entertainment."
            action={
              <LuxeButton to="/leadership" variant="ghost">
                Our leadership
              </LuxeButton>
            }
          />
          <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08} y={70}>
            {companies.map((c, i) => (
              <CompanyCard key={c.slug} company={c} index={i} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
