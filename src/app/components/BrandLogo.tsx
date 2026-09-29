import { useState } from "react";

/** Full logo with white lettering, for the dark theme. */
export const HOLDINGS_LOGO_PATH = "/logos/bwh-logo-light.png";
/** Just the BW mark. */
export const HOLDINGS_MARK_PATH = "/logos/bwh-mark.png";

interface BrandLogoProps {
  height?: number;
  className?: string;
  src?: string;
}

export function BrandLogo({ height = 40, className = "", src = HOLDINGS_LOGO_PATH }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`font-display font-bold tracking-[0.2em] text-white ${className}`} style={{ fontSize: height * 0.4 }}>
        BRITISH WAY
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="British Way Holdings"
      className={`object-contain object-left ${className}`}
      style={{ height, width: "auto", maxWidth: "none" }}
      onError={() => setFailed(true)}
    />
  );
}
