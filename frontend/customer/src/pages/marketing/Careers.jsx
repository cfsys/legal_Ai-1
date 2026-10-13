import React, { useState } from "react";
import { Container, SectionHeading, Eyebrow, CTASection } from "@/components/shared/ui";
import { Reveal } from "@/components/shared/Reveal";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { LeadForm } from "@/components/marketing/LeadForm";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Scale, 
  HeartHandshake, 
  Laptop, 
  GraduationCap,
  X 
} from "lucide-react";

const DEPARTMENTS = ["All", "Engineering", "AI Research", "Legal Knowledge", "Product & Design"];

const JOBS = [
  {
    id: "eng-fullstack",
    title: "Senior Full Stack Engineer (React, Node, Python)",
    department: "Engineering",
    location: "Bengaluru, Karnataka / Hybrid",
    type: "Full-Time",
    experience: "4-7 Years",
    desc: "Architect and scale high-throughput legal intelligence workspaces, document viewer pipelines, and real-time collaboration features.",
    tags: ["React 19", "Vite", "Node.js", "Python", "MongoDB", "Redis"],
  },
  {
    id: "ai-rag-scientist",
    title: "Applied AI / RAG Research Scientist",
    department: "AI Research",
    location: "Bengaluru / Remote (India)",
    type: "Full-Time",
    experience: "3-6 Years",
    desc: "Develop state-of-the-art retrieval-augmented generation models tuned specifically on Indian Supreme Court, High Court, and statutory jurisprudence.",
    tags: ["PyTorch", "HuggingFace", "Vector DBs", "RAG", "Legal NLP"],
  },
  {
    id: "legal-knowledge-eng",
    title: "Legal Knowledge Engineer / Senior Advocate",
    department: "Legal Knowledge",
    location: "New Delhi (Near Supreme Court) / Hybrid",
    type: "Full-Time",
    experience: "5+ Years PQE",
    desc: "Curate ground-truth legal citations, evaluate AI reasoning against Indian procedural codes (CPC, CrPC, BNSS, BSA), and design legal benchmark datasets.",
    tags: ["Bar Council of India", "Litigation", "Case Law", "Statutory Analysis"],
  },
  {
    id: "prod-designer",
    title: "Senior Product Designer (Complex SaaS)",
    department: "Product & Design",
    location: "Bengaluru / Remote",
    type: "Full-Time",
    experience: "4+ Years",
    desc: "Craft dense, distraction-free typography and workflow experiences for lawyers, law clerks, corporate counsels, and judges.",
    tags: ["Figma", "Design Systems", "Dense Information Architecture"],
  },
  {
    id: "legal-informatics",
    title: "Legal Informatics & Metadata Specialist",
    department: "Legal Knowledge",
    location: "New Delhi / Remote",
    type: "Full-Time",
    experience: "2-5 Years",
    desc: "Structure gazettes, notifications, amended acts, and multi-bench judgment taxonomies across 25 High Courts in India.",
    tags: ["Taxonomy", "e-Courts API", "Judicial Data", "Corpus Management"],
  },
  {
    id: "eng-infra",
    title: "Security & Cloud Infrastructure Engineer",
    department: "Engineering",
    location: "Bengaluru / Hybrid",
    type: "Full-Time",
    experience: "4-8 Years",
    desc: "Maintain ISO 27001-ready zero-trust architecture, VPC isolation for enterprise law firms, and confidential compute clusters.",
    tags: ["AWS", "Docker", "Kubernetes", "AES-256", "DPDP Act"],
  },
];

const PERKS = [
  { icon: Cpu, title: "Cutting-Edge Compute", desc: "Access dedicated H100 GPU clusters and build state-of-the-art legal intelligence." },
  { icon: HeartHandshake, title: "Top-Tier Family Health", desc: "Comprehensive 100% employer-covered health and wellness insurance for you and your family." },
  { icon: Laptop, title: "Hardware Stipend", desc: "Your choice of top-spec MacBook Pro or workstation plus custom ergonomic home setup." },
  { icon: GraduationCap, title: "Learning & Legal Conferences", desc: "Annual budget for AI research publications, legal conferences, and continuous education." },
  { icon: Scale, title: "Meaningful Impact", desc: "Transform how justice and legal research operate across India's judicial ecosystem." },
  { icon: ShieldCheck, title: "Generous Equity", desc: "Be an owner from day one with transparent ESOPs and performance incentives." },
];

export default function Careers() {
  usePageMeta("Careers at Legal AI", "Join the team building India's premier AI legal intelligence workspace.");
  const [selectedDept, setSelectedDept] = useState("All");
  const [applyingJob, setApplyingJob] = useState(null);

  const filteredJobs = selectedDept === "All" 
    ? JOBS 
    : JOBS.filter((j) => j.department === selectedDept);

  const applyFields = [
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "mobile", label: "Mobile / WhatsApp", required: true },
    { name: "organisation", label: "Current Company / Law Firm", required: true },
    { name: "role", label: "Current Title / Years of Experience", required: true },
    { name: "message", label: "LinkedIn URL, Portfolio / GitHub, or Note", type: "textarea", full: true },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="h-3.5 w-3.5" /> We're Hiring Across India
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                Build the future of <span className="text-blue-400">Indian Law</span> with AI.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                Legal AI is uniting legal scholars, senior advocates, and machine learning researchers to solve the greatest information challenge in the Indian judicial system.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" /> Bengaluru & New Delhi Hubs
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" /> Hybrid & Remote Flexibility
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-amber-400" /> {JOBS.length} Open Positions
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* WHY JOIN US / PERKS */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <Container>
          <SectionHeading
            center
            eyebrow="Culture & Benefits"
            title="Why top engineers and advocates choose Legal AI."
            subtitle="We provide an environment where high-caliber talent solves hard, foundational problems."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="bg-white rounded-xl border border-slate-200 p-6 h-full shadow-sm hover:border-slate-300 transition-colors">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* OPEN POSITIONS */}
      <section className="py-24" id="open-roles">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <Eyebrow>Join The Mission</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">
                Current Job Openings
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Explore open roles across our engineering, research, and legal departments.
              </p>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedDept === dept
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <div className="mt-8 space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {job.department}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {job.type} ({job.experience})
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{job.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(job)}
                    data-testid={`apply-btn-${job.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* JOB APPLICATION MODAL */}
      {applyingJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setApplyingJob(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="text-xs font-mono uppercase text-blue-400">{applyingJob.department}</span>
              <h2 className="text-2xl font-semibold mt-1">Apply for {applyingJob.title}</h2>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {applyingJob.location} • {applyingJob.type}
              </p>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <LeadForm
                kind="career"
                fields={applyFields}
                useCases={["Immediate Joining", "30 Days Notice", "60 Days Notice"]}
              />
            </div>
          </div>
        </div>
      )}

      <CTASection />
    </div>
  );
}
