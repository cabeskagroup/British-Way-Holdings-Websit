import { Outlet, useLocation } from "react-router";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SmoothScroll, scrollToTarget, useLenis } from "./components/fx/SmoothScroll";
import { Preloader } from "./components/fx/Preloader";
import { CursorGlow } from "./components/fx/CursorGlow";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./lib/gsap";

/** Resets scroll and plays a curtain wipe whenever the route changes. */
function RouteTransitions() {
  const location = useLocation();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    scrollToTarget(lenis, 0, true);
    if (first.current) {
      first.current = false;
      return;
    }
    if (!curtain.current || prefersReducedMotion()) return;
    gsap.fromTo(
      curtain.current,
      { yPercent: 0, autoAlpha: 1 },
      { yPercent: -100, duration: 1, ease: "expo.inOut", delay: 0.1, onComplete: () => gsap.set(curtain.current, { autoAlpha: 0 }) },
    );
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
    if (!location.hash) return () => clearTimeout(refresh);
    const toHash = setTimeout(() => {
      const el = document.getElementById(location.hash.slice(1));
      if (el) scrollToTarget(lenis, el);
    }, 700);
    return () => {
      clearTimeout(refresh);
      clearTimeout(toHash);
    };
  }, [location.pathname, location.hash, lenis]);

  return (
    <div ref={curtain} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[150] flex items-center justify-center bg-[#070b17]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d8b36a] to-transparent" />
      <img src="/logos/bwh-mark.png" alt="" className="h-14 w-auto opacity-80" />
    </div>
  );
}

export function Root() {
  const location = useLocation();

  return (
    <SmoothScroll>
      <div className="grain relative min-h-screen font-body text-snow">
        <Preloader />
        <CursorGlow />
        <RouteTransitions />
        <Navbar />
        <main key={location.pathname} className="relative z-[2]">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
