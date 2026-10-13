import React from "react";
import { Link } from "react-router-dom";
import { Container, SectionHeading, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { PLANS, PRICING_MATRIX } from "@/components/shared/marketingData";
import { Check, X, Minus } from "lucide-react";

const cell = (v) => {
  if (v === true) return <Check className="h-4 w-4 text-emerald-600 mx-auto" />;
  if (v === false) return <Minus className="h-4 w-4 text-slate-300 mx-auto" />;
  return <span className="text-sm text-slate-700">{v}</span>;
};

export default function Pricing() {
  usePageMeta("Pricing", "Simple, transparent pricing for individuals, professionals, law firms and enterprises.");
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50">
        <Container><SectionHeading center eyebrow="Pricing" title="Plans that scale with your practice." subtitle="Start free. Upgrade as you grow. Cancel anytime." /></Container>
      </section>
      <section className="py-20"><Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              <div className={`rounded-2xl border p-6 h-full flex flex-col bg-white ${p.highlight ? "border-slate-900 ring-1 ring-slate-900 shadow-lg" : "border-slate-200"}`}>
                {p.highlight && <span className="inline-block w-max mb-3 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Popular</span>}
                <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{p.desc}</p>
                <p className="mt-4 font-display text-3xl font-semibold text-slate-900">{p.price}<span className="text-sm font-normal text-slate-400">{p.period}</span></p>
                <ul className="mt-5 space-y-2 flex-1">{p.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /> {f}</li>)}</ul>
                <Link to={p.name === "Enterprise" ? "/contact" : "/register"} data-testid={`pricing-cta-${p.name.toLowerCase().replace(" ", "-")}`} className={`mt-6 block text-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${p.highlight ? "bg-slate-900 text-white hover:bg-slate-800" : "border border-slate-200 text-slate-900 hover:bg-slate-50"}`}>{p.cta}</Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 overflow-x-auto">
          <h2 className="font-display text-2xl font-semibold text-slate-900 mb-6">Compare all features</h2>
          <table className="w-full min-w-[720px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left text-sm font-semibold text-slate-500 pb-4 pr-4">Feature</th>
                {PLANS.map((p) => <th key={p.name} className="text-center text-sm font-semibold text-slate-900 pb-4 px-4">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {PRICING_MATRIX.map((row, i) => (
                <tr key={row[0]} className={i % 2 ? "bg-slate-50" : ""}>
                  <td className="text-sm text-slate-700 py-3 pr-4 rounded-l-lg">{row[0]}</td>
                  {row.slice(1).map((v, j) => <td key={j} className="text-center py-3 px-4">{cell(v)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container></section>
      <CTASection />
    </div>
  );
}
