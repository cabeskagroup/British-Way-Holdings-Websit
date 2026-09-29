import { useRef } from "react";
import { gsap, useGSAP } from "@/app/lib/gsap";

/** Soft spotlight that follows the mouse (desktop only). */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const glow = glowRef.current;
    if (!glow || !contextSafe || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(glow, { xPercent: -50, yPercent: -50 });
    const gx = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3.out" });
    const gy = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3.out" });
    let shown = false;

    const move = contextSafe((e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(glow, { x: e.clientX, y: e.clientY });
        gsap.to(glow, { opacity: 1, duration: 0.6 });
      }
      gx(e.clientX);
      gy(e.clientY);
    });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  });

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[520px] w-[520px] rounded-full opacity-0"
      style={{ background: "radial-gradient(circle, rgba(61,123,224,0.12), rgba(216,179,106,0.05) 40%, transparent 70%)" }}
    />
  );
}
