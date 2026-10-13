import React from "react";
import { Sparkles, Gavel, FileCheck2, ArrowRight } from "lucide-react";

export function ResearchPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="ml-2 flex-1 rounded-md bg-white border border-slate-200 px-3 py-1 text-[11px] text-slate-400 font-mono">legalai.in/app/research</div>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-900 text-white flex-shrink-0"><Sparkles className="h-3.5 w-3.5" /></span>
          <p className="text-[13px] leading-relaxed text-slate-700">Find Supreme Court judgments on delay condonation under Section 5 of the Limitation Act.</p>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1.5">AI Answer</p>
          <p className="text-[13px] leading-relaxed text-slate-600">
            Courts adopt a <span className="font-medium text-slate-900">liberal, justice-oriented approach</span> to condonation of delay. The leading authority holds that substantial justice must be preferred over technical considerations…
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {[
            { name: "Collector, Land Acquisition v. Mst. Katiji", cite: "(1987) 2 SCC 107", tone: "emerald" },
            { name: "Esher Singh v. State of A.P.", cite: "(2004) 11 SCC 585", tone: "amber" },
          ].map((c) => (
            <div key={c.cite} className="rounded-lg border border-slate-200 p-2.5">
              <div className="flex items-center gap-1.5">
                <Gavel className="h-3 w-3 text-slate-400" />
                <span className={`text-[9px] font-semibold uppercase tracking-wide ${c.tone === "emerald" ? "text-emerald-600" : "text-amber-600"}`}>{c.tone === "emerald" ? "Good Law" : "Distinguished"}</span>
              </div>
              <p className="mt-1 text-[11px] font-medium leading-snug text-slate-800 line-clamp-2">{c.name}</p>
              <p className="mt-1 font-mono text-[10px] text-blue-700">{c.cite}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2.5">
          <span className="flex items-center gap-2 text-[11px] text-slate-300"><FileCheck2 className="h-3.5 w-3.5 text-emerald-400" /> 5 authorities · citation-backed</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-white">Save to Matter <ArrowRight className="h-3 w-3" /></span>
        </div>
      </div>
    </div>
  );
}

export default ResearchPreview;
