import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/app/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/** Buttery inertial scrolling, kept in sync with GSAP ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Scroll to the top (or an element) in a way that works with and without Lenis. */
export function scrollToTarget(lenis: Lenis | null, target: number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, offset: typeof target === "number" ? 0 : -90, duration: 1.4 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}
