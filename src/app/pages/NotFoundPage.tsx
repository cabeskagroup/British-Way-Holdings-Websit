import { useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";

export function NotFoundPage() {
  const navigate = useNavigate();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !contextSafe) return;
      gsap.from(".nf-digit", { yPercent: 120, rotationX: -90, opacity: 0, stagger: 0.12, duration: 1.4, ease: "expo.out", transformPerspective: 800 });
      gsap.from(".nf-fade", { y: 30, opacity: 0, stagger: 0.1, delay: 0.5, duration: 1, ease: "expo.out" });
      const rx = gsap.quickTo(".nf-digits", "rotationY", { duration: 1, ease: "power3.out" });
      const ry = gsap.quickTo(".nf-digits", "rotationX", { duration: 1, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        rx((e.clientX / window.innerWidth - 0.5) * 30);
        ry((0.5 - e.clientY / window.innerHeight) * 20);
      });
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-32">
      <div className="grid-lines absolute inset-0" />
      <div className="orb left-1/4 top-1/4 h-[420px] w-[420px] bg-pearl/70" />
      <div className="orb bottom-1/4 right-1/4 h-[320px] w-[320px] bg-pearl/60" />
      <div className="relative flex flex-col items-center text-center" style={{ perspective: 900 }}>
        <div className="nf-digits flex gap-2 font-display text-[clamp(7rem,26vw,18rem)] font-extrabold leading-none tracking-[-0.06em]" style={{ transformStyle: "preserve-3d" }}>
          {["4", "0", "4"].map((d, i) => (
            <span key={i} className={`nf-digit inline-block ${i === 1 ? "gold-text font-serif-luxe italic" : "text-fg"}`} style={{ textShadow: i === 1 ? "none" : "0 30px 80px rgba(42,86,184,0.18)" }}>
              {d}
            </span>
          ))}
        </div>
        <h1 className="nf-fade mt-4 font-display text-3xl font-semibold text-fg md:text-4xl">This page has wandered off.</h1>
        <p className="nf-fade mt-4 max-w-md text-mist">The page you're looking for doesn't exist or may have been moved. Head home or explore our group companies.</p>
        <div className="nf-fade mt-10 flex flex-wrap justify-center gap-4">
          <LuxeButton to="/">Back to home</LuxeButton>
          <button onClick={() => navigate(-1)} className="btn-ghost">
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    </section>
  );
}
