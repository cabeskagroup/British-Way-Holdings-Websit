import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "../fx/Magnetic";

interface LuxeButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "gold" | "ghost";
  type?: "button" | "submit";
  className?: string;
  arrow?: boolean;
  disabled?: boolean;
}

/** Pill button with a magnetic hover. Gold for the main action, ghost for secondary ones. */
export function LuxeButton({ children, to, href, onClick, variant = "gold", type = "button", className = "", arrow = true, disabled }: LuxeButtonProps) {
  const cls = `${variant === "gold" ? "btn-luxe" : "btn-ghost"} shine ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="btn-arrow">
          <ArrowRight size={15} />
        </span>
      )}
    </>
  );

  let el;
  if (to) {
    el = (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  } else if (href) {
    el = (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  } else {
    el = (
      <button type={type} onClick={onClick} className={`${cls} disabled:opacity-60`} disabled={disabled}>
        {inner}
      </button>
    );
  }

  return <Magnetic strength={0.25}>{el}</Magnetic>;
}
