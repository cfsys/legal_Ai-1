import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { PRODUCTS, SOLUTIONS } from "@/components/shared/marketingData";
import { Menu, X, ChevronDown } from "lucide-react";

export function MarketingHeader() {
  const [mobile, setMobile] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const MegaLink = ({ item }) => (
    <Link to={item.path} onClick={() => setOpenMenu(null)}
      data-testid={`mega-link-${item.slug}`}
      className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors">
      <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-700">
        <item.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-900">{item.name}</span>
        <span className="block text-xs text-slate-500 mt-0.5">{(item.tagline || item.headline || "").slice(0, 48)}</span>
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6e4dc] bg-[#f6f5f1]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenMenu(null)}>
              <div className="relative" onMouseEnter={() => setOpenMenu("product")}>
                <Link to="/features" data-testid="nav-product" className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 rounded-full transition-colors">
                  Services <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </Link>
                {openMenu === "product" && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-[560px] grid grid-cols-2 gap-1 rounded-2xl border border-stone-200 bg-white p-2.5 shadow-xl">
                      {PRODUCTS.map((p) => <MegaLink key={p.slug} item={p} />)}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" onMouseEnter={() => setOpenMenu("solutions")}>
                <Link to="/solutions" data-testid="nav-solutions" className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 rounded-full transition-colors">
                  Practice Areas <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </Link>
                {openMenu === "solutions" && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-[560px] grid grid-cols-2 gap-1 rounded-2xl border border-stone-200 bg-white p-2.5 shadow-xl">
                      {SOLUTIONS.map((p) => <MegaLink key={p.slug} item={p} />)}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/features" className="px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 rounded-full transition-colors">AI Precedents</Link>
              <Link to="/resources" className="px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 rounded-full transition-colors">Online Help</Link>
              <Link to="/pricing" className="px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 rounded-full transition-colors">Pricing</Link>
              <Link to="/about" className="px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 rounded-full transition-colors">About Us</Link>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" data-testid="nav-login" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950">Login</Link>
            <Link to="/demo" data-testid="nav-demo" className="px-5 py-2 text-xs font-semibold rounded-full border border-stone-300 bg-white text-slate-800 hover:bg-stone-50 transition-colors shadow-sm">Book a Consultation</Link>
            <Link to="/register" data-testid="nav-start-free" className="px-5 py-2 text-xs font-bold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-colors shadow-md">Contact</Link>
          </div>

          <button className="lg:hidden p-2 text-slate-700" data-testid="nav-mobile-toggle" onClick={() => setMobile(!mobile)}>
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Product</p>
          {PRODUCTS.map((p) => <Link key={p.slug} to={p.path} onClick={() => setMobile(false)} className="block px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50">{p.name}</Link>)}
          <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Solutions</p>
          {SOLUTIONS.map((p) => <Link key={p.slug} to={p.path} onClick={() => setMobile(false)} className="block px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50">{p.name}</Link>)}
          <Link to="/resources" onClick={() => setMobile(false)} className="block px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50">Resources</Link>
          <Link to="/pricing" onClick={() => setMobile(false)} className="block px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50">Pricing</Link>
          <Link to="/about" onClick={() => setMobile(false)} className="block px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50">About</Link>
          <div className="flex gap-2 pt-3">
            <button onClick={() => { setMobile(false); navigate("/login"); }} className="flex-1 py-2 text-sm font-medium rounded-lg border border-slate-200">Login</button>
            <button onClick={() => { setMobile(false); navigate("/register"); }} className="flex-1 py-2 text-sm font-medium rounded-lg bg-slate-900 text-white">Start Free</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default MarketingHeader;
