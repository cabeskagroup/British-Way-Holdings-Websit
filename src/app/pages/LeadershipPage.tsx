import { useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronRight, Quote, RotateCw } from "lucide-react";
import { leaders } from "@/data/leaders";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { LotusMandala, Liyawela } from "../components/ui-luxe/Heritage";
import { SplitHeading } from "../components/fx/SplitHeading";
import { Reveal } from "../components/fx/Reveal";
import { Marquee } from "../components/fx/Marquee";
import { onIntroDone } from "../components/fx/intro";
import { LeadershipStructure } from "../components/leadership/LeadershipStructure";

const principles = ["Integrity", "Vision", "Service", "Excellence", "Heritage", "Courage", "Community", "Global outlook"];

/** Portrait card that flips over to reveal the bio. */
function FlipCard({ name, title, bio, image }: { name: string; title: string; bio: string; image: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-[440px] w-full text-left [perspective:1400px]"
      aria-label={`${name}, ${title}. ${flipped ? "Show photo" : "Show biography"}`}
    >
      <div
        className={`relative h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : "group-hover:[transform:rotateY(12deg)]"
        }`}
      >
        {/* Front */}
        <div className="on-dark absolute inset-0 overflow-hidden rounded-[2rem] border border-fg/10 bg-surface [backface-visibility:hidden]">
          <SmartImage src={image} alt={name} className="h-full w-full object-cover object-top grayscale-[0.35] transition-all duration-700 group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-base-2 via-base-2/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-hi uppercase">{title}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-fg">{name}</h3>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-fg/20 bg-black/30 text-fg backdrop-blur">
              <RotateCw size={15} />
            </span>
          </div>
        </div>
        {/* Back */}
        <div className="on-dark absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-gold/50 bg-gradient-to-br from-[#1b3f8f] via-navy to-navy-deep p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <LotusMandala className="absolute -right-24 -top-24 h-72 w-72" opacity={0.06} />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-hi uppercase">{title}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{name}</h3>
          </div>
          <p className="relative text-[15px] leading-relaxed text-fg/80">{bio}</p>
          <span className="relative flex items-center gap-2 text-xs text-fg/50">
            <RotateCw size={13} /> Tap to flip back
          </span>
        </div>
      </div>
    </button>
  );
}

export function LeadershipPage() {
  const featured = leaders.filter((l) => l.featured);
  const team = leaders.filter((l) => !l.featured);
  const root = useRef<HTMLDivElement>(null);
  const fan = [leaders[1], leaders[0], leaders[2]];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ paused: true });
      tl.from(".lh-card", { y: 160, rotationY: (i) => [-50, 0, 50][i], opacity: 0, stagger: 0.12, duration: 1.6, ease: "expo.out" })
        .from(".lh-fade", { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out" }, 0.2);
      const off = onIntroDone(() => tl.play());

      gsap.utils.toArray<HTMLElement>(".ld-portrait").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        gsap.fromTo(el.querySelector("img"), { scale: 1.35 }, { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ld-ring").forEach((el) => gsap.to(el, { rotate: 360, duration: 40, repeat: -1, ease: "none" }));
      return off;
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero with fanned portraits */}
      <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
        <LotusMandala className="spin-slower pointer-events-none absolute -right-60 -top-40 h-[820px] w-[820px]" opacity={0.04} />
        <div className="grid-lines absolute inset-0 opacity-50" />
        <div className="orb -left-40 top-20 h-[420px] w-[420px] bg-pearl/70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:px-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-7">
            <nav className="lh-fade flex items-center gap-2 font-display text-xs tracking-widest text-fg/50 uppercase">
              <Link to="/" className="hover:text-gold-hi">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-gold">Leadership</span>
            </nav>
            <span className="lh-fade eyebrow">Leadership</span>
            <SplitHeading as="h1" trigger="intro" delay={0.2} className="font-display text-[clamp(2.8rem,7vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-fg">
              Guided by <span className="accent">visionaries.</span>
            </SplitHeading>
            <p className="lh-fade max-w-xl text-lg leading-relaxed text-mist">
              Sri Lankan leaders with decades of combined experience, building home-grown brands to world standards while keeping the group rooted in
              the values of the island.
            </p>
            <div className="lh-fade">
              <LuxeButton to="#structure" variant="ghost">
                See how we're led
              </LuxeButton>
            </div>
          </div>
          <div className="relative h-[440px] md:h-[520px]" style={{ perspective: 1400 }}>
            {fan.map((l, i) => (
              <div
                key={l.name}
                className="absolute left-1/2 top-1/2 w-[56%] md:w-[46%]"
                style={{ transform: `translate(-50%, -50%) translateX(${(i - 1) * 62}%) rotate(${(i - 1) * 7}deg) translateY(${i === 1 ? -10 : 16}px)`, zIndex: i === 1 ? 3 : 1 }}
              >
                <div className="lh-card">
                  <div className="on-dark group relative overflow-hidden rounded-[2rem] border border-white/40 bg-surface shadow-[0_40px_80px_-34px_rgba(20,33,63,0.6)] transition-transform duration-700 hover:-translate-y-4">
                    <div className="aspect-[3/4] overflow-hidden">
                      <SmartImage src={l.image} alt={l.name} eager className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-2 to-transparent p-4 pt-12">
                      <p className="font-display text-sm font-semibold text-fg">{l.name}</p>
                      <p className="text-[10px] tracking-[0.2em] text-gold-hi uppercase">{l.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-y border-fg/5 bg-base-2/60 py-6">
        <Marquee speed={50}>
          {principles.map((p, i) => (
            <span key={p} className="flex items-center gap-8 pr-8 font-serif-luxe text-[clamp(1.8rem,4vw,3.2rem)] italic">
              <span className={i % 2 ? "text-fg/25" : "gold-text"}>{p}</span>
              <span className="h-2 w-2 rotate-45 bg-crimson" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Featured leaders */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-28 md:gap-40">
          {featured.map((l, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={l.name} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div className={`relative mx-auto w-full max-w-md ${flip ? "lg:order-2" : ""}`}>
                  <div className="ld-ring absolute -inset-6 rounded-t-full rounded-b-[3rem] border border-dashed border-gold/35" />
                  <div className="orb -inset-10 bg-pearl/70" />
                  <div className="ld-portrait relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] border border-fg/10 bg-surface">
                    <SmartImage src={l.image} alt={l.name} className="h-full w-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent" />
                  </div>
                  <div className="glass-strong absolute -bottom-6 left-1/2 w-max -translate-x-1/2 rounded-full px-6 py-3 text-center">
                    <p className="font-display text-xs font-semibold tracking-[0.3em] text-gold-hi uppercase">{l.title}</p>
                  </div>
                </div>
                <div className={`flex flex-col gap-7 ${flip ? "lg:order-1" : ""}`}>
                  <span className="eyebrow">
                    0{i + 1} · {l.title}
                  </span>
                  <SplitHeading className="font-display text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-fg">
                    {l.name}
                  </SplitHeading>
                  <Reveal className="flex flex-col gap-7" stagger={0.12} y={30}>
                    <p className="text-[1.05rem] leading-relaxed text-mist">{l.bio}</p>
                    {l.message && (
                      <blockquote className="glass luxe-border relative rounded-[2rem] p-8">
                        <Quote className="absolute -top-5 left-8 h-10 w-10 rounded-full bg-royal p-2 text-white" />
                        <p className="font-serif-luxe text-2xl leading-snug text-fg/90 italic">“{l.message}”</p>
                      </blockquote>
                    )}
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Structure */}
      <section id="structure" className="relative scroll-mt-24 px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <Liyawela className="mb-14" opacity={0.3} />
          <SectionHeading
            align="center"
            eyebrow="How we're led"
            title={
              <>
                Board & <span className="accent">management.</span>
              </>
            }
            className="mb-14"
          />
          <LeadershipStructure />
        </div>
      </section>

      {/* Team flip cards */}
      <section className="relative px-6 pb-28 md:px-10">
        <div className="orb right-0 top-0 h-[420px] w-[420px] bg-pearl/60" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Management team"
            title={
              <>
                The people who make it <span className="accent">happen.</span>
              </>
            }
            description="Tap or click a card to read each profile."
          />
          <Reveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1} y={70}>
            {team.map((l) => (
              <FlipCard key={l.name} name={l.name} title={l.title} bio={l.bio} image={l.image} />
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
