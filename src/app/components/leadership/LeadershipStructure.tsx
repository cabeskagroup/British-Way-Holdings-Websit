import { useRef } from "react";
import { leaders, type Leader } from "@/data/leaders";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { SmartImage } from "../ui-luxe/SmartImage";

const board = ["Madam Preni Rajapaksha", "Dr. Shantha Geethadewa", "Emil Hettiarachchi", "Nisal Geethadewa"];
const management = ["Ranga Ilandara", "Oshadhi Thennakoon"];
const find = (names: string[]) => names.map((n) => leaders.find((l) => l.name === n)).filter(Boolean) as Leader[];

function Node({ leader, lead }: { leader: Leader; lead?: boolean }) {
  return (
    <div className="ls-node group relative flex flex-col items-center gap-3 text-center">
      <div className={`relative rounded-full p-[3px] ${lead ? "bg-gradient-to-br from-sky via-royal to-crimson" : "bg-fg/15"}`}>
        {lead && <span className="pulse-ring absolute inset-0 rounded-full border border-gold/60" />}
        <div className={`${lead ? "h-28 w-28 md:h-32 md:w-32" : "h-24 w-24"} overflow-hidden rounded-full bg-surface`}>
          <SmartImage src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
        </div>
      </div>
      <div>
        <p className="font-display text-base font-semibold text-fg">{leader.name}</p>
        <p className="text-xs tracking-[0.15em] text-gold-hi uppercase">{leader.title}</p>
      </div>
    </div>
  );
}

/** Board and executive management, joined by lines that draw themselves on scroll. */
export function LeadershipStructure() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      tl.from(".ls-tier-label", { y: 20, opacity: 0, stagger: 0.2, duration: 0.8 })
        .from(".ls-board .ls-node", { y: 40, opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.9, ease: "back.out(1.6)" }, 0.1)
        .fromTo(".ls-line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.08, ease: "power2.inOut" }, 0.6)
        .from(".ls-mgmt .ls-node", { y: 40, opacity: 0, scale: 0.8, stagger: 0.12, duration: 0.9, ease: "back.out(1.6)" }, 1.3);
    },
    { scope: root },
  );

  const top = find(board);
  const bottom = find(management);

  return (
    <div ref={root} className="glass-strong luxe-border relative overflow-hidden rounded-[2.5rem] px-6 py-12 md:px-12 md:py-16">
      <div className="orb left-1/2 top-0 h-72 w-72 -translate-x-1/2 bg-pearl/50" />
      <p className="ls-tier-label relative text-center font-display text-xs font-semibold tracking-[0.35em] text-gold uppercase">Board of Directors</p>
      <div className="ls-board relative mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
        {top.map((l, i) => (
          <Node key={l.name} leader={l} lead={i < 2} />
        ))}
      </div>

      {/* Connectors from the board down to management */}
      <svg className="relative my-6 hidden h-28 w-full md:block" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="ls-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d3182a" />
            <stop offset="100%" stopColor="#2d5fc4" />
          </linearGradient>
        </defs>
        {[125, 375, 625, 875].map((x) => (
          <path key={x} className="ls-line" d={`M${x} 0 C ${x} 50, 500 40, 500 70`} fill="none" stroke="url(#ls-grad)" strokeWidth="1.5" pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
        ))}
        {[380, 620].map((x) => (
          <path key={x} className="ls-line" d={`M500 70 C 500 96, ${x} 74, ${x} 100`} fill="none" stroke="url(#ls-grad)" strokeWidth="1.5" pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
        ))}
        <circle cx="500" cy="70" r="4" fill="#d3182a" />
      </svg>
      <div className="relative mx-auto my-8 h-12 w-px bg-gradient-to-b from-crimson to-sky md:hidden" />

      <p className="ls-tier-label relative text-center font-display text-xs font-semibold tracking-[0.35em] text-royal uppercase">Executive Management</p>
      <div className="ls-mgmt relative mx-auto mt-8 grid max-w-xl grid-cols-2 gap-8">
        {bottom.map((l) => (
          <Node key={l.name} leader={l} />
        ))}
      </div>
    </div>
  );
}
