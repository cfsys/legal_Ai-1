import React, { useEffect } from "react";
import { X, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { LeadForm } from "./LeadForm";

const DEMO_FIELDS = [
  { name: "name", label: "Full Name", required: true },
  { name: "email", label: "Work Email", type: "email", required: true },
  { name: "mobile", label: "Mobile / Phone" },
  { name: "organisation", label: "Law Firm / Company", required: true },
  { name: "role", label: "Designation / Role" },
  {
    name: "orgSize",
    label: "Team Size",
    type: "select",
    options: ["Solo Advocate", "2-10 Lawyers", "11-50 Lawyers", "51-200 Team", "200+ Enterprise"],
  },
  { name: "demoDate", label: "Preferred Date", type: "date" },
  { name: "message", label: "Specific Areas of Interest or Questions", type: "textarea", full: true },
];

const USE_CASES = [
  "AI Legal Research",
  "Supreme Court & HC Judgments",
  "Document Intelligence & OCR",
  "Contract Review & Risk Scoring",
  "Automated Legal Drafting",
  "Matter Workspace",
];

export function BookDemoModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="book-demo-modal"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            data-testid="modal-close-button"
            aria-label="Close demo modal"
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Live Guided Demonstration
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            See Legal AI in Action
          </h2>
          <p className="mt-1.5 text-sm text-slate-300 max-w-lg leading-relaxed">
            Fill in your details below. Our legal-tech specialists will demonstrate live citation graphs, Indian judgment retrieval, and document intelligence tailored to your workflows.
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> 30-Minute Custom Walkthrough
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Instant Calendar Invite
            </span>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          <LeadForm kind="demo" fields={DEMO_FIELDS} useCases={USE_CASES} />
        </div>
      </div>
    </div>
  );
}

export default BookDemoModal;
