import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Clock, Globe, Mail, MapPin, Phone, Send } from "lucide-react";
import { companies } from "@/data/companies";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { LogoChip } from "../components/ui-luxe/LogoChip";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { Reveal } from "../components/fx/Reveal";
import { TiltCard } from "../components/fx/TiltCard";

const GROUP_EMAIL = "info@britishwayholdings.lk";

const contactItems = [
  { icon: MapPin, label: "Head office", value: "No. 123, Galle Road, Colombo 03, Sri Lanka" },
  { icon: Phone, label: "Telephone", value: "+94 11 234 5678", href: "tel:+94112345678" },
  { icon: Mail, label: "Email", value: GROUP_EMAIL, href: `mailto:${GROUP_EMAIL}` },
  { icon: Globe, label: "Website", value: "www.britishwayholdings.lk" },
  { icon: Clock, label: "Office hours", value: "Mon–Fri 8:00 AM – 5:00 PM · Sat 8:00 AM – 1:00 PM" },
];

const fieldClass =
  "peer w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 pb-3 pt-6 text-[15px] text-white placeholder-transparent transition-colors focus:border-[#d8b36a]/70 focus:bg-white/[0.07] focus:outline-none";
const labelClass =
  "pointer-events-none absolute left-5 top-2 text-[11px] font-semibold tracking-[0.15em] text-[#f3dca0] uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/45 peer-focus:top-2 peer-focus:text-[11px] peer-focus:tracking-[0.15em] peer-focus:uppercase peer-focus:text-[#f3dca0]";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [opened, setOpened] = useState(false);

  // There is no mail server behind the site yet, so hand the message to the visitor's email app.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const signature = [form.name, form.company, form.email].filter(Boolean).join("\n");
    const body = `${form.message}\n\n— ${signature}`;
    window.location.href = `mailto:${GROUP_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const field = (key: keyof typeof form, label: string, type = "text", required = true) => (
    <label className="relative block">
      <input
        type={type}
        required={required}
        placeholder={label}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={fieldClass}
      />
      <span className={labelClass}>
        {label}
        {required ? " *" : ""}
      </span>
    </label>
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumb="Contact"
        watermark="HELLO"
        image="/logos/hi002.png"
        title={
          <>
            Let's start a <span className="accent">conversation.</span>
          </>
        }
        description="Whether you're a prospective student, a guest, a partner or a future colleague — we'd love to hear from you."
      />

      {/* Contact cards */}
      <section className="relative px-6 md:px-10">
        <Reveal className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08} y={50}>
          {contactItems.map((c) => {
            const inner = (
              <div className="glass luxe-border flex h-full flex-col gap-4 rounded-[1.75rem] p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#f3dca0] to-[#9c7a3c] text-[#1a1204]">
                  <c.icon size={20} />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">{c.label}</span>
                <span className="text-[15px] leading-relaxed text-white">{c.value}</span>
              </div>
            );
            return (
              <TiltCard key={c.label} className="h-full rounded-[1.75rem]" max={8}>
                {c.href ? (
                  <a href={c.href} className="block h-full">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </TiltCard>
            );
          })}
        </Reveal>
      </section>

      {/* Form + map */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="orb left-0 top-1/3 h-[420px] w-[420px] bg-[#1b3f8f]/30" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_1fr]">
          <Reveal y={60}>
            <div className="glass-strong luxe-border rounded-[2.25rem] p-7 md:p-10">
              <span className="eyebrow">Send a message</span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">How can we help?</h2>
              <p className="mt-3 text-sm text-mist">Fill in the form and your email app will open with the message ready to send to our team.</p>
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("name", "Full name")}
                  {field("email", "Email address", "email")}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("company", "Company / organisation", "text", false)}
                  {field("subject", "Subject")}
                </div>
                <label className="relative block">
                  <textarea
                    required
                    rows={6}
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                  />
                  <span className={labelClass}>Message *</span>
                </label>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button type="submit" className="btn-luxe shine">
                    <Send size={16} /> Send message
                  </button>
                  {opened && (
                    <p className="text-sm text-[#f3dca0]">
                      Your email app should now be open. If it isn't, write to us at{" "}
                      <a href={`mailto:${GROUP_EMAIL}`} className="underline">
                        {GROUP_EMAIL}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Reveal>

          <Reveal y={60} className="flex flex-col gap-6">
            <div className="relative min-h-[380px] flex-1 overflow-hidden rounded-[2.25rem] border border-white/10">
              <iframe
                title="British Way Holdings head office map"
                src="https://maps.google.com/maps?q=Galle+Road+Colombo+03+Sri+Lanka&output=embed"
                className="absolute inset-0 h-full w-full"
                style={{ filter: "invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.9)" }}
                loading="lazy"
              />
              <div className="glass-strong absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-2xl p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#d7263d] text-white">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-white">British Way Holdings — Head Office</p>
                  <p className="text-xs text-white/60">No. 123, Galle Road, Colombo 03</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Company directory */}
      <section className="relative px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Company directory"
            title={
              <>
                Reach a company <span className="accent">directly.</span>
              </>
            }
            action={
              <LuxeButton to="/about#companies" variant="ghost">
                All companies
              </LuxeButton>
            }
          />
          <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06} y={40}>
            {companies.map((c) => (
              <div key={c.slug} className="glass luxe-border group flex h-full flex-col gap-4 rounded-[1.75rem] p-5">
                <div className="flex items-center gap-3">
                  <LogoChip company={c} className="h-12 w-16 shrink-0" padding="p-1.5" />
                  <Link to={`/companies/${c.slug}`} className="font-display text-sm font-semibold leading-snug text-white hover:text-[#f3dca0]">
                    {c.name}
                  </Link>
                </div>
                <div className="mt-auto flex flex-col gap-2 text-[13px]">
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/65 hover:text-white">
                      <Phone size={13} className="text-[#d8b36a]" /> {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-white/65 hover:text-white">
                      <Mail size={13} className="text-[#d8b36a]" /> {c.email}
                    </a>
                  )}
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/65 hover:text-white">
                    <ArrowUpRight size={13} className="text-[#d8b36a]" /> {c.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
