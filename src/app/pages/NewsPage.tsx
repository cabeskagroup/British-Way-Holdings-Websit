import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Building2, Clock, MapPin, Search, Sparkles, X } from "lucide-react";
import { newsItems as news, newsCategories as categories, newsWhen, type NewsItem } from "@/data/news";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { Liyawela } from "../components/ui-luxe/Heritage";
import { TiltCard } from "../components/fx/TiltCard";
import { Reveal } from "../components/fx/Reveal";
import { Parallax } from "../components/fx/Parallax";
import { useLenis } from "../components/fx/SmoothScroll";
import { EventsCalendar, categoryColors } from "../components/news/EventsCalendar";

/** Full-screen reader for a single story, with the original poster. */
function StoryReader({ story, onClose }: { story: NewsItem; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".sr-panel", { y: 60, opacity: 0, rotationX: -10, transformPerspective: 1200, duration: 0.9, ease: "expo.out" });
    },
    { scope: root, dependencies: [story.id] },
  );

  const when = newsWhen(story);
  return createPortal(
    <div ref={root} className="fixed inset-0 z-[160] overflow-y-auto bg-base/90 p-4 backdrop-blur-xl md:p-10" onClick={onClose} role="dialog" aria-modal="true" data-lenis-prevent>
      <div className="sr-panel glass-strong mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] md:grid-cols-[1.1fr_1fr]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black">
          <img src={story.image} alt={story.title} className="h-full max-h-[80vh] w-full object-contain" />
        </div>
        <div className="relative flex flex-col gap-5 p-7 md:p-10">
          <button onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-fg/15 text-fg hover:bg-fg/10" aria-label="Close">
            <X size={18} />
          </button>
          <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: categoryColors[story.category] }}>
            {story.category}
          </span>
          <h2 className="pr-10 font-display text-2xl font-semibold leading-tight text-fg md:text-3xl">{story.title}</h2>
          <p className="leading-relaxed text-mist">{story.excerpt}</p>
          <div className="mt-2 flex flex-col gap-2 border-t border-fg/10 pt-5 text-sm text-fg/70">
            <span className="flex items-center gap-2">
              <Building2 size={15} className="text-gold" /> {story.company}
            </span>
            {when && (
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-gold" /> {when}
                {story.time ? ` · ${story.time}` : ""}
              </span>
            )}
            {story.place && (
              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-gold" /> {story.place}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function NewsPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<NewsItem | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  const featured = news.find((n) => n.featured)!;
  const q = search.trim().toLowerCase();
  const filtered = news.filter(
    (n) =>
      n.id !== featured.id &&
      (active === "All" || n.category === active) &&
      (!q || `${n.title} ${n.excerpt} ${n.company}`.toLowerCase().includes(q)),
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".news-card", { y: 60, opacity: 0, rotationX: -15 }, { y: 0, opacity: 1, rotationX: 0, stagger: 0.06, duration: 1, ease: "expo.out", transformPerspective: 1000 });
    },
    { scope: grid, dependencies: [active, q] },
  );

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        crumb="News"
        watermark="NEWSROOM"
        image="/logos/opt/glry03.jpg"
        title={
          <>
            Stories from across <span className="accent">the island.</span>
          </>
        }
        description="Milestones, ceremonies, premieres and programmes, straight from the British Way family."
      />

      {/* Featured story */}
      <section className="relative px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal y={60}>
            <button onClick={() => setOpen(featured)} className="group relative grid w-full overflow-hidden rounded-[2.5rem] border border-gold/30 text-left lg:grid-cols-[1.25fr_1fr]">
              <Parallax className="relative min-h-[360px] lg:min-h-[560px]" speed={8}>
                <SmartImage src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover object-top" />
              </Parallax>
              <div className="relative flex flex-col justify-center gap-6 bg-gradient-to-br from-champagne/50 via-surface to-pearl/40 p-8 md:p-12">
                <div className="orb -right-10 -top-10 h-48 w-48 bg-blush/70" />
                <span className="relative flex w-fit items-center gap-2 rounded-full bg-[#d8b36a] px-4 py-1.5 font-display text-xs font-semibold text-[#1a1204]">
                  <Sparkles size={13} /> A first for Sri Lanka's private sector
                </span>
                <h2 className="relative font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg md:text-5xl">{featured.title}</h2>
                <p className="relative text-lg leading-relaxed text-mist">{featured.excerpt}</p>
                <span className="relative flex items-center gap-2 font-display text-sm font-semibold text-gold-hi">
                  Read the story <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          </Reveal>
        </div>
      </section>

      {/* Calendar */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="orb left-0 top-1/3 h-[420px] w-[420px] bg-pearl/70" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What's on"
            title={
              <>
                The British Way <span className="accent">calendar.</span>
              </>
            }
            description="Pick a highlighted day to see what happened across the group. Stories without a confirmed date are listed for the year."
            className="mb-12"
          />
          <EventsCalendar onOpen={setOpen} />
        </div>
      </section>

      {/* All stories */}
      <section className="relative px-6 pb-28 md:px-10">
        <div ref={grid} className="mx-auto max-w-7xl">
          <Liyawela className="mb-12" opacity={0.3} />
          <div className="glass-strong sticky top-24 z-30 mb-12 flex flex-col gap-4 rounded-[1.75rem] p-3 md:flex-row md:items-center">
            <label className="relative flex-1 md:max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories…"
                className="w-full rounded-full border border-fg/10 bg-fg/5 py-3 pl-11 pr-4 text-sm text-fg placeholder:text-fg/35 focus:border-gold/60 focus:outline-none"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0" data-lenis-prevent>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`shrink-0 rounded-full px-4 py-2 font-display text-[13px] font-medium transition-all duration-300 ${
                    active === c ? "bg-gradient-to-r from-[#d8b36a] to-[#f3dca0] text-[#1a1204] shadow-[0_8px_30px_-8px_rgba(216,179,106,0.7)]" : "text-fg/65 hover:bg-fg/10 hover:text-fg"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((n) => {
                const when = newsWhen(n);
                return (
                  <div key={n.id} className="news-card">
                    <TiltCard className="h-full rounded-[1.75rem]" max={6}>
                      <button onClick={() => setOpen(n)} className="glass luxe-border group flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] text-left">
                        <div className="relative aspect-square overflow-hidden">
                          <SmartImage src={n.image} alt={n.title} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                          <span className="absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[11px] font-semibold text-white" style={{ background: categoryColors[n.category] }}>
                            {n.category}
                          </span>
                          {when && (
                            <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] text-white backdrop-blur">{when}</span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <span className="text-[11px] tracking-[0.15em] text-fg/45 uppercase">{n.company}</span>
                          <h3 className="font-display text-lg font-semibold leading-snug text-fg">{n.title}</h3>
                          <p className="flex-1 text-sm leading-relaxed text-mist">{n.excerpt}</p>
                          <span className="mt-2 flex items-center gap-2 font-display text-sm font-semibold text-gold-hi">
                            Read story <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </button>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="news-card glass rounded-[2rem] py-24 text-center">
              <p className="font-display text-xl text-fg">No stories found</p>
              <p className="mt-2 text-mist">Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>

      {open && <StoryReader story={open} onClose={() => setOpen(null)} />}
    </>
  );
}
