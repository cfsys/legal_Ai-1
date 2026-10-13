import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";

// Crisp SVG social icons
const TwitterIcon = ({ className = "h-4.5 w-4.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ className = "h-4.5 w-4.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GithubIcon = ({ className = "h-4.5 w-4.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      ["AI Legal Research", "/ai-legal-research"],
      ["Judgment Search", "/judgment-search"],
      ["Documents", "/document-intelligence"],
      ["Drafting", "/legal-drafting"],
      ["Contract Review", "/contract-review"],
      ["Matter Management", "/matter-management"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Advocates", "/solutions/advocates"],
      ["Law Firms", "/solutions/law-firms"],
      ["Corporate Legal", "/solutions/corporate-legal"],
      ["CA & CS", "/solutions/ca-cs"],
      ["Students", "/solutions/students"],
      ["Universities", "/solutions/universities"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Contact Us", "/contact"],
      ["Careers", "/careers"],
      ["Partners", "/partners"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Blog", "/resources/blog"],
      ["Guides", "/resources/guides"],
      ["Legal Updates", "/resources/legal-updates"],
      ["Help Centre", "/resources/help"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Use", "/terms"],
      ["AI Disclaimer", "/ai-disclaimer"],
      ["Cookie Policy", "/cookie-policy"],
      ["Security", "/security"],
    ],
  },
];

const COLS = FOOTER_COLUMNS;

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-500 max-w-xs">Legal Intelligence. Reimagined. Research, analyse and draft with one intelligent workspace built for Indian law.</p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2026 Legal AI. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" aria-label="Twitter / X" className="hover:text-slate-700 transition-colors"><TwitterIcon /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-slate-700 transition-colors"><LinkedinIcon /></a>
            <a href="#" aria-label="GitHub" className="hover:text-slate-700 transition-colors"><GithubIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
