import React from "react";
import { Link } from "react-router-dom";
import { Container, SectionHeading, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { BookOpen, Zap, Rocket, FileSearch, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

const CARDS = [
  { icon: BookOpen, t: "Legal Guides", d: "In-depth guides on Indian statutes and procedure.", to: "/resources/guides" },
  { icon: Zap, t: "AI & Legal Research", d: "How to get the most from AI-assisted research.", to: "/resources/blog" },
  { icon: Rocket, t: "Product Updates", d: "The latest features and improvements.", to: "/resources/legal-updates" },
  { icon: FileSearch, t: "Case Research Guides", d: "Techniques for finding and reading authorities.", to: "/resources/guides" },
  { icon: ShieldCheck, t: "Contract Review Guides", d: "Frameworks for reliable contract analysis.", to: "/resources/guides" },
  { icon: Cpu, t: "Legal Technology", d: "Trends shaping the future of legal work.", to: "/resources/blog" },
];

export default function Resources() {
  usePageMeta("Resources", "Guides, articles and legal updates from the Legal AI team.");
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50"><Container><SectionHeading eyebrow="Resources" title="Learn, research and stay updated." subtitle="Guides and insights for modern legal professionals." /></Container></section>
      <section className="py-20"><Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.05}>
              <Link to={c.to} className="group block rounded-2xl border border-slate-200 bg-white p-7 h-full hover:border-slate-900 hover:shadow-lg transition-all">
                <c.icon className="h-6 w-6 text-slate-700" strokeWidth={1.5} />
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{c.t}</h3>
                <p className="mt-2 text-sm text-slate-500">{c.d}</p>
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
