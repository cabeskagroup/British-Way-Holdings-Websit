import { useRef } from "react";
import { gsap, useGSAP } from "@/app/lib/gsap";

/** Soft spotlight and trailing ring that follow the mouse (desktop only). */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const glow = glowRef.current;
    const ring = ringRef.current;
    if (!glow || !ring || !contextSafe || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set([glow, ring], { xPercent: -50, yPercent: -50 });
    let shown = false;
    const gx = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3.out" });
    const gy = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const move = contextSafe((e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([glow, ring], { x: e.clientX, y: e.clientY });
        gsap.to([glow, ring], { opacity: 1, duration: 0.6 });
      }
      gx(e.clientX);
      gy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const interactive = (e.target as HTMLElement).closest("a, button, [role='button'], input, textarea, select");
      gsap.to(ring, { scale: interactive ? 1.8 : 1, borderColor: interactive ? "rgba(243,220,160,0.9)" : "rgba(243,220,160,0.45)", duration: 0.3, overwrite: "auto" });
    });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  });

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[520px] w-[520px] rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(61,123,224,0.12), rgba(216,179,106,0.05) 40%, transparent 70%)" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-8 w-8 rounded-full border opacity-0"
        style={{ borderColor: "rgba(243,220,160,0.45)" }}
      />
    </>
  );
}
