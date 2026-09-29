import { useEffect, useRef, useState } from "react";
import type { Globe, GlobePlace } from "./globe";

const ORIGIN: GlobePlace = { lat: 7.87, lon: 80.77, label: "Sri Lanka" };

// Where the arcs fly: the UK (university partners) and the wider world our students go on to reach.
const DESTINATIONS: GlobePlace[] = [
  { lat: 51.51, lon: -0.13, label: "London" },
  { lat: 25.2, lon: 55.27, label: "Dubai" },
  { lat: 1.35, lon: 103.82, label: "Singapore" },
  { lat: -33.87, lon: 151.21, label: "Sydney" },
  { lat: 43.65, lon: -79.38, label: "Toronto" },
  { lat: 35.68, lon: 139.69 },
  { lat: -26.2, lon: 28.05 },
  { lat: 48.86, lon: 2.35 },
];

/** Interactive dotted globe: Sri Lanka in gold with light trails flying out to the world. */
export function GlobeView({ className = "" }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const labelRefs = useRef(new Map<string, HTMLElement>());
  const globe = useRef<Globe | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || globe.current) return;
        io.disconnect();
        try {
          const { Globe } = await import("./globe");
          if (cancelled) return;
          globe.current = new Globe(el, { origin: ORIGIN, destinations: DESTINATIONS, labels: labelRefs.current });
          setReady(true);
        } catch {
          /* WebGL unavailable: the glow backdrop stays as a graceful fallback */
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      globe.current?.dispose();
      globe.current = null;
    };
  }, []);

  const labels = [ORIGIN, ...DESTINATIONS].filter((p) => p.label);

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div className="orb inset-[15%] bg-[#1b3f8f]/50" />
      <div className={`absolute inset-0 rounded-full border border-white/5 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`} />
      <div ref={stage} className="absolute inset-0" aria-label="Globe showing Sri Lanka connected to the world" role="img" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {labels.map((p) => {
          const home = p === ORIGIN;
          return (
            <div
              key={p.label}
              ref={(node) => {
                if (node) labelRefs.current.set(p.label!, node);
              }}
              className="absolute left-0 top-0 opacity-0 transition-opacity duration-300"
            >
              <span
                className={`-ml-2 -mt-9 block whitespace-nowrap rounded-full px-3 py-1 font-display text-[11px] font-semibold tracking-wider backdrop-blur ${
                  home ? "bg-[#d8b36a] text-[#1a1204] shadow-[0_0_30px_rgba(216,179,106,0.7)]" : "border border-white/15 bg-black/40 text-white/85"
                }`}
              >
                {home ? "Sri Lanka · Home" : p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
