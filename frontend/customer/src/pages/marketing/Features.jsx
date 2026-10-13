import React from "react";
import { Container, SectionHeading, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { PRODUCTS } from "@/components/shared/marketingData";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Database, Users, ShieldCheck, BarChart3 } from "lucide-react";

const EXTRA = [
  { icon: Database, name: "Legal Knowledge Base", desc: "A firm-wide, searchable repository of statutes, notes and precedents.", features: ["Central statute library", "Team notes", "Saved clauses", "Version history"] },
  { icon: Users, name: "Team Collaboration", desc: "Work together on matters, research and drafts with granular roles.", features: ["Shared matters", "Comments", "Assignments", "Activity feed"] },
  { icon: ShieldCheck, name: "Security", desc: "Enterprise-grade protection for confidential legal work.", features: ["Encryption", "MFA", "Audit logs", "Tenant isolation"] },
  { icon: BarChart3, name: "Analytics", desc: "Understand research, usage and matter performance at a glance.", features: ["Usage reports", "AI reports", "Matter reports", "Financial reports"] },
];

export default function Features() {
  usePageMeta("Features", "Every capability of Legal AI — research, judgments, documents, drafting, contract review, matters, collaboration and security.");
  const all = [...PRODUCTS.map((p) => ({ icon: p.icon, name: p.name, desc: p.desc, features: p.features, path: p.path })), ...EXTRA];
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50">
        <Container><SectionHeading eyebrow="Features" title="One workspace for the complete legal workflow." subtitle="Every Legal AI capability, designed to work together seamlessly." /></Container>
      </section>
      <section className="py-20"><Container className="space-y-20">
        {all.map((f, idx) => (
          <div key={f.name} className={`grid lg:grid-cols-2 gap-10 items-center ${idx % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal><div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white"><f.icon className="h-5 w-5" strokeWidth={1.75} /></span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-slate-900">{f.name}</h3>
              <p className="mt-3 text-slate-500 leading-relaxed">{f.desc}</p>
              <ul className="mt-5 grid grid-cols-2 gap-2">{f.features.map((x) => <li key={x} className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-blue-600" /> {x}</li>)}</ul>
              {f.path && <Link to={f.path} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:gap-2.5 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>}
            </div></Reveal>
            <Reveal delay={0.1}><div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 aspect-[4/3] flex items-center justify-center">
              <f.icon className="h-16 w-16 text-slate-200" strokeWidth={1} />
            </div></Reveal>
          </div>
        ))}
      </Container></section>
      <CTASection />
    </div>
  );
}
