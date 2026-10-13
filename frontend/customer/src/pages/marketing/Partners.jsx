import React from "react";
import { Container, SectionHeading, Eyebrow, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { LeadForm } from "@/components/marketing/LeadForm";
import { 
  Building2, 
  GraduationCap, 
  Scale, 
  Workflow, 
  ShieldCheck, 
  Handshake, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  FileCheck 
} from "lucide-react";

const PARTNER_PROGRAMS = [
  {
    icon: Building2,
    tag: "Law Firms & Chambers",
    title: "Firm Innovation Alliance",
    desc: "Designed for boutique chambers and premier Indian law firms. Gain early access to proprietary citation models, firm-specific taxonomy fine-tuning, and priority feature roadmapping.",
    features: [
      "Custom private vector indexes for firm work product",
      "Executive sponsorship from our AI research team",
      "Co-authored whitepapers & industry benchmarks",
      "Dedicated firm success manager & custom onboarding",
    ],
  },
  {
    icon: GraduationCap,
    tag: "Academia & Law Schools",
    title: "University & Moot Court Alliance",
    desc: "Partner with India's top National Law Universities (NLUs) and legal faculties to equip students, moot court teams, and law journals with cutting-edge legal AI.",
    features: [
      "Subsidized campus-wide student & faculty licenses",
      "Sponsorship for National Moot Court competitions",
      "AI & Legal Research certification modules",
      "Academic research grants for empirical legal studies",
    ],
  },
  {
    icon: Scale,
    tag: "Bar Associations",
    title: "Judicial & Bar Council Initiatives",
    desc: "Collaborate with High Court Bar Associations, district legal service authorities, and legal aid societies to foster digital literacy and accelerate judicial throughput.",
    features: [
      "Free Continuing Legal Education (CLE) masterclasses",
      "Pro-bono legal aid clinics research access",
      "Regional vernacular language search beta access",
      "Courtroom tech modernization workshops",
    ],
  },
  {
    icon: Workflow,
    tag: "Tech & Integrations",
    title: "Technology & ISV Partner Program",
    desc: "Integrate Legal AI's semantic judgment search, document OCR, and clause review directly into your DMS, ERP, practice management, or billing software.",
    features: [
      "High-throughput REST & GraphQL API access",
      "Sandboxed developer environments & SDKs",
      "Joint go-to-market and marketplace listing",
      "Technical certification and co-selling support",
    ],
  },
];

const STATS = [
  { value: "45+", label: "Partner Law Firms" },
  { value: "18+", label: "Universities & NLUs" },
  { value: "10,000+", label: "Advocates Empowered" },
  { value: "99.9%", label: "Platform Uptime" },
];

const PARTNER_FIELDS = [
  { name: "name", label: "Full Name", required: true },
  { name: "email", label: "Official / Work Email", type: "email", required: true },
  { name: "mobile", label: "Phone / WhatsApp", required: true },
  { name: "organisation", label: "Institution / Firm Name", required: true },
  { name: "role", label: "Your Role / Designation", required: true },
  {
    name: "orgSize",
    label: "Partnership Track",
    type: "select",
    options: [
      "Law Firm Innovation Alliance",
      "University / Academic Alliance",
      "Bar Association Initiative",
      "Technology & Software Integration",
      "Other Strategic Partnership",
    ],
  },
  {
    name: "message",
    label: "Describe your organization and partnership objectives",
    type: "textarea",
    full: true,
  },
];

export default function Partners() {
  usePageMeta("Partner Ecosystem — Legal AI", "Collaborate with Legal AI to shape the future of Indian legal technology.");

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="h-3.5 w-3.5" /> Collaborative Legal Innovation
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                Empowering India's <span className="text-blue-400">Legal Ecosystem</span> together.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                Whether you lead a premier law firm, an academic institution, or a legal technology platform, join hands with Legal AI to pioneer intelligent legal research and workflows across the nation.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#partner-form"
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all shadow-md"
                >
                  Become a Partner
                </a>
                <a
                  href="#programs"
                  className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-all"
                >
                  Explore Programs
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="p-4">
                <div className="font-display text-3xl sm:text-4xl font-semibold text-slate-900">{s.value}</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PARTNER PROGRAMS */}
      <section className="py-24 bg-slate-50" id="programs">
        <Container>
          <SectionHeading
            center
            eyebrow="Programs"
            title="Partnership tracks tailored to your institution."
            subtitle="Choose the track that fits your goals and co-create next-generation legal solutions."
          />

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {PARTNER_PROGRAMS.map((prog, i) => (
              <Reveal key={prog.title} delay={i * 0.05}>
                <div className="bg-white rounded-2xl border border-slate-200 p-8 h-full shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <prog.icon className="h-6 w-6" />
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {prog.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-slate-900">{prog.title}</h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{prog.desc}</p>

                    <div className="mt-6 space-y-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Included Benefits:</p>
                      {prog.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <a
                      href="#partner-form"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Apply for this program <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* APPLICATION FORM SECTION */}
      <section className="py-24 bg-white" id="partner-form">
        <Container className="max-w-4xl">
          <div className="text-center mb-12">
            <Eyebrow>Join The Network</Eyebrow>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Apply to Become an Official Partner
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
              Tell us about your organization and how we can collaborate. Our partnerships lead will connect with you within 24 business hours.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6 sm:p-10">
            <LeadForm
              kind="partner"
              fields={PARTNER_FIELDS}
              useCases={[
                "Enterprise Integration",
                "Knowledge Sharing",
                "Campus Outreach",
                "Co-Marketing",
              ]}
            />
          </div>
        </Container>
      </section>

      <CTASection />
    </div>
  );
}
