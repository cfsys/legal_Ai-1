import React from "react";
import { Link } from "react-router-dom";
import { Container, SectionHeading, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { SOLUTIONS } from "@/components/shared/marketingData";
import { ArrowRight } from "lucide-react";

export default function Solutions() {
  usePageMeta("Solutions", "Legal AI for advocates, law firms, corporate legal teams, CA & CS professionals, students and universities.");
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50">
        <Container><SectionHeading eyebrow="Solutions" title="Built for how you work with law." subtitle="Tailored workflows for every kind of legal professional and institution." /></Container>
      </section>
      <section className="py-20"><Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <Link to={s.path} data-testid={`solution-card-${s.slug}`} className="group block rounded-2xl border border-slate-200 bg-white p-7 h-full hover:border-slate-900 hover:shadow-lg transition-all">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors"><s.icon className="h-5 w-5" strokeWidth={1.75} /></span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.name}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.headline}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 group-hover:gap-2.5 transition-all">Explore <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container></section>
      <CTASection />
    </div>
  );
}
