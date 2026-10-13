import React from "react";
import { Container, SectionHeading } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { FileText } from "lucide-react";

const GUIDES = [
  "Understanding the Basic Structure Doctrine", "A practical guide to the Arbitration & Conciliation Act 1996",
  "IBC 2016: from default to resolution", "Reading and citing Supreme Court judgments",
  "Drafting legal notices under Indian law", "Company law compliance calendar for CS professionals",
  "GST litigation: an introduction", "The new criminal codes: BNS, BNSS & BSA 2023",
  "Limitation and condonation of delay explained", "Contract risk: clauses that matter most",
];

export default function Guides() {
  usePageMeta("Guides", "Practical, in-depth guides on Indian law and legal practice.");
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50"><Container><SectionHeading eyebrow="Guides" title="Practical guides for legal professionals." /></Container></section>
      <section className="py-16"><Container>
        <div className="grid sm:grid-cols-2 gap-4">
          {GUIDES.map((g, i) => (
            <Reveal key={g} delay={i * 0.03}>
              <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-900 transition-colors cursor-pointer">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 flex-shrink-0"><FileText className="h-5 w-5" strokeWidth={1.5} /></span>
                <div><p className="text-sm font-semibold text-slate-900">{g}</p><p className="mt-1 text-xs text-slate-500">Guide · {6 + (i % 6)} min read</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container></section>
    </div>
  );
}
