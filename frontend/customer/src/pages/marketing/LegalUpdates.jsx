import React from "react";
import { Container, SectionHeading } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";

const UPDATES = [
  { date: "14 Jun 2026", court: "Supreme Court", title: "Larger bench clarifies limitation for Section 34 challenges", tag: "Arbitration" },
  { date: "09 Jun 2026", court: "NCLAT", title: "Guidance on operational creditor claims under IBC", tag: "Insolvency" },
  { date: "02 Jun 2026", court: "Delhi High Court", title: "Interim injunction standards in trademark disputes reaffirmed", tag: "IP" },
  { date: "27 May 2026", court: "Supreme Court", title: "Scope of oppression & mismanagement under Companies Act 2013", tag: "Corporate" },
  { date: "20 May 2026", court: "Bombay High Court", title: "GST refund timelines and interest — key ruling", tag: "Tax" },
  { date: "12 May 2026", court: "Supreme Court", title: "Condonation of delay: substantial justice reaffirmed", tag: "Civil" },
];

export default function LegalUpdates() {
  usePageMeta("Legal Updates", "The latest rulings and legal developments across Indian courts.");
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50"><Container><SectionHeading eyebrow="Legal Updates" title="Stay current with Indian courts." /></Container></section>
      <section className="py-16"><Container className="max-w-3xl">
        <div className="space-y-3">
          {UPDATES.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.04}>
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-900 transition-colors">
                <div className="text-center flex-shrink-0 w-16">
                  <p className="font-mono text-xs text-slate-400">{u.date.split(" ")[0]} {u.date.split(" ")[1]}</p>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-blue-600">{u.court} · {u.tag}</span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{u.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container></section>
    </div>
  );
}
