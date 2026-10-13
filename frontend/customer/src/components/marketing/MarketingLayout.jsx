import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { X, Sparkles } from "lucide-react";

export function MarketingLayout() {
  const [announce, setAnnounce] = useState(true);
  const [cookie, setCookie] = useState(!localStorage.getItem("legalai_cookie"));

  const dismissCookie = (v) => { localStorage.setItem("legalai_cookie", v); setCookie(false); };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5f1]">
      <MarketingHeader />
      <main className="flex-1"><Outlet /></main>
      <MarketingFooter />

      {cookie && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-xl border border-slate-200 bg-white shadow-2xl p-5" data-testid="cookie-banner">
          <p className="text-sm font-semibold text-slate-900">We value your privacy</p>
          <p className="mt-1 text-xs text-slate-500">We use cookies to improve your experience. Choose how we use them.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button data-testid="cookie-accept" onClick={() => dismissCookie("all")} className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer">Accept All</button>
            <button data-testid="cookie-necessary" onClick={() => dismissCookie("necessary")} className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Necessary Only</button>
            <Link to="/cookie-policy" className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Manage Preferences</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketingLayout;
