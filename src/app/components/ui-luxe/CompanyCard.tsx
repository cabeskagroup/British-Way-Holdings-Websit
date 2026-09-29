import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import type { Company } from "@/data/companies";
import { TiltCard } from "../fx/TiltCard";
import { SmartImage } from "./SmartImage";
import { LogoChip } from "./LogoChip";

/** 3D tilting card for a group company. */
export function CompanyCard({ company: c, index }: { company: Company; index: number }) {
  return (
    <TiltCard max={7} className="h-full rounded-[1.75rem]">
      <Link
        to={`/companies/${c.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] transition-colors duration-500 hover:border-white/25"
      >
        <div className="absolute -bottom-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-50" style={{ background: c.accent }} />
        <div className="relative h-52 overflow-hidden">
          <SmartImage src={c.img} alt={c.name} from={c.color} to={c.accent} className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b17] via-[#070b17]/30 to-transparent" />
          <span className="absolute left-5 top-4 font-display text-xs font-semibold tracking-[0.3em] text-white/70">{String(index + 1).padStart(2, "0")}</span>
          <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:border-[#f3dca0] group-hover:bg-[#d8b36a] group-hover:text-[#1a1204]">
            <ArrowUpRight size={17} />
          </span>
        </div>
        <div className="relative -mt-10 flex flex-1 flex-col gap-3 px-5 pb-6" style={{ transform: "translateZ(40px)" }}>
          <LogoChip company={c} className="h-20 w-32" padding="p-2" />
          <span className="mt-1 text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: c.accent === "#b08030" ? "#e4c27e" : "#f3dca0" }}>
            {c.cat}
          </span>
          <h3 className="font-display text-lg font-semibold leading-tight text-white">{c.name}</h3>
          <p className="text-[13.5px] leading-relaxed text-white/55">{c.tagline}</p>
        </div>
      </Link>
    </TiltCard>
  );
}
