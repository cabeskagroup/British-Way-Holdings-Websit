import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUp, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { companies } from "@/data/companies";
import { gsap, useGSAP, prefersReducedMotion } from "@/app/lib/gsap";
import { BrandLogo } from "./BrandLogo";
import { LogoChip } from "./ui-luxe/LogoChip";
import { LuxeButton } from "./ui-luxe/LuxeButton";
import { Magnetic } from "./fx/Magnetic";
import { SplitHeading } from "./fx/SplitHeading";
import { scrollToTarget, useLenis } from "./fx/SmoothScroll";

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "About & Heritage", to: "/about" },
  { label: "Leadership", to: "/leadership" },
  { label: "News & Events", to: "/news" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

// Replace "#" with the real profile links when available.
const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const contact = [
  { icon: MapPin, label: "Head Office", value: "No. 123, Galle Road, Colombo 03, Sri Lanka" },
  { icon: Phone, label: "Call us", value: "+94 11 234 5678", href: "tel:+94112345678" },
  { icon: Mail, label: "Write to us", value: "info@britishwayholdings.lk", href: "mailto:info@britishwayholdings.lk" },
];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".ft-card", {
        y: 80,
        rotationX: -25,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: "50% 100%",
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ft-grid", start: "top 88%", once: true },
      });
      gsap.from(".ft-letter", {
        yPercent: 100,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ft-word", start: "top bottom", end: "bottom 95%", scrub: 1 },
      });
      gsap.to(".ft-orb", { xPercent: 30, yPercent: -20, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-white/5 bg-[#03050b]">
      <div className="ft-orb orb left-1/4 top-10 h-[420px] w-[420px] bg-[#1b3f8f]/40" />
      <div className="ft-orb orb right-0 top-1/3 h-[320px] w-[320px] bg-[#d7263d]/15" />
      <div className="grid-lines absolute inset-0 opacity-40" />

      {/* Closing call to action */}
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow">Let's talk</span>
            <SplitHeading className="mt-6 font-display text-[clamp(2.4rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
              Ready to build what's <span className="accent">next</span> — together?
            </SplitHeading>
          </div>
          <LuxeButton to="/contact">Start a conversation</LuxeButton>
        </div>
      </div>

      {/* Container cards */}
      <div className="ft-grid relative mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-12">
        <div className="ft-card glass luxe-border relative flex flex-col justify-between gap-8 overflow-hidden rounded-[2rem] p-8 lg:col-span-4">
          <div className="orb -right-16 -top-16 h-48 w-48 bg-[#3d7be0]/40" />
          <div className="relative">
            <BrandLogo height={36} />
            <p className="mt-6 text-sm leading-relaxed text-mist">
              A diversified Sri Lankan group uniting education, hospitality, media, sports and entertainment — driven by one promise:
              excellence in everything we touch.
            </p>
          </div>
          <div className="relative flex gap-3">
            {socials.map((s) => (
              <Magnetic key={s.label} strength={0.5}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#f3dca0]/60 hover:bg-[#d8b36a] hover:text-[#1a1204]"
                >
                  <s.icon size={17} />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div className="ft-card glass luxe-border rounded-[2rem] p-8 lg:col-span-2">
          <h4 className="font-display text-xs font-semibold tracking-[0.3em] text-[#d8b36a] uppercase">Explore</h4>
          <ul className="mt-6 flex flex-col gap-3">
            {exploreLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="group flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                  <span className="h-px w-0 bg-[#d8b36a] transition-all duration-300 group-hover:w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft-card glass luxe-border rounded-[2rem] p-8 lg:col-span-3">
          <h4 className="font-display text-xs font-semibold tracking-[0.3em] text-[#d8b36a] uppercase">Our Companies</h4>
          <div className="mt-6 grid grid-cols-4 gap-2.5">
            {companies.map((c) => (
              <Link key={c.slug} to={`/companies/${c.slug}`} aria-label={c.name} title={c.name} className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
                <LogoChip company={c} className="aspect-square w-full" padding="p-1.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="ft-card glass luxe-border flex flex-col gap-5 rounded-[2rem] p-8 md:col-span-2 lg:col-span-3">
          <h4 className="font-display text-xs font-semibold tracking-[0.3em] text-[#d8b36a] uppercase">Get in touch</h4>
          {contact.map((c) => {
            const body = (
              <>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-[#f3dca0]">
                  <c.icon size={16} />
                </span>
                <span>
                  <span className="block text-[11px] tracking-wider text-white/40 uppercase">{c.label}</span>
                  <span className="text-sm text-white/80">{c.value}</span>
                </span>
              </>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="flex items-start gap-3 transition-opacity hover:opacity-80">
                {body}
              </a>
            ) : (
              <div key={c.label} className="flex items-start gap-3">
                {body}
              </div>
            );
          })}
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="ft-word relative mx-auto mt-16 max-w-[1600px] overflow-hidden px-4" aria-hidden>
        <div className="flex justify-center whitespace-nowrap font-display text-[16.5vw] font-extrabold leading-[0.8] tracking-[-0.06em]">
          {"BRITISH WAY".split("").map((ch, i) => (
            <span
              key={i}
              className="ft-letter inline-block bg-gradient-to-b from-white/25 via-white/[0.07] to-transparent bg-clip-text text-transparent"
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/40 md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} British Way Holdings (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Crafted with excellence in Sri Lanka</span>
            <button
              onClick={() => scrollToTarget(lenis, 0)}
              className="group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/70 transition-colors hover:border-[#d8b36a]/60 hover:text-white"
            >
              Back to top
              <ArrowUp size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
