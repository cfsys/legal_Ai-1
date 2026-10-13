import React from "react";
import { Link } from "react-router-dom";
import { Container, SectionHeading, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { SECURITY_ITEMS } from "@/components/shared/marketingData";
import { ShieldCheck, Lock, KeyRound, Fingerprint, Building2, FileLock2, ScrollText, DatabaseBackup, Bot, Timer, Server } from "lucide-react";

const SECTIONS = [
  { icon: Lock, t: "Data Security", d: "Defence-in-depth architecture with least-privilege access across every layer." },
  { icon: KeyRound, t: "Encryption", d: "TLS 1.3 in transit, AES-256 at rest for all documents and matter data." },
  { icon: Fingerprint, t: "Access Control", d: "Granular role-based access mapped to firm roles and matter teams." },
  { icon: ShieldCheck, t: "Authentication", d: "Enforced MFA, SSO and SCIM provisioning for organisations." },
  { icon: Building2, t: "Organisation Isolation", d: "Strict tenant separation ensures no cross-organisation data access." },
  { icon: FileLock2, t: "Document Confidentiality", d: "Per-document access control and confidential-matter flags." },
  { icon: ScrollText, t: "Audit Trail", d: "Immutable logs for every sensitive action, exportable for compliance." },
  { icon: DatabaseBackup, t: "Backups", d: "Automated, encrypted backups with point-in-time recovery." },
  { icon: Bot, t: "AI Data Handling", d: "Zero training on client briefs. Your data is never used to train models." },
  { icon: Timer, t: "Data Retention", d: "Configurable retention and guaranteed deletion on request." },
  { icon: Server, t: "Infrastructure", d: "Hardened cloud infrastructure with optional on-premise deployment." },
];

export default function Security() {
  usePageMeta("Security", "Enterprise-grade protection for confidential legal work — encryption, access control, audit trails and AI data handling.");
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.06]" />
        <Container className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-slate-300"><ShieldCheck className="h-3.5 w-3.5" /> Enterprise Security</span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white max-w-3xl">Your legal work deserves enterprise-grade protection.</h1>
          <p className="mt-5 text-lg text-slate-300 max-w-2xl">Security and confidentiality are foundational to Legal AI — not an afterthought.</p>
        </Container>
      </section>
      <section className="py-20"><Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.03}>
              <div className="rounded-xl border border-slate-200 bg-white p-6 h-full">
                <s.icon className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
                <h3 className="mt-4 text-base font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-flex px-6 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">Contact Security Team</Link>
        </div>
      </Container></section>
      <CTASection />
    </div>
  );
}
