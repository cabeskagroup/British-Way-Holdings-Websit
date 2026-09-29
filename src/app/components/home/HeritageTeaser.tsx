import { useRef } from "react";
import { Box, Glasses, Trophy } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { LuxeButton } from "../ui-luxe/LuxeButton";
import { SplitHeading } from "../fx/SplitHeading";
import { Reveal } from "../fx/Reveal";

const frames = [
  { src: "/logos/opt/glry11.jpg", x: -34, r: 28 },
  { src: "/logos/opt/aboutus.jpg", x: 0, r: 0 },
  { src: "/logos/opt/glry03.jpg", x: 34, r: -28 },
];

/** Invitation into the 3D Heritage Hall, with a gallery wall that swings into perspective. */
export function HeritageTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".ht-frame", {
        rotationY: (i) => [60, 0, -60][i],
        z: -400,
        opacity: 0,
        stagger: 0.12,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ht-stage", start: "top 80%", once: true },
      });
      gsap.to(".ht-stage-inner", {
        rotationX: 8,
        rotationY: -8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative px-4 py-24 md:px-10 md:py-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#d8b36a]/20 bg-[radial-gradient(ellipse_at_top,#3b1420_0%,#12070c_45%,#050308_100%)]">
        {/* Museum ambience: wainscot stripes, spotlights, carpet glow */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[repeating-linear-gradient(90deg,rgba(216,179,106,0.06)_0_2px,transparent_2px_120px)]" />
        <div className="absolute inset-x-0 bottom-1/3 h-px bg-gradient-to-r from-transparent via-[#d8b36a]/50 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[70%] w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,228,170,0.22),transparent_70%)]" />
        <div className="absolute -bottom-20 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full bg-[#8a1020]/60 blur-3xl" />

        <div className="relative grid items-center gap-12 p-8 md:p-14 lg:grid-cols-[1fr_1.1fr] lg:p-20">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">The Heritage Hall</span>
            <SplitHeading className="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1] tracking-[-0.035em] text-white">
              Step inside our <span className="accent">story</span> in 3D.
            </SplitHeading>
            <Reveal y={24} stagger={0.1} className="flex flex-col gap-6">
              <p className="max-w-lg text-mist">
                Walk a virtual museum of our journey: historic moments framed in gold, awards displayed in glass, and every milestone lit like a gallery
                masterpiece. Works on desktop, mobile and VR headsets.
              </p>
              <ul className="flex flex-wrap gap-3">
                {[
                  { icon: Box, label: "Interactive 3D" },
                  { icon: Trophy, label: "Awards gallery" },
                  { icon: Glasses, label: "VR ready" },
                ].map((f) => (
                  <li key={f.label} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-white/80">
                    <f.icon size={15} className="text-[#f3dca0]" />
                    {f.label}
                  </li>
                ))}
              </ul>
              <div>
                <LuxeButton to="/about#heritage">Enter the Heritage Hall</LuxeButton>
              </div>
            </Reveal>
          </div>

          <div className="ht-stage relative h-[340px] md:h-[420px]" style={{ perspective: "1400px" }}>
            <div className="ht-stage-inner relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
              {frames.map((f, i) => (
                <div
                  key={f.src}
                  className="absolute left-1/2 top-1/2 w-[44%]"
                  style={{
                    transform: `translate(-50%,-50%) translateX(${f.x * 2.4}%) translateZ(${i === 1 ? 60 : -40}px) rotateY(${f.r}deg)`,
                    transformStyle: "preserve-3d",
                    zIndex: i === 1 ? 2 : 1,
                  }}
                >
                  <div className="ht-frame">
                    <div className="rounded-sm bg-gradient-to-br from-[#f3dca0] via-[#9c7a3c] to-[#d8b36a] p-[7px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
                      <div className="bg-[#1a0f08] p-2">
                        <img src={f.src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" style={{ filter: i === 1 ? "none" : "sepia(0.35) saturate(0.9)" }} />
                      </div>
                    </div>
                    <div className="mx-auto mt-3 h-2 w-1/3 rounded-sm bg-gradient-to-r from-[#9c7a3c] via-[#f3dca0] to-[#9c7a3c] opacity-80" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
