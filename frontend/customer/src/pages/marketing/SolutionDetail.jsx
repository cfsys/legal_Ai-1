import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Container, CTASection, Eyebrow } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { SOLUTIONS } from "@/components/shared/marketingData";
import { ArrowRight, Check } from "lucide-react";

export default function SolutionDetail() {
  const { persona } = useParams();
  const s = SOLUTIONS.find((x) => x.slug === persona);
  usePageMeta(s?.name, s?.headline);
  if (!s) return <Navigate to="/solutions" replace />;
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50">
        <Container>
          <Reveal><Eyebrow>{s.name}</Eyebrow>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 max-w-3xl leading-tight">{s.headline}</h1>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">Start Free</Link>
              <Link to="/demo" className="px-5 py-3 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">Book a Demo</Link>
            </div>
          </Reveal>
        </Container>
      </section>
      <section className="py-20"><Container>
        <h2 className="font-display text-2xl font-semibold text-slate-900">What you can do</h2>
        <p className="mt-2 text-slate-500 max-w-2xl">Everything you need to research, understand and write about the law — in one workspace built for how you study.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {s.points.map((p, i) => {
            const detailed = typeof p === "object";
            const title = detailed ? p.title : p;
            return (
              <Reveal key={title} delay={i * 0.04}>
                <div className="rounded-xl border border-slate-200 bg-white p-6 h-full">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white flex-shrink-0"><Check className="h-4.5 w-4.5" /></span>
                    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  </div>
                  {detailed && <p className="mt-3 text-sm text-slate-500 leading-relaxed">{p.detail}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-14 grid sm:grid-cols-3 gap-4">
          {SOLUTIONS.filter((x) => x.slug !== s.slug).slice(0, 3).map((o) => (
            <Link key={o.slug} to={o.path} className="rounded-xl border border-slate-200 p-5 hover:border-slate-900 transition-colors">
              <o.icon className="h-5 w-5 text-slate-500" />
              <p className="mt-3 text-sm font-semibold text-slate-900">{o.name}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">Explore <ArrowRight className="h-3 w-3" /></span>
            </Link>
          ))}
        </div>
      </Container></section>
      <CTASection />
    </div>
  );
}
