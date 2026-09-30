import { useState, type FormEvent } from "react";
import { Clock, Globe, Mail, MapPin, Phone, Send } from "lucide-react";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { Liyawela } from "../components/ui-luxe/Heritage";
import { GlobeView } from "../components/globe/GlobeView";
import { CompanySwitchboard } from "../components/contact/CompanySwitchboard";
import { LuxeButton } from "../components/ui-luxe/LuxeButton";
import { Reveal } from "../components/fx/Reveal";
import { TiltCard } from "../components/fx/TiltCard";

const GROUP_EMAIL = "info@britishwayholdings.lk";

const contactItems = [
  { icon: MapPin, label: "Head office", value: "No. 123, Galle Road, Colombo 03, Sri Lanka" },
  { icon: Phone, label: "Telephone", value: "+94 11 234 5678", href: "tel:+94112345678" },
  { icon: Mail, label: "Email", value: GROUP_EMAIL, href: `mailto:${GROUP_EMAIL}` },
  { icon: Globe, label: "Website", value: "www.britishwayholdings.lk" },
  { icon: Clock, label: "Office hours", value: "Monday to Friday, 8:00 AM to 5:00 PM · Saturday, 8:00 AM to 1:00 PM" },
];

const fieldClass =
  "peer w-full rounded-2xl border border-fg/10 bg-fg/[0.04] px-5 pb-3 pt-6 text-[15px] text-fg placeholder-transparent transition-colors focus:border-gold/70 focus:bg-fg/[0.07] focus:outline-none";
const labelClass =
  "pointer-events-none absolute left-5 top-2 text-[11px] font-semibold tracking-[0.15em] text-gold-hi uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-fg/45 peer-focus:top-2 peer-focus:text-[11px] peer-focus:tracking-[0.15em] peer-focus:uppercase peer-focus:text-gold-hi";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [opened, setOpened] = useState(false);

  // There is no mail server behind the site yet, so hand the message to the visitor's email app.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const signature = [form.name, form.company, form.email].filter(Boolean).join("\n");
    const body = `${form.message}\n\n${signature}`;
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
        eyebrow="Contact · Sri Lanka to the world"
        crumb="Contact"
        watermark="AYUBOWAN"
        image="/logos/opt/hi002.jpg"
        lotus
        title={
          <>
            From Sri Lanka, <span className="accent">to the world.</span>
          </>
        }
        description="Ayubowan, and welcome. Whether you're a student, a guest, a partner or a future colleague, anywhere on earth, the British Way family is one message away."
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
                <span className="text-[11px] font-semibold tracking-[0.2em] text-fg/45 uppercase">{c.label}</span>
                <span className="text-[15px] leading-relaxed text-fg">{c.value}</span>
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

      {/* Island to world */}
      <section className="relative px-4 pt-24 md:px-10 md:pt-32">
        <div className="on-dark relative mx-auto grid max-w-7xl items-center gap-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy via-[#172a5c] to-navy-deep px-6 py-12 md:p-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="orb -right-24 -top-24 h-80 w-80 bg-royal/40" />
          <div className="orb -bottom-24 left-1/4 h-72 w-72 bg-maroon/40" />
          <Reveal y={50} scale={0.92} className="relative">
            <GlobeView className="mx-auto max-w-[560px]" />
          </Reveal>
          <div className="relative flex flex-col gap-8">
            <SectionHeading
              eyebrow="Rooted in Colombo · Reaching everywhere"
              title={
                <>
                  Island heart, <span className="accent">global reach.</span>
                </>
              }
              description="From our head office on Galle Road, Colombo, we connect students, guests, audiences and partners to Sri Lankan brands built to international standards, and help Sri Lankan talent reach the world."
            />
            <Reveal className="grid gap-3 sm:grid-cols-2" stagger={0.08} y={30}>
              {[
                { k: "Head office", v: "Colombo 03, Sri Lanka" },
                { k: "Network", v: "Branches island-wide" },
                { k: "Partners", v: "UK universities & beyond" },
                { k: "We reply", v: "Monday to Saturday" },
              ].map((i) => (
                <div key={i.k} className="glass rounded-2xl p-4">
                  <p className="text-[11px] tracking-[0.2em] text-fg/45 uppercase">{i.k}</p>
                  <p className="mt-1 font-display text-base font-semibold text-fg">{i.v}</p>
                </div>
              ))}
            </Reveal>
            <Liyawela opacity={0.35} />
          </div>
        </div>
      </section>

      {/* Form + map */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="orb left-0 top-1/3 h-[420px] w-[420px] bg-pearl/70" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_1fr]">
          <Reveal y={60}>
            <div className="glass-strong luxe-border rounded-[2.25rem] p-7 md:p-10">
              <span className="eyebrow">Send a message</span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-fg md:text-4xl">How can we help?</h2>
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
                    <p className="text-sm text-gold-hi">
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
            <div className="relative min-h-[380px] flex-1 overflow-hidden rounded-[2.25rem] border border-fg/10">
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
                  <p className="font-display text-sm font-semibold text-fg">British Way Holdings Head Office</p>
                  <p className="text-xs text-fg/60">No. 123, Galle Road, Colombo 03</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Company contacts */}
      <section className="relative px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Company contacts"
            title={
              <>
                Contact our subsidiaries <span className="accent">directly.</span>
              </>
            }
            description="Choose a company to see its direct line, email and website."
            className="mb-12"
            action={
              <LuxeButton to="/about#companies" variant="ghost">
                All companies
              </LuxeButton>
            }
          />
          <Reveal y={50}>
            <CompanySwitchboard />
          </Reveal>
        </div>
      </section>
    </>
  );
}
