import { Search, Gavel, FileText, PenLine, ShieldAlert, Layers, Users, Building2, Briefcase, GraduationCap, School, Scale } from "lucide-react";

export const PRODUCTS = [
  { slug: "ai-legal-research", path: "/ai-legal-research", icon: Search, name: "AI Legal Research",
    tagline: "Research legal issues in minutes, not hours.",
    desc: "Ask questions in natural language and get citation-backed answers grounded in Indian statutes and case law.",
    features: ["Natural-language legal queries", "Case-law discovery", "Statute identification", "Citation-backed responses", "Contrary authority detection", "Research memorandums", "Multi-document analysis"] },
  { slug: "judgment-search", path: "/judgment-search", icon: Gavel, name: "Judgment Search",
    tagline: "Find the judgment that matters.",
    desc: "Semantic, keyword and citation search across the Supreme Court, High Courts and tribunals with precise filters.",
    features: ["Semantic search", "Keyword search", "Citation search", "Act & Section filters", "Court & Judge filters", "Date filters", "AI relevance ranking", "Important paragraph extraction"] },
  { slug: "document-intelligence", path: "/document-intelligence", icon: FileText, name: "Document Intelligence",
    tagline: "Turn legal documents into structured intelligence.",
    desc: "Upload documents and ask questions, extract clauses, obligations, dates and parties, and build a case chronology.",
    features: ["Ask questions from documents", "Summarisation", "OCR", "Clause extraction", "Obligation identification", "Important date extraction", "Party extraction", "Case chronology", "Citation extraction"] },
  { slug: "legal-drafting", path: "/legal-drafting", icon: PenLine, name: "Legal Drafting",
    tagline: "Draft with context, precedent and precision.",
    desc: "Generate notices, replies, petitions, affidavits and agreements from a split-screen editor with AI assistance.",
    features: ["Legal Notices", "Replies", "Petitions", "Affidavits", "Agreements", "NDA", "Service Agreements", "Written Statements", "MOU", "Employment Agreements"] },
  { slug: "contract-review", path: "/contract-review", icon: ShieldAlert, name: "Contract Review",
    tagline: "Know the risk before you sign.",
    desc: "Run AI contract review to surface risk scores, critical and missing clauses, and suggested alternative wording.",
    features: ["Overall Risk Score", "Critical Clauses", "Missing Clauses", "Suggested Changes", "Alternative Wording", "Review perspective control"] },
  { slug: "matter-management", path: "/matter-management", icon: Layers, name: "Matter Management",
    tagline: "Keep research, documents and deadlines in one matter.",
    desc: "Organise documents, research, drafts, hearings, chronology, tasks and your team inside a single matter workspace.",
    features: ["Documents", "Research", "Drafts", "Hearings", "Chronology", "Tasks", "Notes", "Team", "Timeline"] },
];

export const SOLUTIONS = [
  { slug: "advocates", path: "/solutions/advocates", icon: Scale, name: "For Advocates",
    headline: "Spend less time searching. More time building your case.",
    points: ["Legal research", "Judgments", "Drafting", "Document analysis", "Matter preparation", "Hearing preparation"] },
  { slug: "law-firms", path: "/solutions/law-firms", icon: Building2, name: "For Law Firms",
    headline: "One intelligent legal workspace for your entire firm.",
    points: ["Team research", "Shared matters", "Firm knowledge base", "Templates", "Role permissions", "Audit logs", "Usage analytics"] },
  { slug: "corporate-legal", path: "/solutions/corporate-legal", icon: Briefcase, name: "For Corporate Legal Teams",
    headline: "Legal intelligence for faster business decisions.",
    points: ["Contract review", "Agreement comparison", "Risk analysis", "Internal knowledge base", "Compliance research", "Matter tracking"] },
  { slug: "ca-cs", path: "/solutions/ca-cs", icon: Users, name: "For CA & CS Professionals",
    headline: "Company law, tax and compliance intelligence in one place.",
    points: ["Company law", "GST", "Tax", "IBC", "Compliance", "Legal notices", "Document analysis"] },
  { slug: "students", path: "/solutions/students", icon: GraduationCap, name: "For Law Students",
    headline: "Understand the law faster with AI-assisted study.",
    points: [
      { title: "Judgment Summaries", detail: "Get AI-generated summaries of landmark and recent judgments — facts, issues, ratio decidendi and final holding — so you can grasp an 80-page decision in a few minutes. Ideal for moot preparation, case comments and last-minute exam revision." },
      { title: "Case Research", detail: "Ask a legal question in plain English and receive citation-backed answers drawn from Supreme Court and High Court decisions. Perfect for assignments, projects and building arguments without spending hours in the library." },
      { title: "Acts & Sections", detail: "Look up any Indian statute and navigate it section by section, with plain-language explanations of each provision and the leading case law that interprets it — from the Constitution to the BNS, BNSS and BSA 2023." },
      { title: "Study Notes", detail: "Turn your research, saved judgments and readings into organised, searchable notes. Tag them by subject, revisit them before internals and semester exams, and never lose an important point again." },
      { title: "Citation Discovery", detail: "Find the exact authorities that support your arguments and see how cases connect through 'cited by' and 'relied on' links — so your submissions and papers rest on the strongest possible precedent." },
      { title: "Legal Concepts", detail: "Break down complex doctrines and principles — like the basic structure doctrine or promissory estoppel — into clear, example-led explanations written the way students actually learn." },
    ] },
  { slug: "universities", path: "/solutions/universities", icon: School, name: "For Universities",
    headline: "Institutional legal research for faculty and students.",
    points: ["Institutional subscriptions", "Student access", "Faculty access", "Research tools", "Usage dashboard", "Admin controls"] },
];

export const AUDIENCES = [
  { icon: Scale, label: "Advocates" }, { icon: Building2, label: "Law Firms" },
  { icon: Briefcase, label: "Legal Departments" }, { icon: Users, label: "CA / CS Professionals" },
  { icon: GraduationCap, label: "Law Students" }, { icon: School, label: "Institutions" },
];

export const PLANS = [
  { name: "Individual", price: "₹2,499", period: "/mo", desc: "For independent professionals.", cta: "Start Free",
    highlight: false, features: ["1 user", "500 AI credits / mo", "Judgment search", "200 document pages", "10 matters", "5 GB storage"] },
  { name: "Professional", price: "₹4,999", period: "/mo", desc: "For power users.", cta: "Choose Plan",
    highlight: true, features: ["1 user", "2,000 AI credits / mo", "Contract review", "1,000 document pages", "Unlimited matters", "50 GB storage", "Priority support"] },
  { name: "Law Firm", price: "₹7,999", period: "/mo", desc: "For legal teams.", cta: "Choose Plan",
    highlight: false, features: ["5+ users", "10,000 AI credits / mo", "Firm knowledge base", "Team collaboration", "Admin controls", "Audit logs", "500 GB storage"] },
  { name: "Enterprise", price: "Custom", period: "", desc: "Custom deployment.", cta: "Contact Sales",
    highlight: false, features: ["Unlimited users", "Custom AI credits", "SSO & SCIM", "API access", "On-prem option", "Dedicated support", "Custom retention"] },
];

export const PRICING_MATRIX = [
  ["AI Legal Research", true, true, true, true],
  ["Judgment Search", true, true, true, true],
  ["Monthly AI Credits", "500", "2,000", "10,000", "Custom"],
  ["Document Pages", "200", "1,000", "5,000", "Unlimited"],
  ["Contract Review", false, true, true, true],
  ["Draft Generation", true, true, true, true],
  ["Matters", "10", "Unlimited", "Unlimited", "Unlimited"],
  ["Storage", "5 GB", "50 GB", "500 GB", "Custom"],
  ["Team Members", "1", "1", "5+", "Unlimited"],
  ["Knowledge Base", false, false, true, true],
  ["Admin Controls", false, false, true, true],
  ["Audit Logs", false, false, true, true],
  ["API Access", false, false, false, true],
  ["Priority Support", false, true, true, true],
];

export const BLOG_POSTS = [
  { slug: "supreme-court-limitation-2026", category: "Case Research", title: "Reading delay condonation after the 2026 Limitation rulings",
    desc: "How recent Supreme Court decisions reshape the 'sufficient cause' standard under Section 5.", author: "Adv. Priya Nair", date: "12 Jun 2026", read: "7 min" },
  { slug: "ai-contract-review-india", category: "Contract Review Guides", title: "A practical framework for AI-assisted contract review in India",
    desc: "Where AI helps, where human judgment is essential, and how to build a reliable review workflow.", author: "Team Legal AI", date: "04 Jun 2026", read: "9 min" },
  { slug: "ibc-2016-primer", category: "Legal Guides", title: "IBC 2016: a fast primer for corporate legal teams",
    desc: "The insolvency resolution process, key timelines and the authorities that matter most.", author: "Adv. Rohan Gupta", date: "28 May 2026", read: "11 min" },
  { slug: "judgment-search-tips", category: "AI & Legal Research", title: "Ten ways to search judgments faster with semantic search",
    desc: "Move beyond keywords: retrieve authorities by legal issue, ratio and fact pattern.", author: "Team Legal AI", date: "19 May 2026", read: "6 min" },
  { slug: "legal-tech-2026", category: "Legal Technology", title: "The state of legal technology in India, 2026",
    desc: "Adoption trends across firms, corporates and academia — and what comes next.", author: "Team Legal AI", date: "10 May 2026", read: "8 min" },
  { slug: "drafting-notices", category: "Legal Guides", title: "Drafting airtight legal notices: a checklist",
    desc: "Structure, statutory references and tone for notices that hold up.", author: "Adv. Meera Iyer", date: "02 May 2026", read: "5 min" },
];

export const SECURITY_ITEMS = [
  { title: "Encryption", desc: "TLS 1.3 in transit and AES-256 at rest across all workloads." },
  { title: "Tenant Separation", desc: "Strict organisation-level data isolation between every tenant." },
  { title: "Role-Based Access", desc: "Granular permissions mapped to Partner, Associate and Paralegal roles." },
  { title: "Audit Logs", desc: "Immutable activity trails for every sensitive action." },
  { title: "MFA", desc: "Multi-factor authentication with enforced policies for organisations." },
  { title: "Secure Document Storage", desc: "Confidential briefs stored with per-document access control." },
  { title: "Access Control", desc: "Least-privilege access with time-bound elevation." },
  { title: "Data Retention", desc: "Configurable retention and deletion; zero AI training on client briefs." },
];

export const LEGAL_PAGES = {
  privacy: { title: "Privacy Policy", updated: "Updated 1 June 2026" },
  terms: { title: "Terms of Use", updated: "Updated 1 June 2026" },
  "ai-disclaimer": { title: "AI Disclaimer", updated: "Updated 1 June 2026" },
  "cookie-policy": { title: "Cookie Policy", updated: "Updated 1 June 2026" },
};
