import React from "react";
import { Container, SectionHeading, CTASection, Eyebrow } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";

const SECTIONS = [
  { t: "Our Mission", d: "To reduce repetitive legal work so professionals can focus on judgment, strategy and advocacy — the parts of law that truly need a human mind." },
  { t: "The Problem We Are Solving", d: "Legal professionals spend significant time finding authorities, reading long judgments, analysing documents and preparing first drafts. That time is expensive and often repetitive." },
  { t: "Our Approach", d: "We combine natural-language AI with the structure of Indian statutes and case law, always presenting sources so professionals can verify every answer." },
  { t: "Trust & Responsibility", d: "We never train on client briefs. Confidentiality, security and professional responsibility guide every product decision we make." },
  { t: "AI With Human Oversight", d: "Legal AI is a research and drafting assistant. Professional judgment always remains in the hands of qualified legal professionals." },
  { t: "Our Vision", d: "A future where every advocate, firm and legal team — regardless of size — has access to world-class legal intelligence." },
];

export default function About() {
  usePageMeta("About Us", "Building a smarter way to work with law. Legal AI reduces repetitive legal work while keeping professional judgment with qualified professionals.");
  return (
    <div>
      <section className="border-b border-slate-100 py-24 bg-slate-50">
        <Container>
          <Reveal><Eyebrow>About Legal AI</Eyebrow>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 max-w-3xl leading-tight">Building a smarter way to work with law.</h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl leading-relaxed">Legal AI is designed to reduce repetitive legal work while keeping professional judgment in the hands of qualified legal professionals.</p>
          </Reveal>
        </Container>
      </section>
      <section className="py-20"><Container>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.t} delay={(i % 2) * 0.06}>
              <div>
                <span className="font-mono text-xs text-slate-300">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">{s.t}</h2>
                <p className="mt-3 text-slate-500 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container></section>
      <CTASection />
    </div>
  );
}
