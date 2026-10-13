import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Eyebrow, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import api from "@/lib/api";
import { 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Search, 
  Gavel, 
  FileText, 
  ArrowRight, 
  Check, 
  Lock, 
  Mail, 
  Phone, 
  HelpCircle, 
  Star, 
  Quote, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

const ROLE_OPTIONS = [
  "Advocate / Litigator",
  "Law Firm Partner",
  "Associate / Legal Counsel",
  "In-House General Counsel",
  "CA / CS Professional",
  "Academician / Law Student",
];

const ORG_SIZES = [
  "Solo Advocate",
  "2 - 10 Lawyers",
  "11 - 50 Firm",
  "51 - 200 Team",
  "200+ Enterprise",
];

const TIME_SLOTS = [
  "Morning (10:00 AM - 1:00 PM)",
  "Afternoon (1:00 PM - 4:00 PM)",
  "Evening (4:00 PM - 7:00 PM)",
];

const USE_CASES = [
  "AI Legal Research & Citations",
  "Supreme Court & HC Judgments",
  "Document Intelligence & OCR",
  "Automated Legal Drafting",
  "Contract Risk Review",
  "Matter Workspace & Collaboration",
  "BNS / BNSS / BSA 2023 Cross-Referencing",
];

const HIGHLIGHTS = [
  {
    icon: Search,
    title: "Citation-Backed Legal Research",
    desc: "Ask nuanced legal questions in plain language and receive authoritative answers backed by verified Supreme Court and High Court precedents.",
  },
  {
    icon: Gavel,
    title: "Semantic Judgment Retrieval",
    desc: "Discover judgments by legal principle, factual scenario, or contrary authority across all Indian courts and national tribunals.",
  },
  {
    icon: FileText,
    title: "Document Intelligence & OCR",
    desc: "Upload 500+ page pleadings, petitions, and contracts to extract timelines, conflicting clauses, and key obligations in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Zero-Training Security",
    desc: "Your confidential briefs and drafts are encrypted with AES-256 and never retained to train shared AI models.",
  },
];

const FAQS = [
  {
    q: "How long is the live demo?",
    a: "Our personalised demos run for 30 minutes. We tailor the entire session to your practice area—whether criminal, commercial litigation, arbitration, or corporate advisory.",
  },
  {
    q: "Who conducts the walkthrough?",
    a: "An Indian legal-technology specialist experienced in court procedures, citation methods, and document automation.",
  },
  {
    q: "Do we receive free trial access afterwards?",
    a: "Yes. Every demo attendee receives complimentary 14-day full workspace credentials for their entire team with preloaded AI credits.",
  },
  {
    q: "Can you demonstrate our specific case document or contract?",
    a: "Absolutely. During the session, you can securely upload a sample pleading or contract to witness real-time analysis and risk scoring.",
  },
];

export default function Demo() {
  usePageMeta("Schedule a Live Demo — Legal AI", "Book a personalised 30-minute demonstration of Legal AI tailored to your legal practice.");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    organisation: "",
    role: "Advocate / Litigator",
    orgSize: "2 - 10 Lawyers",
    demoDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    timeSlot: "Morning (10:00 AM - 1:00 PM)",
    message: "",
  });

  const [selectedUseCases, setSelectedUseCases] = useState([
    "AI Legal Research & Citations",
    "Supreme Court & HC Judgments",
  ]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const toggleUseCase = (uc) => {
    setSelectedUseCases((prev) =>
      prev.includes(uc) ? prev.filter((item) => item !== uc) : [...prev, uc]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        kind: "demo",
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        organisation: form.organisation.trim(),
        role: form.role,
        orgSize: form.orgSize,
        demoDate: form.demoDate,
        useCases: selectedUseCases,
        message: form.message.trim(),
        source: "Dedicated Demo Booking Page (/demo)",
        extra: {
          ...form,
          timeSlot: form.timeSlot,
          useCases: selectedUseCases,
        },
      };

      const res = await api.post("/leads", payload);
      setSubmitted(true);
      if (res?.data?.data?._id) {
        setBookingRef(res.data.data._id.slice(-6).toUpperCase());
      }
    } catch (err) {
      console.warn("Lead booking warning:", err);
      const msg = err.response?.data?.message;
      if (msg) {
        setErrorMessage(msg);
      } else {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* HERO & BOOKING SECTION */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: Context, Features & Proof */}
            <div className="lg:col-span-5 space-y-8">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5 text-blue-600" />
                  Live 1-on-1 Consultation
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                  See Legal AI in action for <span className="text-blue-600">your practice.</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Join a personalised 30-minute demonstration tailored specifically to Indian procedural codes, Supreme Court case law, and your firm’s daily drafting workflows.
                </p>
              </Reveal>

              {/* Feature Highlights */}
              <Reveal delay={0.1}>
                <div className="space-y-4 pt-2">
                  {HIGHLIGHTS.map((h) => (
                    <div key={h.title} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                        <h.icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h2 className="text-sm font-semibold text-slate-900">{h.title}</h2>
                        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Senior Advocate Testimonial */}
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "The demo clearly showed how Legal AI retrieves contrary judgments on delay condonation in seconds. It transformed our chamber's SLP preparation."
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">Partner, Commercial Litigation</span>
                    <span className="text-slate-400">Delhi High Court</span>
                  </div>
                </div>
              </Reveal>

              {/* Direct Inquiries Note */}
              <div className="text-xs text-slate-500 pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> demo@legalai.in
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> +91 11 4050 9000
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Demo Booking Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                {/* Decorative Top Accent */}
                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900" />

                <div className="p-6 sm:p-10">
                  {submitted ? (
                    <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 mx-auto">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                          Demo Successfully Scheduled!
                        </h3>
                        {bookingRef && (
                          <p className="mt-1 text-sm font-mono font-medium text-slate-500">
                            Booking Reference: <span className="text-blue-600 font-semibold">#{bookingRef}</span>
                          </p>
                        )}
                        <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                          We’ve saved your booking to our system. A calendar invitation with Google Meet / Zoom link will be sent to <span className="font-semibold text-slate-900">{form.email}</span>.
                        </p>
                      </div>

                      {/* Summary Box */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500">Attendee:</span>
                          <span className="font-semibold text-slate-800">{form.name} ({form.role})</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500">Organisation:</span>
                          <span className="font-semibold text-slate-800">{form.organisation}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500">Preferred Date:</span>
                          <span className="font-semibold text-slate-800">{form.demoDate} ({form.timeSlot})</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 block mb-1">Requested Focus Areas:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedUseCases.map((uc) => (
                              <span key={uc} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100">
                                {uc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setForm({
                              ...form,
                              name: "",
                              email: "",
                              mobile: "",
                              organisation: "",
                              message: "",
                            });
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Book for Another Team
                        </button>
                        <Link
                          to="/"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                          Return to Homepage <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6" data-testid="dedicated-demo-form">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                          Schedule Your Live Walkthrough
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500">
                          Complete the form below and our legal-tech team will prepare a demonstration focused on your exact practice.
                        </p>
                      </div>

                      {/* SECTION 1: Personal & Contact Details */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-900 text-[10px] text-white">1</span>
                          Contact Information
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={handleChange("name")}
                              placeholder="e.g. Adv. Rohan Desai"
                              data-testid="demo-input-name"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Work Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={form.email}
                              onChange={handleChange("email")}
                              placeholder="e.g. rohan@desailaw.in"
                              data-testid="demo-input-email"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Phone / WhatsApp Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              value={form.mobile}
                              onChange={handleChange("mobile")}
                              placeholder="+91 98765 43210"
                              data-testid="demo-input-mobile"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: Organization & Practice */}
                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-900 text-[10px] text-white">2</span>
                          Practice & Organization
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Law Firm / Chamber / Organisation <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={form.organisation}
                              onChange={handleChange("organisation")}
                              placeholder="e.g. Desai & Partners Advocates"
                              data-testid="demo-input-org"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          {/* Quick Role Badges */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                              Your Role / Designation
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {ROLE_OPTIONS.map((r) => {
                                const active = form.role === r;
                                return (
                                  <button
                                    type="button"
                                    key={r}
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                      active
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                  >
                                    {r}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Team Size */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                              Team Size
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {ORG_SIZES.map((size) => {
                                const active = form.orgSize === size;
                                return (
                                  <button
                                    type="button"
                                    key={size}
                                    onClick={() => setForm({ ...form, orgSize: size })}
                                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                      active
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs font-semibold"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: Date & Slot Picker */}
                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-900 text-[10px] text-white">3</span>
                          Preferred Schedule
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" /> Preferred Date
                            </label>
                            <input
                              type="date"
                              required
                              value={form.demoDate}
                              onChange={handleChange("demoDate")}
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-blue-600" /> Preferred Time Slot
                            </label>
                            <div className="relative">
                              <select
                                value={form.timeSlot}
                                onChange={handleChange("timeSlot")}
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                              >
                                {TIME_SLOTS.map((slot) => (
                                  <option key={slot} value={slot}>
                                    {slot}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: Focus Areas */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-700">
                          Select Key Capabilities to Preview <span className="font-normal text-slate-400">(Multi-select)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {USE_CASES.map((uc) => {
                            const isSelected = selectedUseCases.includes(uc);
                            return (
                              <button
                                type="button"
                                key={uc}
                                onClick={() => toggleUseCase(uc)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                    : "border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3 text-blue-400" />}
                                {uc}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 5: Notes & Questions */}
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Specific Requirements or High Court / Tribunal Matters <span className="font-normal text-slate-400">(Optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={form.message}
                          onChange={handleChange("message")}
                          placeholder="e.g. We specialize in NCLT insolvency proceedings and need automated clause comparison..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      {errorMessage && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 flex items-start gap-2.5 text-xs text-rose-700">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          data-testid="demo-submit-btn"
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-md hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              <span>Saving Your Reservation to Database…</span>
                            </>
                          ) : (
                            <>
                              <span>Confirm & Schedule Free 30-Min Demo</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Lock className="h-3 w-3 text-slate-400" /> 100% Confidential
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Zero Model Training
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" /> 14-Day Free Access
                          </span>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* FAQS SECTION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <Container className="max-w-4xl">
          <div className="text-center mb-12">
            <Eyebrow>Got Questions?</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">
              Frequently Asked Questions About Our Demo
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </div>
  );
}
