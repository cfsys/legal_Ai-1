import React from "react";
import { Link } from "react-router-dom";
import { Scale } from "lucide-react";

export function Logo({ to = "/", light = false, className = "" }) {
  const text = light ? "text-white" : "text-slate-900";
  return (
    <Link to={to} data-testid="brand-logo" className={`flex items-center gap-2.5 group ${className}`}>
      <span className={`grid place-items-center h-8 w-8 rounded-full border ${light ? "border-white/30 bg-white/10 text-white" : "border-slate-800 bg-slate-950 text-white"} transition-transform group-hover:scale-105 shadow-sm`}>
        <Scale className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <span className={`font-sans text-lg font-bold tracking-tight ${text}`}>Legal<span className="text-emerald-500 font-extrabold">AI</span></span>
    </Link>
  );
}
export default Logo;
