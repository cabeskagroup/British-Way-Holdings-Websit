import { useRef, useState } from "react";
import { ArrowUpRight, Calendar, Search } from "lucide-react";
import { newsItems as news, newsCategories as categories } from "@/data/news";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SmartImage } from "../components/ui-luxe/SmartImage";
import { TiltCard } from "../components/fx/TiltCard";

const categoryColors: Record<string, string> = {
  Achievement: "#2fbf71",
  Event: "#b04ad8",
  Award: "#d8b36a",
  Partnership: "#3d7be0",
  Programme: "#e0553d",
  Announcement: "#4ac0d8",
};

export function NewsPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const grid = useRef<HTMLDivElement>(null);

  const q = search.trim().toLowerCase();
  const filtered = news.filter(
    (n) => (active === "All" || n.category === active) && (!q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)),
  );
  const featured = filtered.find((n) => n.featured && active === "All" && !q);
  const rest = featured ? filtered.filter((n) => n.id !== featured.id) : filtered;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".news-card", { y: 60, opacity: 0, rotationX: -15 }, { y: 0, opacity: 1, rotationX: 0, stagger: 0.07, duration: 1, ease: "expo.out", transformPerspective: 1000 });
    },
    { scope: grid, dependencies: [active, q] },
  );

  return (
    <>
      <PageHero
        eyebrow="News & events"
        crumb="News"
        watermark="NEWSROOM"
        image="/logos/glry11.jpg"
        title={
          <>
            Stories from across <span className="accent">the group.</span>
          </>
        }
        description="Achievements, events, partnerships and announcements from every British Way company."
      />

      <section className="relative px-6 pb-28 md:px-10">
        <div ref={grid} className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="glass-strong sticky top-24 z-30 mb-12 flex flex-col gap-4 rounded-[1.75rem] p-3 md:flex-row md:items-center">
            <label className="relative flex-1 md:max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the newsroom…"
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-[#d8b36a]/60 focus:outline-none"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0" data-lenis-prevent>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`shrink-0 rounded-full px-4 py-2 font-display text-[13px] font-medium transition-all duration-300 ${
                    active === c ? "bg-gradient-to-r from-[#d8b36a] to-[#f3dca0] text-[#1a1204] shadow-[0_8px_30px_-8px_rgba(216,179,106,0.7)]" : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {featured && (
            <article className="news-card group relative mb-8 grid overflow-hidden rounded-[2.25rem] border border-white/10 lg:grid-cols-[1.3fr_1fr]">
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[480px]">
                <SmartImage src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070b17] max-lg:bg-gradient-to-t" />
                <span className="absolute left-6 top-6 rounded-full bg-[#d8b36a] px-4 py-1.5 font-display text-xs font-semibold text-[#1a1204]">Featured</span>
              </div>
              <div className="relative flex flex-col justify-center gap-5 bg-[#070b17] p-8 md:p-12">
                <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: categoryColors[featured.category] }}>
                  {featured.category}
                </span>
                <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">{featured.title}</h2>
                <p className="leading-relaxed text-mist">{featured.excerpt}</p>
                <span className="flex items-center gap-2 text-sm text-white/45">
                  <Calendar size={14} /> {featured.date}
                </span>
              </div>
            </article>
          )}

          {rest.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((n) => (
                <div key={n.id} className="news-card">
                  <TiltCard className="h-full rounded-[1.75rem]" max={6}>
                    <article className="glass luxe-border group flex h-full flex-col overflow-hidden rounded-[1.75rem]">
                      <div className="relative h-56 overflow-hidden">
                        <SmartImage src={n.image} alt={n.title} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b17] to-transparent" />
                        <span
                          className="absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[11px] font-semibold text-[#04060d]"
                          style={{ background: categoryColors[n.category] ?? "#d8b36a" }}
                        >
                          {n.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        <span className="flex items-center gap-2 text-xs text-white/45">
                          <Calendar size={13} /> {n.date}
                        </span>
                        <h3 className="font-display text-lg font-semibold leading-snug text-white">{n.title}</h3>
                        <p className="flex-1 text-sm leading-relaxed text-mist">{n.excerpt}</p>
                        <span className="mt-2 flex items-center gap-2 font-display text-sm font-semibold text-[#f3dca0]">
                          Read story <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </article>
                  </TiltCard>
                </div>
              ))}
            </div>
          ) : (
            !featured && (
              <div className="news-card glass rounded-[2rem] py-24 text-center">
                <p className="font-display text-xl text-white">No stories found</p>
                <p className="mt-2 text-mist">Try a different search or category.</p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
