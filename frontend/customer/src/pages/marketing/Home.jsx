import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, SectionHeading, Eyebrow, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { BookDemoModal } from "@/components/marketing/BookDemoModal";
import { ContactForm } from "@/components/marketing/ContactForm";
import { ArrowRight, Scale, Clock, ShieldCheck, Check, Briefcase, Award, Sparkles, Building2, FileCheck2 } from "lucide-react";
import legalTeamHero from "@/assets/legal_team_hero.jpg";
import legalConsultation from "@/assets/legal_consultation.jpg";

const PRACTICE_AREAS = [
  {
    title: "Corporate & Commercial Advisory",
    desc: "Structuring cross-border operations, board resolutions, shareholder pacts, and regulatory compliance.",
    icon: Building2,
  },
  {
    title: "Dispute Resolution & Litigation",
    desc: "Rigorous case docket tracking, High Court & Supreme Court representation, and proactive dispute strategy.",
    icon: Scale,
  },
  {
    title: "Intellectual Property & Brand Protection",
    desc: "Comprehensive trademark clearance, copyright defense, patents, and brand asset safeguarding.",
    icon: Award,
  },
  {
    title: "Contract Intelligence & Review",
    desc: "Deep risk detection across NDAs, commercial agreements, liability caps, and governance covenants.",
    icon: FileCheck2,
  },
];

const TRUST_METRICS = [
  { val: "20+", label: "Years Combined Counsel" },
  { val: "100%", label: "Conflict-Free Vetting" },
  { val: "15 Min", label: "Initial Consultation" },
  { val: "99.4%", label: "Client Retainer Trust" },
];

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  usePageMeta(
    "Legal AI · Modern Boutique Advisory & Legal Intelligence",
    "Assisting in the accurate establishment, development, and safeguarding of your brand and business."
  );

  return (
    <div className="bg-[#f6f5f1] text-[#0c1017] min-h-screen">
      {/* HERO SECTION - REFINED BOUTIQUE EDITORIAL THEME MATCHING ABDILAW */}
      <section className="relative overflow-hidden bg-[#f6f5f1] pt-6 sm:pt-10 pb-16 lg:pb-24 border-b border-[#e6e4dc]">
        <Container className="relative">
          {/* Top Editorial Row */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start mb-8">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Trusted Advisory Practice
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-[2.85rem] font-bold tracking-tight text-[#0c1017] leading-[1.15]">
                  Let Us Be Your Guide. <br />
                  <span className="text-[#1a2333]">Start The Process Now.</span>
                </h1>
              </Reveal>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between pt-1">
              <Reveal delay={0.08}>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Let us be your compass through the legal process. Start now with confidence, knowing our expert guidance will seamlessly navigate you through each step, ensuring a smooth journey ahead.
                </p>

                {/* Floating Circle Outline Badges matching the reference image */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="circle-badge" style={{ width: '82px', height: '82px', fontSize: '0.72rem' }}>
                    <span className="text-emerald-700 font-bold">15 Minute</span>
                    <span>Consult</span>
                  </div>
                  <div className="circle-badge" style={{ width: '82px', height: '82px', fontSize: '0.72rem' }}>
                    <span className="text-stone-900 font-bold">Actionable</span>
                    <span>Advice</span>
                  </div>
                  <div className="circle-badge" style={{ width: '82px', height: '82px', fontSize: '0.72rem' }}>
                    <span className="text-stone-900 font-bold">Conflict</span>
                    <span>Free</span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">
                  Before discussing your matter, we perform exhaustive conflict checks to preserve complete privilege and confidentiality.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Main Visual Showcase (White Bezel Frame matching reference mockup) */}
          <div className="relative mt-2 lg:mt-6">
            {/* Background Secondary Floating Card (Left side) */}
            <div className="hidden lg:block absolute -left-6 bottom-4 w-72 h-84 rounded-[28px] overflow-hidden border border-stone-300 shadow-xl z-0">
              <img
                src={legalConsultation}
                alt="Private Legal Chambers"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Direct Partner Advisory</span>
                <span className="text-xs font-semibold mt-1">Chamber Case Evaluation & Strategy</span>
              </div>
            </div>

            {/* Main Primary Showcase Card with White Bezel Frame */}
            <div className="relative lg:ml-40 bg-white p-2.5 sm:p-3.5 rounded-[36px] sm:rounded-[42px] border border-stone-200 shadow-2xl z-10">
              <div className="rounded-[28px] sm:rounded-[34px] overflow-hidden border border-stone-800/80 bg-[#0c1017]">
                {/* Card Header Bar */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="grid place-items-center h-7 w-7 rounded-full border border-white/30 bg-white/10 text-white">
                      <Scale className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </span>
                    <span className="text-white font-bold text-sm tracking-tight">Legal<span className="text-emerald-400">AI</span></span>
                  </div>

                  {/* Sub-nav in card */}
                  <div className="hidden md:flex items-center gap-5 text-xs font-medium text-stone-300">
                    <Link to="/features" className="hover:text-white transition-colors">Services</Link>
                    <Link to="/solutions" className="hover:text-white transition-colors">Practice Areas</Link>
                    <Link to="/features" className="hover:text-white transition-colors">AI Precedents</Link>
                    <Link to="/about" className="hover:text-white transition-colors">Online Help</Link>
                    <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setIsDemoModalOpen(true)}
                      className="px-4 py-1 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-stone-100 transition-colors shadow-sm"
                    >
                      Contact
                    </button>
                  </div>
                </div>

                {/* Card Body with Hero Image & High-Impact Content */}
                <div className="relative min-h-[350px] sm:min-h-[380px] lg:min-h-[400px] flex flex-col justify-end p-5 sm:p-7 lg:p-8">
                  {/* Background Image */}
                  <img
                    src={legalTeamHero}
                    alt="Executive Legal Team"
                    className="absolute inset-0 w-full h-full object-cover object-top filter brightness-85"
                  />

                  {/* Dark Vignette Overlay for Crisp Typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/20" />

                  {/* Content Overlay */}
                  <div className="relative max-w-2xl z-10">
                    <Reveal delay={0.1}>
                      <h2 className="text-lg sm:text-2xl lg:text-[1.85rem] font-bold text-white tracking-tight leading-[1.25]">
                        Assisting In The Accurate Establishment, Development, And Safeguarding Of Your Brand And Business.
                      </h2>
                    </Reveal>

                    <Reveal delay={0.15}>
                      <p className="mt-2.5 text-xs sm:text-[13px] text-stone-300 leading-relaxed font-normal max-w-xl">
                        Unsure of the next step toward your business aspirations? Want to ensure your legalities are in order? With 20+ years of business experience &amp; extensive legal training, we'll help you navigate your legal issue and provide the best solution for you to protect your brand, business, assets, and loved ones with confidence. We're here for you!
                      </p>
                    </Reveal>

                    <Reveal delay={0.2}>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsDemoModalOpen(true)}
                          className="btn-mint"
                          style={{ padding: '0.62rem 1.6rem', fontSize: '0.84rem' }}
                        >
                          Book a Consultation
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        <Link
                          to="/register"
                          className="px-5 py-2 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-xs transition-all hover:bg-white/10"
                        >
                          Explore Legal AI Platform
                        </Link>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* METRICS ROW */}
      <section className="py-14 border-b border-[#e6e4dc] bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.05}>
                <div className="text-center p-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#0c1017] tracking-tight">{m.val}</div>
                  <div className="mt-1 text-xs sm:text-sm font-semibold text-stone-500">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* PRACTICE AREAS */}
      <section className="py-20 lg:py-28 border-b border-[#e6e4dc]">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Capabilities &amp; Practice</span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#0c1017]">
              Tailored Legal Intelligence Across Critical Practice Areas.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
              From contract governance to appellate case law research, our intelligence platform delivers absolute precision.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRACTICE_AREAS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="rounded-2xl border border-[#e6e4dc] bg-white p-7 hover:border-stone-400 hover:shadow-lg transition-all h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#0c1017] text-white flex items-center justify-center mb-5 shadow-sm">
                        <Icon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h3 className="text-base font-bold text-[#0c1017]">{p.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">{p.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-stone-900">
                      <span>Explore Practice</span>
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CONTACT & CONSULTATION INTAKE */}
      <section className="py-20 bg-white border-b border-[#e6e4dc]">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Direct Partner Intake</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#0c1017]">
                  Schedule Your Initial Confidential Consultation.
                </h2>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  Tell us about your legal requirement. We evaluate each matter with complete discretion and conflict verification.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">01</span>
                    <span className="text-sm font-semibold text-stone-800">15-minute preliminary matter overview</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">02</span>
                    <span className="text-sm font-semibold text-stone-800">Precedent and jurisdictional assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">03</span>
                    <span className="text-sm font-semibold text-stone-800">Clear roadmap and actionable advisory</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-[#e6e4dc] bg-[#fbfbfa] p-6 sm:p-8 shadow-sm">
                  <ContactForm source="Homepage Boutique Intake" />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* NOIR ENTERPRISE CTA BANNER WITH SIGNATURE MINT BUTTON */}
      <section className="py-20 bg-[#0c1017] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-400 border border-white/20">
                <Sparkles className="h-3.5 w-3.5" />
                Intelligent Legal Technology
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Empower Your Practice With Next-Generation Legal Intelligence.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed">
                Join forward-thinking advocates and corporate legal teams who streamline research, judgment discovery, and matter dockets on one unified platform.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="btn-mint"
                >
                  Book a Consultation
                  <ArrowRight className="h-4 w-4" />
                </button>

                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-full border border-white/25 hover:border-white/50 text-white font-semibold text-sm transition-all hover:bg-white/10"
                >
                  Create Free Account
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
