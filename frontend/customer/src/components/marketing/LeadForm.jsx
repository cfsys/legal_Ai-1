import React, { useState } from "react";
import api from "@/lib/api";
import { 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Lock 
} from "lucide-react";

export function LeadForm({ kind = "contact", fields = [], useCases = [], onSuccess }) {
  const [form, setForm] = useState({});
  const [uc, setUc] = useState([]);
  const [sent, setSent] = useState(false);
  const [lastRefId, setLastRefId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        kind,
        name: `${form.firstName || ""} ${form.lastName || ""}`.trim() || form.name || "",
        firstName: form.firstName || "",
        lastName: form.lastName || "",
        email: form.email,
        mobile: form.mobile || "",
        organisation: form.organisation || "",
        role: form.role || "",
        orgSize: form.orgSize || "",
        demoDate: form.demoDate || "",
        useCases: uc,
        message: form.message || "",
        source: typeof window !== "undefined" && window.location.pathname === "/" ? "Homepage Book Demo" : `Website: ${typeof window !== "undefined" ? window.location.pathname : "marketing"}`,
        extra: { ...form, useCases: uc },
      };
      const res = await api.post("/leads", payload);
      setSent(true);
      if (res?.data?.data?._id) {
        setLastRefId(res.data.data._id.slice(-6).toUpperCase());
      }
      if (onSuccess) onSuccess(res?.data?.data);
    } catch (err) {
      console.warn("Lead submission warning:", err);
      const msg = err.response?.data?.message;
      if (msg) {
        setError(msg);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div 
        className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-8 sm:p-10 text-center shadow-sm animate-in fade-in zoom-in-95 duration-300" 
        data-testid="lead-success"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-900">
          Demo Request Confirmed!
        </h3>
        {lastRefId && (
          <p className="mt-1 text-xs font-mono font-medium text-slate-400">
            Reference ID: #{lastRefId}
          </p>
        )}
        <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for your interest. A member of our Indian legal-technology team will review your requirements and send a calendar invite shortly.
        </p>
        
        <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-left text-xs text-blue-900 max-w-md mx-auto space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-blue-600" /> What to expect on the call:
          </div>
          <p className="text-blue-800/90 pl-6">
            • A live 30-minute interactive walkthrough of case research and document intelligence.
          </p>
          <p className="text-blue-800/90 pl-6">
            • Complimentary 14-day full platform access credentials for your team.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setForm({});
              setUc([]);
              setSent(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form 
      onSubmit={submit} 
      className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-sm" 
      data-testid="lead-form"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {f.label}
              {f.required && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                data-testid={`lead-${f.name}`}
                rows={3}
                required={f.required}
                value={form[f.name] || ""}
                onChange={set(f.name)}
                placeholder={f.placeholder || "Tell us about your legal practice or specific use cases..."}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            ) : f.type === "select" ? (
              <div className="relative">
                <select
                  data-testid={`lead-${f.name}`}
                  required={f.required}
                  value={form[f.name] || ""}
                  onChange={set(f.name)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Select option…</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : (
              <input
                data-testid={`lead-${f.name}`}
                type={f.type || "text"}
                required={f.required}
                value={form[f.name] || ""}
                onChange={set(f.name)}
                placeholder={f.placeholder || ""}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            )}
          </div>
        ))}
      </div>

      {useCases && useCases.length > 0 && (
        <div className="pt-1 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2.5">
            Primary Areas of Focus <span className="font-normal text-slate-400">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {useCases.map((c) => {
              const on = uc.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setUc(on ? uc.filter((x) => x !== c) : [...uc, c])}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                    on
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {on && <Check className="h-3 w-3 text-blue-400" />}
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 flex items-start gap-2.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          data-testid="lead-submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Scheduling Your Demo…</span>
            </>
          ) : (
            <>
              <span>{kind === "demo" ? "Request Personalised Demo" : "Submit Request"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-slate-400" /> 100% Confidential
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> DPDP Act 2023 Compliant
          </span>
        </div>
      </div>
    </form>
  );
}

export default LeadForm;
