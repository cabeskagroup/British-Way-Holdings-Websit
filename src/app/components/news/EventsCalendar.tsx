import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { newsItems, newsWhen, type NewsItem } from "@/data/news";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { SmartImage } from "../ui-luxe/SmartImage";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const categoryColors: Record<string, string> = {
  Milestone: "#1f3f91",
  Community: "#d3182a",
  Achievement: "#2f8f5b",
  Event: "#7a4fc7",
  Programme: "#3f8ad8",
  Corporate: "#1f8aa3",
};

const dated = newsItems.filter((n) => n.date).sort((a, b) => (a.date! < b.date! ? 1 : -1));

function parse(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m: m - 1, d };
}

/** Month calendar of dated events with an agenda for the selected month. */
export function EventsCalendar({ onOpen }: { onOpen?: (n: NewsItem) => void }) {
  const latest = dated[0] ? parse(dated[0].date!) : { y: new Date().getFullYear(), m: new Date().getMonth(), d: 1 };
  const [view, setView] = useState({ y: latest.y, m: latest.m });
  const [selected, setSelected] = useState<number | null>(dated[0] ? latest.d : null);
  const root = useRef<HTMLDivElement>(null);

  const monthEvents = useMemo(
    () =>
      dated
        .filter((n) => {
          const p = parse(n.date!);
          return p.y === view.y && p.m === view.m;
        })
        .sort((a, b) => (a.date! < b.date! ? -1 : 1)),
    [view],
  );
  const byDay = useMemo(() => {
    const map = new Map<number, NewsItem[]>();
    monthEvents.forEach((n) => {
      const d = parse(n.date!).d;
      map.set(d, [...(map.get(d) ?? []), n]);
    });
    return map;
  }, [monthEvents]);

  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((lead + days) / 7) * 7 }, (_, i) => {
    const day = i - lead + 1;
    return day >= 1 && day <= days ? day : null;
  });

  const shift = (delta: number) => {
    setSelected(null);
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const jumpToNearest = () => {
    if (!dated.length) return;
    const p = parse(dated[0].date!);
    setView({ y: p.y, m: p.m });
    setSelected(p.d);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".cal-day", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, stagger: { each: 0.012, from: "start" }, duration: 0.6, ease: "back.out(2)" });
      gsap.fromTo(".agenda-item", { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "expo.out" });
    },
    { scope: root, dependencies: [view.y, view.m] },
  );

  return (
    <div ref={root} className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
      {/* Calendar */}
      <div className="glass-strong luxe-border relative overflow-hidden rounded-[2rem] p-5 md:p-8">
        <div className="orb -right-20 -top-20 h-56 w-56 bg-pearl/70" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="eyebrow">Events calendar</p>
            <p className="mt-3 font-display text-3xl font-semibold text-fg md:text-4xl">
              {MONTHS[view.m]} <span className="accent">{view.y}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => shift(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-fg/15 text-fg hover:bg-fg/10" aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => shift(1)} className="grid h-11 w-11 place-items-center rounded-full border border-fg/15 text-fg hover:bg-fg/10" aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-7 gap-1.5 md:gap-2">
          {WEEKDAYS.map((w) => (
            <span key={w} className="pb-2 text-center font-display text-[10px] font-semibold tracking-[0.2em] text-fg/40 uppercase md:text-[11px]">
              {w}
            </span>
          ))}
          {cells.map((day, i) => {
            const events = day ? byDay.get(day) : undefined;
            const isSel = day !== null && day === selected;
            return (
              <button
                key={i}
                disabled={!day}
                onClick={() => day && setSelected(day)}
                className={`cal-day group relative aspect-square rounded-xl text-sm transition-all duration-300 md:rounded-2xl ${
                  !day
                    ? "invisible"
                    : events
                      ? isSel
                        ? "bg-royal font-semibold text-white shadow-[0_10px_24px_-10px_rgba(31,63,145,0.7)]"
                        : "border border-gold/60 bg-sky/10 font-semibold text-gold-hi hover:bg-sky/20"
                      : isSel
                        ? "bg-fg/15 text-fg"
                        : "text-fg/55 hover:bg-fg/5 hover:text-fg"
                }`}
                aria-label={day ? `${day} ${MONTHS[view.m]}${events ? `: ${events.map((e) => e.title).join(", ")}` : ""}` : undefined}
              >
                <span className="absolute left-2 top-1.5 font-display md:left-2.5 md:top-2">{day}</span>
                {events && (
                  <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1 md:bottom-2">
                    {events.map((e) => (
                      <span key={e.id} className="h-1.5 w-1.5 rounded-full" style={{ background: isSel ? "#1a1204" : categoryColors[e.category] }} />
                    ))}
                  </span>
                )}
                {events && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 rounded-xl bg-surface p-2.5 text-left text-[11px] leading-snug text-fg shadow-xl group-hover:block">
                    {events[0].title}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3 border-t border-fg/10 pt-5">
          {Object.entries(categoryColors).map(([c, color]) => (
            <span key={c} className="flex items-center gap-1.5 text-[11px] text-fg/55">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-1">
          <CalendarDays size={18} className="text-gold" />
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-fg/70 uppercase">
            Agenda · {MONTHS[view.m]} {view.y}
          </p>
        </div>
        {monthEvents.length ? (
          monthEvents.map((n) => {
            const p = parse(n.date!);
            const active = selected === p.d;
            return (
              <button
                key={n.id}
                onClick={() => {
                  setSelected(p.d);
                  onOpen?.(n);
                }}
                className={`agenda-item group flex gap-4 overflow-hidden rounded-[1.75rem] border p-3 text-left transition-all duration-500 md:gap-5 ${
                  active ? "border-gold/70 bg-sky/10 shadow-[0_20px_60px_-30px_rgba(45,95,196,0.45)]" : "border-fg/10 bg-surface/60 hover:border-fg/25"
                }`}
              >
                <div className="relative w-28 shrink-0 overflow-hidden rounded-2xl md:w-36">
                  <SmartImage src={n.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-display text-3xl font-semibold leading-none">{p.d}</p>
                    <p className="text-[10px] tracking-[0.25em] uppercase">{MONTHS[p.m].slice(0, 3)}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2 py-1 pr-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: categoryColors[n.category] }}>
                    {n.category}
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-fg md:text-lg">{n.title}</h3>
                  <div className="flex flex-col gap-1 text-xs text-fg/55">
                    {n.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gold" /> {n.time}
                      </span>
                    )}
                    {n.place && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gold" /> {n.place}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="agenda-item glass flex flex-col items-start gap-4 rounded-[1.75rem] p-7">
            <p className="font-display text-lg text-fg">No dated events this month.</p>
            <button onClick={jumpToNearest} className="btn-ghost !py-2.5">
              Jump to latest events
            </button>
          </div>
        )}

        <div className="glass mt-2 rounded-[1.75rem] p-6">
          <p className="font-display text-xs font-semibold tracking-[0.25em] text-gold uppercase">Also this year</p>
          <ul className="mt-4 flex flex-col gap-3">
            {newsItems
              .filter((n) => !n.date && n.year)
              .map((n) => (
                <li key={n.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: categoryColors[n.category] }} />
                  <button onClick={() => onOpen?.(n)} className="text-left text-fg/75 transition-colors hover:text-fg">
                    {n.title} <span className="text-fg/35">· {newsWhen(n)}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
