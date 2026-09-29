import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";

/** Counts from 0 up to a value like "2000+" or "40+" when scrolled into view. */
export function CountUp({ value, className = "", duration = 2.2 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !match || prefersReducedMotion()) return;
      const target = parseInt(match[2].replace(/,/g, ""), 10);
      const counter = { n: 0 };
      gsap.to(counter, {
        n: target,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top bottom", once: true },
        onUpdate: () => {
          el.textContent = `${match[1]}${Math.round(counter.n).toLocaleString("en-US")}${match[3]}`;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {match && !prefersReducedMotion() ? `${match[1]}0${match[3]}` : value}
    </span>
  );
}
