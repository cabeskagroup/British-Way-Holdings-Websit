import { useState } from "react";
import { getCompanyLogoPath, type Company } from "@/data/companies";

interface LogoChipProps {
  company: Pick<Company, "slug" | "short" | "color" | "accent">;
  className?: string;
  /** "round" medallion or "tile" rectangle. */
  shape?: "round" | "tile";
  padding?: string;
}

/** Company logo presented on a porcelain-white medallion so it reads on the dark theme. */
export function LogoChip({ company, className = "", shape = "tile", padding = "p-3" }: LogoChipProps) {
  // Trimmed logo first, then the original file, then the initials badge.
  const sources = [`/logos/chips/${company.slug}.png`, getCompanyLogoPath(company.slug)];
  const [attempt, setAttempt] = useState(0);
  const radius = shape === "round" ? "rounded-full" : "rounded-2xl";

  if (attempt >= sources.length) {
    return (
      <div
        className={`${radius} grid place-items-center font-display font-bold text-white ${className}`}
        style={{ background: `linear-gradient(135deg, ${company.color}, ${company.accent})` }}
      >
        <span className="text-[0.8em] tracking-wider">{company.short}</span>
      </div>
    );
  }

  return (
    <div className={`logo-chip ${radius} flex items-center justify-center overflow-hidden ${padding} ${className}`}>
      <img
        src={sources[attempt]}
        alt={`${company.short} logo`}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        loading="lazy"
        onError={() => setAttempt((a) => a + 1)}
      />
    </div>
  );
}
