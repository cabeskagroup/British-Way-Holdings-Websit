import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";

/**
 * Moves its single child at a different speed than the page while scrolling.
 * The child is scaled up slightly so its edges never show. Keep `speed` ≤ 14.
 */
export function Parallax({ children, speed = 10, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el.firstElementChild,
        { yPercent: -speed, scale: 1.3 },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
