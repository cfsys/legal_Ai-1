import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, SectionHeading } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { BLOG_POSTS } from "@/components/shared/marketingData";
import { Clock } from "lucide-react";

export default function Blog() {
  usePageMeta("Blog", "Articles on legal research, contract review, legal technology and Indian law.");
  const cats = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const posts = cat === "All" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === cat);
  return (
    <div>
      <section className="border-b border-slate-100 py-20 bg-slate-50"><Container><SectionHeading eyebrow="Blog" title="Insights from the Legal AI team." /></Container></section>
      <section className="py-16"><Container>
        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${cat === c ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{c}</button>)}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link to={`/resources/blog/${p.slug}`} className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden h-full hover:shadow-lg transition-all">
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center">
                  <span className="font-display text-2xl text-white/20">{p.category}</span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{p.category}</span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.desc}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{p.author} · {p.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container></section>
    </div>
  );
}
