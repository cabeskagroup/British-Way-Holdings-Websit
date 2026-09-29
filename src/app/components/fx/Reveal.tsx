import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Animate these descendants instead of the direct children. */
  selector?: string;
  y?: number;
  x?: number;
  scale?: number;
  stagger?: number;
  delay?: number;
  start?: string;
  id?: string;
}

/** Fades and lifts its children into view as they scroll in. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  selector,
  y = 50,
  x = 0,
  scale = 1,
  stagger = 0.1,
  delay = 0,
  start = "top 85%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = selector ? el.querySelectorAll(selector) : el.children;
      if (!targets.length) return;
      gsap.from(targets, {
        y,
        x,
        scale,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1.1,
        delay,
        stagger,
        ease: "power3.out",
        clearProps: "filter",
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
