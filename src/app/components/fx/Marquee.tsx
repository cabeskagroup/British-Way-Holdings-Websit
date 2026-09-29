import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";

/** Endless horizontal ticker that leans into the direction of scroll. */
export function Marquee({
  children,
  reverse = false,
  speed = 40,
  className = "",
}: {
  children: ReactNode;
  reverse?: boolean;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3.out" });
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
        onLeave: () => skewTo(0),
        onLeaveBack: () => skewTo(0),
      });
    },
    { scope: ref },
  );

  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div ref={ref}>
        <div className={`marquee-track ${reverse ? "reverse" : ""}`} style={{ animationDuration: `${speed}s` }}>
          <div className="flex shrink-0 items-center">{children}</div>
          <div className="flex shrink-0 items-center" aria-hidden>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
