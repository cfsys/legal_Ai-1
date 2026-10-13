import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Container } from "@/components/shared/ui";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { BLOG_POSTS } from "@/components/shared/marketingData";
import { Clock, ArrowLeft } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  usePageMeta(post?.title, post?.desc);
  if (!post) return <Navigate to="/resources/blog" replace />;
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  return (
    <article className="py-16"><Container className="max-w-3xl">
      <Link to="/resources/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-8"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{post.category}</span>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">{post.title}</h1>
      <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
        <span className="font-medium text-slate-700">{post.author}</span><span>·</span><span>{post.date}</span><span>·</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.read}</span>
      </div>
      <div className="mt-8 aspect-[16/8] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900" />
      <div className="prose-legal mt-10">
        <p className="text-lg text-slate-600">{post.desc}</p>
        <h2>Overview</h2>
        <p>This article explores the practical implications for advocates and legal teams working within the Indian legal framework. Legal AI helps professionals move from a legal question to a citation-backed answer faster, while keeping the professional in control of judgment.</p>
        <h2>Why it matters</h2>
        <p>Legal work is built on authority. Whether you are researching delay condonation under <code>Section 5 of the Limitation Act, 1963</code> or reviewing an indemnity clause, the ability to surface the right precedent quickly changes the economics of practice.</p>
        <ul><li>Faster discovery of relevant authorities</li><li>Consistent, structured research memorandums</li><li>Clear separation of AI assistance and professional judgment</li></ul>
        <h2>Conclusion</h2>
        <p>AI-assisted research is most powerful when it augments — not replaces — professional expertise. Legal AI is built on that principle.</p>
      </div>
      <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
        <p className="font-display text-xl font-semibold text-white">Stay ahead of the law.</p>
        <p className="mt-2 text-sm text-slate-300">Get the latest legal-tech insights in your inbox.</p>
        <div className="mt-5 flex max-w-sm mx-auto gap-2">
          <input placeholder="Work email" className="flex-1 rounded-lg px-3 py-2.5 text-sm bg-white/10 text-white placeholder:text-slate-400 border border-white/15 focus:outline-none" />
          <button className="rounded-lg bg-white text-slate-900 px-4 py-2.5 text-sm font-medium">Subscribe</button>
        </div>
      </div>
      <div className="mt-14">
        <h3 className="font-display text-xl font-semibold text-slate-900 mb-5">Related articles</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((r) => (
            <Link key={r.slug} to={`/resources/blog/${r.slug}`} className="rounded-xl border border-slate-200 p-4 hover:border-slate-900 transition-colors">
              <span className="text-xs font-semibold text-blue-600">{r.category}</span>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 leading-snug">{r.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </Container></article>
  );
}
