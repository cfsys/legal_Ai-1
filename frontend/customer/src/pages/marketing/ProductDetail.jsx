import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Container, CTASection, Eyebrow } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { PRODUCTS } from "@/components/shared/marketingData";
import { ArrowRight, Check } from "lucide-react";

export default function ProductDetail() {
  const { pathname } = window.location;
  const { slug: paramSlug } = useParams();
  const slug = paramSlug || pathname.replace("/", "");
  const p = PRODUCTS.find((x) => x.slug === slug);
  usePageMeta(p?.name, p?.desc);
  if (!p) return <Navigate to="/features" replace />;
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <Eyebrow>{p.name}</Eyebrow>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">{p.tagline}</h1>
              <p className="mt-5 text-lg text-slate-500 leading-relaxed">{p.desc}</p>
              <div className="mt-8 flex gap-3">
                <Link to="/register" className="px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">Start Free</Link>
                <Link to="/demo" className="px-5 py-3 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">Book a Demo</Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4"><p.icon className="h-5 w-5 text-slate-700" /><span className="text-sm font-semibold text-slate-800">{p.name}</span></div>
                <div className="space-y-2">
                  {p.features.map((f, i) => (
                    <div key={f} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
                      <span className="grid h-5 w-5 place-items-center rounded bg-white border border-slate-200"><Check className="h-3 w-3 text-blue-600" /></span>
                      <span className="text-xs text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
      <section className="py-20"><Container>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Capabilities</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {p.features.map((f, i) => (
            <Reveal key={f} delay={i * 0.03}>
              <div className="rounded-xl border border-slate-200 p-5 h-full">
                <span className="font-mono text-xs text-slate-300">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-sm font-semibold text-slate-900">{f}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Explore other products</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {PRODUCTS.filter((x) => x.slug !== p.slug).map((o) => (
              <Link key={o.slug} to={o.path} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-slate-900 transition-colors"><o.icon className="h-4 w-4" /> {o.name}</Link>
            ))}
          </div>
        </div>
      </Container></section>
      <CTASection />
    </div>
  );
}
