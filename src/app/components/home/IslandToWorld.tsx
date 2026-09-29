import { Globe2, Landmark, Sprout } from "lucide-react";
import { GlobeView } from "../globe/GlobeView";
import { SectionHeading } from "../ui-luxe/SectionHeading";
import { LotusMandala, Liyawela } from "../ui-luxe/Heritage";
import { Reveal } from "../fx/Reveal";
import { TiltCard } from "../fx/TiltCard";

const pillars = [
  {
    icon: Sprout,
    title: "Rooted in Sri Lanka",
    text: "Eight home-grown brands serving communities island-wide — from Nittambuwa and Colombo to the Galle–Matara branch.",
  },
  {
    icon: Landmark,
    title: "Heritage at heart",
    text: "Values honoured in ceremonies like Ma Piya Wandana, where more than 2,000 parents and students gathered in 2026.",
  },
  {
    icon: Globe2,
    title: "Built for the world",
    text: "UK university partnerships and international standards that prepare our students and professionals to thrive anywhere.",
  },
];

/** The group's story in one picture: Sri Lankan heritage, carried to the world. */
export function IslandToWorld() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
      <LotusMandala className="spin-slower pointer-events-none absolute -right-40 top-10 h-[640px] w-[640px]" opacity={0.08} />
      <div className="relative mx-auto max-w-7xl">
        <Liyawela className="mb-14" opacity={0.35} />
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="Powering the island · Reaching the world"
              title={
                <>
                  Sri Lankan heritage, <span className="accent">global ambition.</span>
                </>
              }
              description="We are proudly Sri Lankan. Every classroom, stage, hotel suite and cricket pitch carries the island's warmth and discipline — and we are building these brands to stand beside the best in the world."
            />
            <Reveal className="flex flex-col gap-4" stagger={0.12} y={40}>
              {pillars.map((p, i) => (
                <TiltCard key={p.title} className="rounded-3xl" max={5}>
                  <div className="glass luxe-border flex items-start gap-5 rounded-3xl p-5 md:p-6">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#f3dca0] to-[#9c7a3c] text-[#1a1204]">
                      <p.icon size={20} />
                    </span>
                    <div>
                      <p className="font-display text-xs text-[#d8b36a]">0{i + 1}</p>
                      <h3 className="font-display text-lg font-semibold text-white">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-mist">{p.text}</p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </Reveal>
          </div>
          <Reveal y={60} scale={0.9}>
            <GlobeView className="mx-auto max-w-[620px]" />
          </Reveal>
        </div>
        <Liyawela className="mt-14" opacity={0.35} />
      </div>
    </section>
  );
}
