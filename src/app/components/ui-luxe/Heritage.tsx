// Ornaments drawn from Sri Lankan heritage art: the lotus ("nelum") mandala seen on
// Kandyan temple ceilings and moonstones, and the "liyawela" scrolling vine border.

interface OrnamentProps {
  className?: string;
  opacity?: number;
}

function petalRing(count: number, outer: number, inner: number, width: number, rotate = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = (360 / count) * i + rotate;
    return (
      <path
        key={i}
        d={`M0,${-outer} C${width},${-outer * 0.62} ${width},${-inner} 0,${-inner} C${-width},${-inner} ${-width},${-outer * 0.62} 0,${-outer}`}
        transform={`rotate(${a})`}
      />
    );
  });
}

/** Layered lotus mandala in hairline gold. */
export function LotusMandala({ className = "", opacity = 1 }: OrnamentProps) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={{ opacity }} aria-hidden>
      <defs>
        <linearGradient id="lotus-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3dca0" />
          <stop offset="55%" stopColor="#d8b36a" />
          <stop offset="100%" stopColor="#9c7a3c" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#lotus-gold)" strokeWidth="0.6">
        <circle r="97" />
        <circle r="92" strokeDasharray="1.5 3" />
        {petalRing(24, 90, 68, 9)}
        {petalRing(16, 66, 44, 11, 11.25)}
        {petalRing(12, 42, 20, 9)}
        <circle r="18" />
        {petalRing(8, 16, 5, 4, 22.5)}
        <circle r="3.5" fill="url(#lotus-gold)" />
        {Array.from({ length: 48 }, (_, i) => (
          <circle key={i} r="0.9" cx={Math.cos((i / 48) * Math.PI * 2) * 94.5} cy={Math.sin((i / 48) * Math.PI * 2) * 94.5} fill="url(#lotus-gold)" stroke="none" />
        ))}
      </g>
    </svg>
  );
}

/** Horizontal liyawela vine used as a section divider. */
export function Liyawela({ className = "", opacity = 1 }: OrnamentProps) {
  return (
    <svg className={className} style={{ opacity }} height="28" width="100%" aria-hidden>
      <defs>
        <pattern id="liyawela" width="96" height="28" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#d8b36a" strokeWidth="1" strokeLinecap="round">
            <path d="M0 14 C 16 2, 32 2, 48 14 S 80 26, 96 14" />
            <path d="M24 7 c 4 -6 12 -4 10 2 c -1 4 -6 3 -5 0" />
            <path d="M72 21 c -4 6 -12 4 -10 -2 c 1 -4 6 -3 5 0" />
            <path d="M44 12 q 6 -9 12 -3" />
            <path d="M92 16 q -6 9 -12 3" />
          </g>
          <circle cx="48" cy="14" r="1.6" fill="#f3dca0" />
        </pattern>
      </defs>
      <rect width="100%" height="28" fill="url(#liyawela)" />
    </svg>
  );
}
