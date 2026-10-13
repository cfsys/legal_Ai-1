import React from "react";
import { Link } from "react-router-dom";

export function Container({ children, className = "" }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }) {
  return <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">{children}</span>;
}

export function SectionHeading({ eyebrow, title, subtitle, center = false, className = "" }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {eyebrow && <div className="mb-3"><Eyebrow>{eyebrow}</Eyebrow></div>}
      <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-slate-500 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function PrimaryButton({ to, onClick, children, className = "", type, testId }) {
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm ${className}`;
  if (to) return <Link to={to} data-testid={testId} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} data-testid={testId} className={cls}>{children}</button>;
}

export function SecondaryButton({ to, onClick, children, className = "", testId }) {
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-900 border border-slate-200 font-medium text-sm hover:bg-slate-50 transition-all shadow-sm ${className}`;
  if (to) return <Link to={to} data-testid={testId} className={cls}>{children}</Link>;
  return <button onClick={onClick} data-testid={testId} className={cls}>{children}</button>;
}

export function CTASection({ onBookDemo }) {
  return (
    <section className="bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.06]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">Work with law more intelligently.</h2>
        <p className="mt-5 text-lg text-slate-300 max-w-2xl mx-auto">Start researching, analysing and drafting with Legal AI.</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link to="/register" data-testid="cta-start-free" className="px-6 py-3.5 rounded-lg bg-white text-slate-900 font-medium text-sm hover:bg-slate-100 transition-all active:scale-[0.98]">Start Free</Link>
          {onBookDemo ? (
            <button
              type="button"
              onClick={onBookDemo}
              data-testid="cta-book-demo"
              className="px-6 py-3.5 rounded-lg border border-white/25 text-white font-medium text-sm hover:bg-white/10 transition-all cursor-pointer"
            >
              Book a Demo
            </button>
          ) : (
            <Link to="/demo" data-testid="cta-book-demo" className="px-6 py-3.5 rounded-lg border border-white/25 text-white font-medium text-sm hover:bg-white/10 transition-all">Book a Demo</Link>
          )}
        </div>
      </div>
    </section>
  );
}
