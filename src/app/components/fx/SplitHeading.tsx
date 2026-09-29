import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { onIntroDone } from "./intro";

interface SplitHeadingProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "scroll" animates when scrolled into view, "intro" right after the preloader. */
  trigger?: "scroll" | "intro";
  delay?: number;
  stagger?: number;
}

/**
 * Heading whose words rise out of masked lines. Wrap accent words in
 * <span className="accent">…</span> to render them in gold serif italics.
 */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className = "",
  trigger = "scroll",
  delay = 0,
  stagger = 0.06,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.style.visibility = "visible";
        return;
      }

      let cancelIntro = () => {};
      const split = SplitText.create(el, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          // Gradient text can't cross the word wrappers, so paint each accent word itself.
          self.words.forEach((w) => {
            if ((w as HTMLElement).closest(".accent")) w.classList.add("gold-text");
          });
          el.style.visibility = "visible";
          const tween = gsap.from(self.words, {
            yPercent: 110,
            rotate: 4,
            opacity: 0,
            duration: 1.2,
            stagger,
            delay,
            ease: "expo.out",
            paused: trigger === "intro",
            scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
          });
          if (trigger === "intro") cancelIntro = onIntroDone(() => tween.play());
          return tween;
        },
      });

      return () => {
        cancelIntro();
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`will-reveal ${className}`}>
      {children}
    </Tag>
  );
}
