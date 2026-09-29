import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { markIntroDone } from "./intro";

const SEEN_KEY = "bwh-intro-seen";

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** First-visit intro: the BW mark lights up, a counter runs, then the curtain lifts. */
export function Preloader() {
  const [visible, setVisible] = useState(() => !alreadySeen() && !prefersReducedMotion());
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!visible) {
        markIntroDone();
        return;
      }
      const counter = { n: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {
            /* private mode: intro will simply show again next visit */
          }
          setVisible(false);
        },
      });
      tl.from(".pl-mark", { scale: 0.6, opacity: 0, filter: "blur(20px)", duration: 1.1, ease: "expo.out" })
        .from(".pl-word", { yPercent: 120, opacity: 0, stagger: 0.08, duration: 0.8, ease: "expo.out" }, "-=0.6")
        .to(counter, {
          n: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(counter.n)).padStart(3, "0");
          },
        }, 0.2)
        .to(".pl-bar", { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.2)
        .to(".pl-content", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, "+=0.15")
        .add(() => markIntroDone(), "-=0.1")
        .to(".pl-panel", { yPercent: -100, duration: 1, stagger: 0.08, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: root, dependencies: [] },
  );

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[200]" aria-hidden>
      <div className="pl-panel absolute inset-0 bg-[#050811]" />
      <div className="pl-panel absolute inset-0 bg-[#070b17]" style={{ clipPath: "inset(0 0 0 50%)" }} />
      <div className="pl-content absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="orb -inset-10 bg-[#3d7be0]/30" />
          <img src="/logos/bwh-mark.png" alt="" className="pl-mark relative h-24 w-auto md:h-28" />
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-3 font-display text-sm tracking-[0.5em] text-white/80 md:text-base">
            {["BRITISH", "WAY", "HOLDINGS"].map((w) => (
              <span key={w} className="pl-word inline-block">
                {w}
              </span>
            ))}
          </div>
        </div>
        <div className="flex w-56 flex-col items-center gap-3">
          <div className="h-px w-full overflow-hidden bg-white/10">
            <div className="pl-bar h-full origin-left scale-x-0 bg-gradient-to-r from-[#9c7a3c] via-[#f3dca0] to-[#d8b36a]" />
          </div>
          <span ref={countRef} className="font-display text-xs tracking-[0.4em] text-[#d8b36a]">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
