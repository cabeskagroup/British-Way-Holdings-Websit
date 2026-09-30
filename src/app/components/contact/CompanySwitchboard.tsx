import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Globe, Mail, Phone } from "lucide-react";
import { companies } from "@/data/companies";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { LogoChip } from "../ui-luxe/LogoChip";
import { SmartImage } from "../ui-luxe/SmartImage";

/**
 * Direct lines to every subsidiary: pick a company on the left and its
 * contact card flips into view on the right with call, email and web actions.
 */
export function CompanySwitchboard() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const c = companies[active];
  const site = c.website.replace(/^https?:\/\/(www\.)?/, "");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".sb-panel", { rotationY: -18, x: 40, opacity: 0 }, { rotationY: 0, x: 0, opacity: 1, duration: 0.9, ease: "expo.out", transformPerspective: 1400 });
      gsap.fromTo(".sb-line", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, delay: 0.15, ease: "expo.out" });
    },
    { scope: panel, dependencies: [active] },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
      {/* Company list */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" data-lenis-prevent role="tablist" aria-label="Group companies">
        {companies.map((co, i) => (
          <button
            key={co.slug}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
            className={`group relative flex shrink-0 items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-500 lg:shrink ${
              i === active ? "border-gold/70 bg-surface shadow-[0_18px_40px_-24px_rgba(20,33,63,0.45)]" : "border-fg/10 bg-surface/50 hover:border-fg/25"
            }`}
          >
            <span className="absolute inset-y-0 left-0 w-1 transition-all duration-500" style={{ background: i === active ? co.accent : "transparent" }} />
            <LogoChip company={co} className="h-11 w-14 shrink-0" padding="p-1.5" />
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-semibold text-fg">{co.name}</span>
              <span className="hidden text-xs text-fg/45 lg:block">{co.phone}</span>
            </span>
            <ArrowUpRight size={16} className={`ml-auto hidden shrink-0 transition-all duration-500 lg:block ${i === active ? "text-gold-hi" : "text-fg/25"}`} />
          </button>
        ))}
      </div>

      {/* Contact card */}
      <div ref={panel} style={{ perspective: 1400 }}>
        <div key={c.slug} className="sb-panel on-dark relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[2.25rem] border border-fg/10">
          <SmartImage src={c.img} alt="" from={c.color} to={c.accent} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c.color}ee 0%, #111c3af2 55%, #0c1530 100%)` }} />
          <div className="orb -right-16 -top-16 h-64 w-64 opacity-50" style={{ background: c.accent }} />

          <div className="relative flex flex-1 flex-col gap-6 p-7 md:p-10">
            <div className="sb-line flex items-start justify-between gap-4">
              <LogoChip company={c} className="h-20 w-32" padding="p-2" />
              <span className="rounded-full border border-fg/20 bg-black/20 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-fg/80 uppercase backdrop-blur">
                {c.cat}
              </span>
            </div>
            <div>
              <h3 className="sb-line font-display text-3xl font-semibold leading-tight text-fg md:text-4xl">{c.name}</h3>
              <p className="sb-line mt-2 font-serif-luxe text-xl text-gold-hi italic">{c.tagline}</p>
            </div>

            <div className="mt-auto grid gap-3 sm:grid-cols-3">
              {c.phone && (
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="sb-line glass group flex flex-col gap-3 rounded-2xl p-4 transition-colors hover:bg-fg/10">
                  <Phone size={18} className="text-gold-hi" />
                  <span className="text-[11px] tracking-[0.2em] text-fg/45 uppercase">Call</span>
                  <span className="font-display text-sm font-semibold text-fg">{c.phone}</span>
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="sb-line glass group flex flex-col gap-3 rounded-2xl p-4 transition-colors hover:bg-fg/10">
                  <Mail size={18} className="text-gold-hi" />
                  <span className="text-[11px] tracking-[0.2em] text-fg/45 uppercase">Email</span>
                  <span className="break-all font-display text-sm font-semibold text-fg">{c.email}</span>
                </a>
              )}
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="sb-line glass group flex flex-col gap-3 rounded-2xl p-4 transition-colors hover:bg-fg/10">
                <Globe size={18} className="text-gold-hi" />
                <span className="text-[11px] tracking-[0.2em] text-fg/45 uppercase">Website</span>
                <span className="font-display text-sm font-semibold text-fg">{site}</span>
              </a>
            </div>

            <Link to={`/companies/${c.slug}`} className="sb-line btn-luxe shine w-fit">
              View company
              <span className="btn-arrow">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
