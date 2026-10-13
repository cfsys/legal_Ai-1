import React, { useState } from "react";
import { Container } from "@/components/shared/ui";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { Search, Rocket, Gavel, FileText, PenLine, Layers, CreditCard, User, ShieldCheck, Settings2 } from "lucide-react";

const CATS = [
  { icon: Rocket, t: "Getting Started" }, { icon: Search, t: "Legal Research" }, { icon: Gavel, t: "Judgments" },
  { icon: FileText, t: "Documents" }, { icon: PenLine, t: "Drafting" }, { icon: Layers, t: "Matters" },
  { icon: CreditCard, t: "Billing" }, { icon: User, t: "Account" }, { icon: ShieldCheck, t: "Security" }, { icon: Settings2, t: "Administration" },
];

export default function HelpCentre() {
  usePageMeta("Help Centre", "Find answers and learn how to get the most out of Legal AI.");
  const [q, setQ] = useState("");
  return (
    <div>
      <section className="border-b border-slate-100 py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.06]" />
        <Container className="relative text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white">How can we help?</h1>
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input data-testid="help-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the help centre…" className="w-full rounded-xl bg-white pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </Container>
      </section>
      <section className="py-16"><Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATS.filter((c) => c.t.toLowerCase().includes(q.toLowerCase())).map((c) => (
            <div key={c.t} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-900 transition-colors cursor-pointer">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-700"><c.icon className="h-5 w-5" strokeWidth={1.5} /></span>
              <div><p className="text-sm font-semibold text-slate-900">{c.t}</p><p className="text-xs text-slate-500">Browse articles →</p></div>
            </div>
          ))}
        </div>
      </Container></section>
    </div>
  );
}
