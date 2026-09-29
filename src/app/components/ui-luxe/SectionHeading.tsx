import type { ReactNode } from "react";
import { SplitHeading } from "../fx/SplitHeading";
import { Reveal } from "../fx/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}

/** Eyebrow + animated heading + supporting text, used to open every section. */
export function SectionHeading({ eyebrow, title, description, align = "left", className = "", action }: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-6 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"} ${className}`}>
      <div className={`flex flex-col gap-5 ${center ? "items-center" : ""} max-w-3xl`}>
        <Reveal y={20}>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <SplitHeading className="font-display text-[clamp(2.1rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white">
          {title}
        </SplitHeading>
        {description && (
          <Reveal y={24} delay={0.15}>
            <p className={`max-w-2xl text-[1.02rem] leading-relaxed text-mist ${center ? "mx-auto" : ""}`}>{description}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal y={20} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
