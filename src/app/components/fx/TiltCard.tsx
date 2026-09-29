import { useRef, type ReactNode, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/app/lib/gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  glare?: boolean;
  onClick?: () => void;
}

/** Card that tilts in 3D toward the pointer, with a moving light glare. */
export function TiltCard({ children, className = "", style, max = 10, glare = true, onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || window.matchMedia("(hover: none)").matches) return;

      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
      gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * max * 2);
        rx((0.5 - py) * max * 2);
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(600px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.18), transparent 40%)`;
          glareRef.current.style.opacity = "1";
        }
      });
      const leave = contextSafe(() => {
        rx(0);
        ry(0);
        if (glareRef.current) glareRef.current.style.opacity = "0";
      });

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative will-change-transform ${className}`} style={style} onClick={onClick}>
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500"
          style={{ mixBlendMode: "overlay" }}
        />
      )}
    </div>
  );
}
