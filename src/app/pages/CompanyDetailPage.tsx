import { useRef } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowUpRight, Globe, Mail, Phone } from "lucide-react";
import { companies, getCompanyBySlug } from "@/data/companies";
import { sectors } from "@/data/sectors";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { onIntroDone } from "../components/fx/intro";
import { SplitHeading } from "../components/fx/SplitHeading";
import { Reveal } from "../components/fx/Reveal";
import { TiltCard } from "../components/fx/TiltCard";
import { Parallax } from "../components/fx/Parallax";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { LogoChip } from "../components/ui-luxe/LogoChip";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { CompanyCard } from "../components/ui-luxe/CompanyCard";

export function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const company = slug ? getCompanyBySlug(slug) : undefined;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!company || prefersReducedMotion()) return;
      const tl = gsap.timeline({ paused: true });
      tl.from(".cd-bg", { scale: 1.3, opacity: 0, duration: 2, ease: "expo.out" })
        .from(".cd-logo", { scale: 0.6, rotationY: -60, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.3)
        .from(".cd-fade", { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out" }, 0.5);
      const off = onIntroDone(() => tl.play());
      gsap.to(".cd-bg", { yPercent: 20, ease: "none", scrollTrigger: { trigger: ".cd-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".cd-next-word", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: ".cd-next", start: "top bottom", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: root, dependencies: [slug] },
  );

  if (!company) return <Navigate to="/about#companies" replace />;

  const index = companies.findIndex((c) => c.slug === company.slug);
  const next = companies[(index + 1) % companies.length];
  const others = companies.filter((c) => c.slug !== company.slug).slice(0, 4);
  const sector = sectors.find((s) => s.companies.includes(company.slug));
  const site = company.website.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="cd-hero relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-36 md:pb-24">
        <div className="cd-bg absolute inset-0">
          <SmartImage src={company.img} alt="" eager from={company.color} to={company.accent} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(115deg, var(--base) 24%, ${company.color}40 62%, transparent)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent" />
        <div className="grid-lines absolute inset-0 opacity-50" />
        <div className="orb -left-32 bottom-0 h-[480px] w-[480px] opacity-25" style={{ background: company.accent }} />

        <div className="relative mx-auto grid w-full max-w-7xl items-end gap-10 px-6 md:px-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <nav className="cd-fade flex items-center gap-2 font-display text-xs tracking-widest text-fg/50 uppercase">
              <Link to="/" className="hover:text-gold-hi">
                Home
              </Link>
              <span>/</span>
              <Link to="/about#companies" className="hover:text-gold-hi">
                Companies
              </Link>
              <span>/</span>
              <span className="text-gold">{company.short}</span>
            </nav>
            <span className="cd-fade eyebrow">{company.cat}</span>
            <SplitHeading as="h1" trigger="intro" delay={0.3} className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-fg">
              {company.name}
            </SplitHeading>
            <p className="cd-fade font-serif-luxe text-2xl text-gold-hi italic md:text-3xl">{company.tagline}</p>
            <p className="cd-fade max-w-2xl text-lg leading-relaxed text-fg/70">{company.desc}</p>
            <div className="cd-fade mt-2 flex flex-wrap gap-4">
              <LuxeButton href={company.website}>Visit {company.short} website</LuxeButton>
              <LuxeButton to="/about#companies" variant="ghost">
                All companies
              </LuxeButton>
            </div>
          </div>
          <div className="hidden justify-end lg:flex" style={{ perspective: 1000 }}>
            <div className="cd-logo float relative">
              <div className="orb -inset-10 opacity-35" style={{ background: company.accent }} />
              <LogoChip company={company} className="relative h-56 w-72 rounded-[2rem]" padding="p-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Story + highlights */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow={sector ? sector.title : "About"}
              title={
                <>
                  About <span className="accent">{company.short}</span>
                </>
              }
            />
            <Reveal y={30}>
              <p className="text-[1.1rem] leading-relaxed text-mist">{company.longDesc}</p>
            </Reveal>
            <Reveal className="grid gap-4 sm:grid-cols-2" stagger={0.1} y={50}>
              {company.points.map((p, i) => (
                <TiltCard key={p} className="rounded-3xl" max={8}>
                  <div className="glass luxe-border group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl p-6">
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80" style={{ background: company.accent }} />
                    <span className="font-display text-sm font-semibold text-gold-hi">0{i + 1}</span>
                    <p className="relative font-display text-lg font-semibold leading-snug text-fg">{p}</p>
                  </div>
                </TiltCard>
              ))}
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal y={60}>
              <Parallax className="aspect-[4/3] rounded-[2rem] border border-fg/10" speed={8}>
                <SmartImage src={company.img} alt={company.name} from={company.color} to={company.accent} className="h-full w-full object-cover" />
              </Parallax>
            </Reveal>
            <Reveal y={40}>
              <div className="glass-strong luxe-border flex flex-col gap-5 rounded-[2rem] p-7">
                <span className="eyebrow">Get in touch</span>
                {[
                  company.phone && { icon: Phone, label: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}` },
                  company.email && { icon: Mail, label: company.email, href: `mailto:${company.email}` },
                  { icon: Globe, label: site, href: company.website, external: true },
                ]
                  .filter(Boolean)
                  .map((item) => {
                    const it = item as { icon: typeof Phone; label: string; href: string; external?: boolean };
                    return (
                      <a
                        key={it.label}
                        href={it.href}
                        target={it.external ? "_blank" : undefined}
                        rel={it.external ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-4 rounded-2xl border border-fg/5 bg-fg/[0.03] p-3 transition-colors hover:border-fg/20"
                      >
                        <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${company.accent}22`, color: "var(--gold-hi)" }}>
                          <it.icon size={17} />
                        </span>
                        <span className="text-fg/85">{it.label}</span>
                        <ArrowUpRight size={16} className="ml-auto text-fg/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-hi" />
                      </a>
                    );
                  })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* More companies */}
      <section className="relative px-6 pb-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The family"
            title={
              <>
                More from <span className="accent">British Way.</span>
              </>
            }
          />
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08} y={60}>
            {others.map((c) => (
              <CompanyCard key={c.slug} company={c} index={companies.indexOf(c)} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Next company */}
      <Link to={`/companies/${next.slug}`} className="cd-next group relative mt-24 block overflow-hidden border-y border-fg/10 py-16 md:py-24">
        <div className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-out group-hover:scale-y-100" style={{ background: `linear-gradient(120deg, ${next.color}, ${next.accent})` }} />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
          <div>
            <span className="eyebrow">Next company</span>
            <p className="cd-next-word mt-4 whitespace-nowrap font-display text-[clamp(2.4rem,8vw,7rem)] font-semibold leading-none tracking-[-0.04em] text-fg transition-colors duration-500 group-hover:text-white">
              {next.name}
            </p>
          </div>
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-fg/20 text-fg transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-black md:h-24 md:w-24">
            <ArrowUpRight size={30} />
          </span>
        </div>
      </Link>
    </div>
  );
}
