import { useState, type CSSProperties } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Tried if `src` fails, before falling back to the gradient. */
  fallbackSrc?: string;
  /** Colours for the placeholder shown if the image can't load. */
  from?: string;
  to?: string;
  eager?: boolean;
}

/** Image that fades in when loaded and falls back to a brand gradient instead of a broken icon. */
export function SmartImage({ src: primary, alt, className = "", style, fallbackSrc, from = "#131c36", to = "#1b3f8f", eager }: SmartImageProps) {
  const [src, setSrc] = useState(primary || fallbackSrc || "");
  const [state, setState] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  if (state === "error") {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{ ...style, background: `radial-gradient(circle at 30% 20%, ${to}, ${from} 70%)` }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`${className} transition-opacity duration-700 ${state === "loaded" ? "opacity-100" : "opacity-0"}`}
      style={style}
      onLoad={() => setState("loaded")}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) setSrc(fallbackSrc);
        else setState("error");
      }}
    />
  );
}
