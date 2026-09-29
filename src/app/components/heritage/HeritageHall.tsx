import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Glasses, Hand, Pause, Play, Shrink } from "lucide-react";
import { gsap, useGSAP } from "@/app/lib/gsap";
import type { HeritageMuseum } from "./museum";

interface StopInfo {
  kicker: string;
  title: string;
  text: string;
}

/**
 * Interactive 3D museum of the group's history. The Three.js scene is only
 * downloaded and built when the visitor scrolls near it.
 */
export function HeritageHall() {
  const shell = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const museum = useRef<HeritageMuseum | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [stops, setStops] = useState<StopInfo[]>([]);
  const [current, setCurrent] = useState(0);
  const [touring, setTouring] = useState(false);
  const [vr, setVr] = useState({ supported: false, active: false });
  const [fullscreen, setFullscreen] = useState(false);

  // Build the scene once the section approaches the viewport
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || museum.current) return;
        io.disconnect();
        try {
          const { HeritageMuseum } = await import("./museum");
          if (cancelled) return;
          museum.current = new HeritageMuseum(el, {
            onProgress: setProgress,
            onStop: setCurrent,
            onReady: () => {
              setStops(museum.current!.stops.map(({ kicker, title, text }) => ({ kicker, title, text })));
              setReady(true);
            },
            onVRChange: (active) => setVr((v) => ({ ...v, active })),
          });
          const supported = await HeritageMuseum.vrSupported();
          if (!cancelled) setVr((v) => ({ ...v, supported }));
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      museum.current?.dispose();
      museum.current = null;
    };
  }, []);

  // Auto tour
  useEffect(() => {
    if (!touring || !ready) return;
    const id = setInterval(() => museum.current?.next(), 7000);
    return () => clearInterval(id);
  }, [touring, ready]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Fresh caption animation on every stop
  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(".hh-caption > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: "expo.out" });
    },
    { scope: shell, dependencies: [current, ready] },
  );

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else shell.current?.requestFullscreen?.();
  };

  const stop = stops[current];

  return (
    <div
      ref={shell}
      className={`relative overflow-hidden border border-[#d8b36a]/25 bg-[#0b0608] shadow-[0_60px_160px_-40px_rgba(122,16,34,0.55)] ${
        fullscreen ? "h-screen w-screen rounded-none" : "h-[78vh] min-h-[560px] rounded-[2rem] md:rounded-[2.5rem]"
      }`}
    >
      <div
        ref={stage}
        tabIndex={0}
        aria-label="3D Heritage Hall. Drag to look around, use W A S D or the arrow keys to walk."
        className="absolute inset-0 cursor-grab outline-none active:cursor-grabbing"
      />

      {/* Loading veil */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_center,#3b1420,#0b0608_70%)] transition-opacity duration-1000 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#hh-gold)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={276}
              strokeDashoffset={276 - 276 * progress}
              className="transition-[stroke-dashoffset] duration-500"
            />
            <defs>
              <linearGradient id="hh-gold">
                <stop offset="0%" stopColor="#9c7a3c" />
                <stop offset="100%" stopColor="#f3dca0" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-sm text-[#f3dca0]">{Math.round(progress * 100)}%</span>
        </div>
        <p className="font-display text-xs tracking-[0.4em] text-white/60 uppercase">
          {failed ? "3D view unavailable on this device" : "Preparing the Heritage Hall"}
        </p>
      </div>

      {ready && (
        <>
          {/* Top bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 md:p-6">
            <div className="glass pointer-events-auto flex items-center gap-3 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#d7263d]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d7263d]" />
              </span>
              <span className="font-display text-[11px] font-semibold tracking-[0.3em] text-white uppercase">Heritage Hall · 3D</span>
            </div>
            <div className="pointer-events-auto flex gap-2">
              {vr.supported && (
                <button onClick={() => museum.current?.enterVR()} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white hover:bg-white/10">
                  <Glasses size={16} className="text-[#f3dca0]" /> {vr.active ? "In VR" : "Enter VR"}
                </button>
              )}
              <button onClick={toggleFullscreen} className="glass grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10" aria-label={fullscreen ? "Exit full screen" : "Full screen"}>
                {fullscreen ? <Shrink size={16} /> : <Expand size={16} />}
              </button>
            </div>
          </div>

          {/* Caption for the current exhibit */}
          {stop && (
            <div className="pointer-events-none absolute bottom-24 left-4 z-20 max-w-[calc(100%-2rem)] md:bottom-6 md:left-6 md:max-w-md">
              <div key={current} className="hh-caption glass-strong flex flex-col gap-2 rounded-3xl p-5 md:p-6">
                <span className="font-serif-luxe text-2xl text-[#f3dca0] italic md:text-3xl">{stop.kicker}</span>
                <h3 className="font-display text-lg font-semibold leading-tight text-white md:text-xl">{stop.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{stop.text}</p>
              </div>
            </div>
          )}

          {/* Tour controls */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 md:bottom-6 md:right-6">
            <button onClick={() => museum.current?.prev()} className="glass-strong grid h-12 w-12 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Previous exhibit">
              <ChevronLeft size={20} />
            </button>
            <div className="glass-strong flex items-center gap-3 rounded-full px-4 py-3">
              <span className="font-display text-sm tabular-nums text-white">
                {String(current + 1).padStart(2, "0")}
                <span className="text-white/35"> / {String(stops.length).padStart(2, "0")}</span>
              </span>
              <button onClick={() => setTouring((t) => !t)} className="flex items-center gap-1.5 border-l border-white/15 pl-3 text-xs font-semibold tracking-wider text-[#f3dca0] uppercase" aria-label={touring ? "Pause tour" : "Play guided tour"}>
                {touring ? <Pause size={14} /> : <Play size={14} />}
                {touring ? "Pause" : "Tour"}
              </button>
            </div>
            <button onClick={() => museum.current?.next()} className="btn-luxe grid h-12 w-12 place-items-center !p-0" aria-label="Next exhibit">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* How to move */}
          <div className="pointer-events-none absolute left-1/2 top-20 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs text-white/70 backdrop-blur md:top-6 lg:flex">
            <Hand size={14} className="text-[#f3dca0]" /> Drag to look · W A S D to walk · Click a frame or case to visit it
          </div>
        </>
      )}
    </div>
  );
}
