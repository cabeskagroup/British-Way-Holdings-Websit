import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { companies } from "@/data/companies";
import { sectors } from "@/data/sectors";
import { gsap, ScrollTrigger, useGSAP } from "@/app/lib/gsap";
import { BrandLogo, HOLDINGS_COLOR_PATH } from "./BrandLogo";
import { LogoChip } from "./ui-luxe/LogoChip";
import { Magnetic } from "./fx/Magnetic";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "The Group", to: "/about#companies", mega: true },
  { label: "Leadership", to: "/leadership" },
  { label: "News", to: "/news" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Always-visible bar that tightens slightly once the page is scrolled
  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.from(bar, { yPercent: -120, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.2 });
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => setScrolled(self.scroll() > 40) });
  });

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.hash]);

  // Full-screen mobile menu entrance
  useGSAP(
    () => {
      if (!menuOpen || !overlayRef.current) return;
      gsap.fromTo(overlayRef.current, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.9, ease: "expo.inOut" });
      gsap.from(".mm-item", { yPercent: 120, opacity: 0, stagger: 0.06, duration: 0.9, delay: 0.3, ease: "expo.out" });
    },
    { dependencies: [menuOpen], scope: overlayRef },
  );

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header ref={barRef} className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 md:px-6">
        <nav
          className={`nav-pill mx-auto flex max-w-7xl items-center justify-between rounded-full pl-5 pr-2.5 transition-all duration-500 md:pl-7 ${
            scrolled ? "py-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)]" : "py-2.5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]"
          }`}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <Link to="/" aria-label="British Way Holdings home" className="relative z-10 shrink-0">
            <BrandLogo height={34} src={HOLDINGS_COLOR_PATH} className="md:!h-[40px]" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              link.mega ? (
                <li key={link.label} onMouseEnter={() => setMegaOpen(true)}>
                  <Link
                    to={link.to}
                    className={`group flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-[13px] font-medium transition-colors ${
                      megaOpen ? "bg-[#0c1326] text-white" : "text-[#1b2540] hover:bg-[#0c1326]/5"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={13} className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                  </Link>
                </li>
              ) : (
                <li key={link.label} onMouseEnter={() => setMegaOpen(false)}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `relative rounded-full px-4 py-2 font-display text-[13px] font-medium transition-colors ${
                        isActive ? "bg-[#0c1326] text-white" : "text-[#1b2540] hover:bg-[#0c1326]/5"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Magnetic strength={0.3}>
                <Link to="/contact" className="btn-luxe shine !px-5 !py-2.5 !text-[13px]">
                  Get in touch
                  <ArrowUpRight size={15} />
                </Link>
              </Magnetic>
            </div>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-[#0c1326] text-white lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mega menu */}
        <div
          className={`absolute inset-x-0 top-full mx-auto hidden max-w-7xl px-4 pt-3 transition-all duration-500 md:px-6 lg:block ${
            megaOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
          }`}
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="nav-pill grid grid-cols-[1.1fr_2.4fr] gap-6 rounded-[2rem] p-5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b3f8f] via-[#0c1326] to-[#04060d] p-7">
              <div className="orb -right-10 -top-10 h-40 w-40 bg-[#d8b36a]/40" />
              <div className="relative">
                <span className="eyebrow">The Group</span>
                <p className="mt-4 font-display text-2xl font-semibold leading-tight text-white">
                  Eight brands. <span className="accent">One legacy.</span>
                </p>
                <ul className="mt-5 flex flex-col gap-2">
                  {sectors.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 text-sm text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                      {s.title}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/about#companies" className="relative mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-[#f3dca0]">
                Explore all companies <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {companies.map((c) => (
                <Link
                  key={c.slug}
                  to={`/companies/${c.slug}`}
                  className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[#0c1326]/5 bg-[#f3f5fa] p-3 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(12,19,38,0.45)]"
                >
                  <div className="absolute inset-x-0 -bottom-10 h-20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" style={{ background: c.accent }} />
                  <LogoChip company={c} className="h-16 w-full" padding="p-2" />
                  <div className="relative">
                    <p className="font-display text-[12.5px] font-semibold leading-snug text-[#0c1326]">{c.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#0c1326]/50">{c.cat}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu (sits just under the header so the close button stays on top) */}
      {menuOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-[99] overflow-y-auto bg-[#04060d] lg:hidden" data-lenis-prevent>
          <div className="orb -left-20 top-20 h-72 w-72 bg-[#3d7be0]/40" />
          <div className="orb -right-20 bottom-10 h-72 w-72 bg-[#d7263d]/25" />
          <div className="relative flex min-h-full flex-col px-6 pb-10 pt-28">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <li key={link.label} className="overflow-hidden">
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `mm-item flex items-baseline gap-4 py-2 font-display text-[2.4rem] font-semibold tracking-tight ${isActive && !link.mega ? "text-[#f3dca0]" : "text-white"}`
                    }
                  >
                    <span className="font-display text-xs text-white/30">0{i + 1}</span>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mm-item mt-10">
              <span className="eyebrow">Our Companies</span>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {companies.map((c) => (
                  <Link key={c.slug} to={`/companies/${c.slug}`} aria-label={c.name}>
                    <LogoChip company={c} className="aspect-square w-full" padding="p-1.5" />
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact" className="mm-item btn-luxe mt-10 justify-center">
              Get in touch <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
