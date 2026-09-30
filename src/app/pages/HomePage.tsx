import { Link } from "react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import { companies } from "@/data/companies";
import { getLatestNews, newsWhen } from "@/data/news";
import { getFeaturedLeaders } from "@/data/leaders";
import { HeroSlider } from "../components/home/HeroSlider";
import { LogoOrbit } from "../components/home/LogoOrbit";
import { SectorShowcase } from "../components/home/SectorShowcase";
import { HeritageTeaser } from "../components/home/HeritageTeaser";
import { GalleryMosaic } from "../components/home/GalleryMosaic";
import { Marquee } from "../components/fx/Marquee";
import { Reveal } from "../components/fx/Reveal";
import { CountUp } from "../components/fx/CountUp";
import { TiltCard } from "../components/fx/TiltCard";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { CompanyCard } from "../components/ui-luxe/CompanyCard";
import { SmartImage } from "../components/ui-luxe/SmartImage";

const pillars = ["Sri Lankan Heritage", "Education", "Hospitality", "Global Standards", "Productions", "Sports", "Powering the Island", "Entertainment"];

const groupStats = [
  { value: "8", label: "Companies" },
  { value: "5", label: "Industries" },
  { value: "2000+", label: "People" },
  { value: "40+", label: "Awards" },
];

export function HomePage() {
  const news = getLatestNews(3);
  const leaders = getFeaturedLeaders();

  return (
    <>
      <HeroSlider />

      {/* Pillars ticker */}
      <div className="relative border-y border-fg/5 bg-base-2/60 py-7">
        <Marquee speed={45}>
          {pillars.map((p, i) => (
            <span key={p} className="flex items-center gap-10 pr-10 font-display text-[clamp(2rem,5vw,4.2rem)] font-semibold tracking-[-0.03em]">
              <span className={i % 2 ? "outline-bold" : "text-fg"}>{p}</span>
              <span className="h-2.5 w-2.5 rotate-45 bg-crimson md:h-3 md:w-3" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* The group: logo orbit */}
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-36">
        <div className="orb -left-40 top-20 h-[500px] w-[500px] bg-pearl/70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="One Group · Eight Sri Lankan Brands"
              title={
                <>
                  Sri Lankan brands, <span className="accent">built for the world.</span>
                </>
              }
              description="Academies, an international school, a UK-partnered campus, a boutique hotel, a production house, a cricket academy and an entertainment company. Each was born in Sri Lanka, each is built to world standards, and all move together."
            />
            <Reveal className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" stagger={0.08}>
              {groupStats.map((s) => (
                <div key={s.label} className="glass luxe-border rounded-2xl p-5">
                  <CountUp value={s.value} className="font-display text-3xl font-semibold text-fg" />
                  <p className="mt-1 text-[11px] tracking-[0.2em] text-fg/50 uppercase">{s.label}</p>
                </div>
              ))}
            </Reveal>
            <Reveal y={20}>
              <LuxeButton to="/about" variant="ghost">
                Our story
              </LuxeButton>
            </Reveal>
          </div>
          <LogoOrbit />
        </div>
      </section>

      <SectorShowcase />

      {/* Companies */}
      <section className="band-blue relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Companies"
            title={
              <>
                Eight brands. <span className="accent">One legacy.</span>
              </>
            }
            description="Explore each member of the British Way family."
            action={
              <LuxeButton to="/about#companies" variant="ghost">
                View all
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

      <HeritageTeaser />

      {/* Leadership */}
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
        <div className="orb right-0 top-1/3 h-[420px] w-[420px] bg-pearl/60" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Leadership"
            title={
              <>
                Guided by <span className="accent">visionaries.</span>
              </>
            }
            action={
              <LuxeButton to="/leadership" variant="ghost">
                Meet the team
              </LuxeButton>
            }
          />
          <Reveal className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.15} y={80}>
            {leaders.map((l) => (
              <TiltCard key={l.name} max={5} className="rounded-[2rem]">
                <div className="glass luxe-border group relative grid overflow-hidden rounded-[2rem] sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative h-96 overflow-hidden sm:h-full sm:min-h-[420px]">
                    <SmartImage src={l.image} alt={l.name} className="absolute inset-0 h-full w-full object-cover object-top grayscale-[0.5] transition-all duration-[1.2s] group-hover:scale-105 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b3f8f]/35 via-transparent to-sky/10 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                    <div className="absolute inset-0 hidden bg-gradient-to-l from-surface via-transparent to-transparent sm:block" />
                  </div>
                  <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
                    <Quote className="h-10 w-10 text-gold/60" />
                    <p className="font-serif-luxe text-xl leading-snug text-fg/90 italic md:text-2xl">“{l.message}”</p>
                    <div>
                      <p className="font-display text-lg font-semibold text-fg">{l.name}</p>
                      <p className="text-sm text-gold-hi">{l.title}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="band-blue relative px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Moments of excellence"
            title={
              <>
                Life across <span className="accent">the group.</span>
              </>
            }
            description="Ceremonies, premieres and community moments from across the island. Tap any card to view it full size."
            action={
              <LuxeButton to="/gallery" variant="ghost">
                Open gallery
              </LuxeButton>
            }
          />
          <div className="mt-14">
            <GalleryMosaic />
          </div>
        </div>
      </section>

      {/* News */}
      <section className="relative px-6 pb-28 pt-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Newsroom"
            title={
              <>
                Latest from <span className="accent">the island.</span>
              </>
            }
            action={
              <LuxeButton to="/news" variant="ghost">
                All news
              </LuxeButton>
            }
          />
          <Reveal className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]" stagger={0.12} y={60}>
            {news[0] && (
              <Link to="/news" className="on-dark group relative flex min-h-[460px] overflow-hidden rounded-[2rem] border border-fg/10">
                <SmartImage src={news[0].image} alt={news[0].title} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1.6s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/50 to-transparent" />
                <div className="relative mt-auto flex flex-col gap-4 p-8 md:p-10">
                  <span className="w-fit rounded-full bg-royal px-3 py-1 font-display text-[11px] font-semibold text-white">{news[0].category}</span>
                  <h3 className="max-w-xl font-display text-2xl font-semibold leading-tight text-fg md:text-3xl">{news[0].title}</h3>
                  <p className="max-w-xl text-sm text-fg/65">{news[0].excerpt}</p>
                  <span className="text-xs tracking-widest text-fg/45 uppercase">{newsWhen(news[0]) ?? news[0].company}</span>
                </div>
              </Link>
            )}
            <div className="flex flex-col gap-5">
              {news.slice(1).map((n) => (
                <Link key={n.id} to="/news" className="glass luxe-border group flex flex-1 gap-5 overflow-hidden rounded-[1.75rem] p-4">
                  <div className="relative w-36 shrink-0 overflow-hidden rounded-2xl md:w-44">
                    <SmartImage src={n.image} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col justify-center gap-2 py-2 pr-2">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-gold-hi uppercase">{n.category}</span>
                    <h3 className="font-display text-base font-semibold leading-snug text-fg md:text-lg">{n.title}</h3>
                    <span className="flex items-center gap-1 text-xs text-fg/45">
                      {newsWhen(n) ?? n.company} <ArrowUpRight size={13} className="ml-auto text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
