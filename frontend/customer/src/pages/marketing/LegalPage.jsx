import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Container } from "@/components/shared/ui";
import { usePageMeta } from "@/components/shared/ScrollToTop";
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Cookie, 
  Lock, 
  ExternalLink 
} from "lucide-react";

const LEGAL_TABS = [
  { key: "privacy", path: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { key: "terms", path: "/terms", label: "Terms of Use", icon: FileText },
  { key: "ai-disclaimer", path: "/ai-disclaimer", label: "AI Disclaimer", icon: AlertTriangle },
  { key: "cookie-policy", path: "/cookie-policy", label: "Cookie Policy", icon: Cookie },
  { key: "security", path: "/security", label: "Security Architecture", icon: Lock },
];

const DOCUMENTS = {
  privacy: {
    title: "Privacy Policy & Data Protection",
    updated: "Effective: October 2026",
    summary:
      "Legal AI is designed from the ground up for strict confidentiality. We comply with India's Digital Personal Data Protection Act (DPDP Act) 2023. Client briefs, confidential drafts, and uploaded documents are NEVER used to train shared AI models.",
    sections: [
      {
        heading: "1. Commitment to Advocate-Client Privilege",
        content: `Under Section 126 of the Indian Evidence Act, 1872 and corresponding provisions under the Bharatiya Sakshya Adhiniyam (BSA), 2023, communications between advocates and clients represent strictly privileged material. Legal AI provides technical and organizational guarantees ensuring that any legal drafts, petitions, case notes, or confidential evidence uploaded to your workspace maintain zero cross-tenant contamination.`,
      },
      {
        heading: "2. Zero AI Training on Confidential Customer Briefs",
        content: `We enforce a strict Zero-Retention-for-Training policy. Your case files, query prompts, extracted clauses, and uploaded pleadings are never ingested into foundation model training corpora, nor are they used to fine-tune public models. All inference passes through enterprise-grade, stateless inference endpoints.`,
      },
      {
        heading: "3. Categories of Information We Process",
        content: `We collect and process the following categories of information:
• Account Credentials: Name, email address, mobile number, bar council registration number (where verified), firm/organization name, and encrypted authentication tokens.
• Workspace Data: Matters, research sessions, uploaded files (PDFs, DOCX, scans), query logs, and drafted documents created within your tenant.
• Telemetry & System Logs: Masked IP addresses, browser user-agents, and performance diagnostics strictly used to ensure uptime and detect security anomalies.`,
      },
      {
        heading: "4. Digital Personal Data Protection Act (DPDP Act) 2023 Compliance",
        content: `As a Data Fiduciary and Processor under the DPDP Act 2023, Legal AI respects all statutory rights:
• Right to Access & Summary: Users can export all workspace documents and research transcripts at any time.
• Right to Correction & Erasure: Users can delete matters, documents, or their entire tenant profile permanently with immediate cryptographic purge.
• Grievance Redressal: You may contact our Data Protection Officer at privacy@legalai.in. Responses are provided within 72 business hours.`,
      },
      {
        heading: "5. Security Controls & Encryption Standard",
        content: `All communications with Legal AI are encrypted in transit using TLS 1.3 with forward secrecy. At rest, database records and document blobs are protected using AES-256 encryption with unique per-tenant keys managed via cloud hardware security modules (HSM).`,
      },
    ],
  },
  terms: {
    title: "Terms of Use & Service Agreement",
    updated: "Effective: October 2026",
    summary:
      "These terms govern your access to and use of Legal AI. By accessing or using the platform, you agree to be bound by these Terms of Use and comply with all applicable Indian laws and Bar Council of India guidelines.",
    sections: [
      {
        heading: "1. Eligibility & Professional License",
        content: `Legal AI is an enterprise and professional software service intended for advocates, legal practitioners, judicial clerks, law firms, chartered accountants, company secretaries, and in-house corporate counsel. By using the platform, you represent that you have legal capacity to enter into binding agreements.`,
      },
      {
        heading: "2. Assistive Technology & No Advocate-Client Relationship",
        content: `Legal AI provides computational intelligence, semantic retrieval, and draft synthesis tools. Use of Legal AI does NOT create an advocate-client relationship between Legal AI (or its affiliates) and any user. The platform does not substitute for the independent professional advice of a qualified legal practitioner enrolled with a State Bar Council.`,
      },
      {
        heading: "3. User Ownership of Intellectual Property",
        content: `You retain 100% full ownership, copyright, and title to all documents, pleadings, notices, briefs, and notes uploaded to or created within your workspace. Legal AI claims zero intellectual property rights over your proprietary work product or client matter records.`,
      },
      {
        heading: "4. Subscriptions, Seats, and Fair Usage",
        content: `Subscription plans grant specified seat quotas, AI computational credits, and storage capacity. Shared credentials across unauthorized third parties are strictly prohibited. Automated scraping or denial-of-service attempts against Legal AI's endpoints will result in immediate termination of the offending tenant.`,
      },
      {
        heading: "5. Governing Law and Dispute Resolution",
        content: `These terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these Terms shall be resolved by binding arbitration in New Delhi under the Arbitration and Conciliation Act, 1996, before a sole arbitrator appointed mutually by the parties. Courts in New Delhi retain exclusive jurisdiction.`,
      },
    ],
  },
  "ai-disclaimer": {
    title: "AI Accuracy & Assistive Technology Disclaimer",
    updated: "Effective: October 2026",
    summary:
      "Important notice regarding AI-assisted outputs: Legal AI generates computational predictions and synthesis based on Indian legal texts. Outputs must always be verified by an advocate before filing or submission in court.",
    sections: [
      {
        heading: "1. Nature of Generative Intelligence in Law",
        content: `Legal AI utilizes advanced machine learning models trained on published Supreme Court judgments, High Court decisions, Central and State Acts, and regulatory notifications. While our proprietary retrieval pipelines ground responses directly in statutory text and citations, machine learning models can occasionally produce incomplete, inaccurate, or outdated interpretations.`,
      },
      {
        heading: "2. Mandatory Human Verification Rule",
        content: `Under the Standards of Professional Conduct prescribed by the Bar Council of India under Chapter II, Part VI of the Bar Council of India Rules, an advocate owes an uncompromising duty to verify all authorities, case citations, and factual representations presented to any court or tribunal. Users must cross-verify all citations, ratios, and statutory provisions in our original judgment viewer before relying upon them in legal proceedings.`,
      },
      {
        heading: "3. Hallucination Detection & Citation Graphs",
        content: `To maximize reliability, Legal AI incorporates multi-agent verification checks and semantic citation graphs that cross-reference every cited judgment with official court repositories. Where an authority cannot be verified in the national judgment registry, the platform flags the reference with an uncertainty badge.`,
      },
      {
        heading: "4. Limitation of Liability for Court Submissions",
        content: `Under no circumstances shall Legal AI, its creators, engineers, or directors be liable for any procedural delays, adverse orders, contempt citations, cost impositions, or professional negligence claims arising from the unverified submission of AI-generated drafts or arguments in any court of law.`,
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy & Session Management",
    updated: "Effective: October 2026",
    summary:
      "Legal AI uses minimal, strictly necessary cookies and local storage tokens to ensure secure user authentication, workspace persistence, and tenant isolation.",
    sections: [
      {
        heading: "1. What are Cookies and Local Storage?",
        content: `Cookies and web storage technologies allow websites to store small pieces of structured information on your device. They allow our application to recognize your authenticated session, remember your UI preferences (such as dark mode or editor font size), and protect against Cross-Site Request Forgery (CSRF).`,
      },
      {
        heading: "2. Categories of Cookies We Use",
        content: `• Strictly Necessary Session Cookies: Essential for logging into your secure workspace, maintaining JWT tokens, and verifying tenant access boundaries.
• Functional & Preference Cookies: Store workspace settings, matter list view choices, and split-screen editor dimensions.
• Security & Fraud Prevention Tokens: Validate API request signatures and rate-limit anomalous requests.
• Zero Cross-Site Ad Tracking: We do not serve third-party advertising cookies or sell your browsing history to advertising networks.`,
      },
      {
        heading: "3. How to Manage Cookies",
        content: `You can configure your browser to block or alert you about cookies. However, disabling strictly necessary cookies will prevent you from logging in and accessing the authenticated Legal AI workspace.`,
      },
    ],
  },
  security: {
    title: "Security Architecture & Technical Safeguards",
    updated: "Effective: October 2026",
    summary:
      "Enterprise-grade defence-in-depth architecture designed for Indian litigation chambers, law firms, and in-house legal departments. Every client brief, matter record, and draft is protected with multi-tenant cryptographic isolation and zero AI training guarantees.",
    sections: [
      {
        heading: "1. Multi-Tenant Cryptographic Isolation",
        content: `Legal AI enforces strict logical and cryptographic tenant partitioning at both the application and database layers. Each law firm or enterprise tenant operates within an isolated namespace. Row-level access policies and per-tenant encryption keys ensure zero risk of cross-firm or cross-matter data leakage.`,
      },
      {
        heading: "2. Encryption Standards (In Transit & At Rest)",
        content: `• In Transit: All network communications are encrypted using Transport Layer Security (TLS 1.3) with ephemeral Diffie-Hellman key exchange and Perfect Forward Secrecy (PFS).
• At Rest: Database records, indices, and blob attachments (case briefs, petitions, contracts) are encrypted using Advanced Encryption Standard (AES-256) with automated key rotation managed through cloud hardware security modules (HSM).`,
      },
      {
        heading: "3. Stateless AI Inference & Zero Training Policy",
        content: `Your legal documents and search queries are NEVER utilized to train, fine-tune, or calibrate public or proprietary AI foundation models. All inference passes through dedicated enterprise endpoints operating under zero-data-retention contracts. Prompts and context documents are immediately purged from memory once the response stream terminates.`,
      },
      {
        heading: "4. Identity, Authentication & Role-Based Access Control (RBAC)",
        content: `• Multi-Factor Authentication (MFA): Mandatory two-factor verification using time-based one-time passwords (TOTP) or secure email dispatch.
• Enterprise SSO & SAML 2.0: Law firms can enforce central identity provisioning with Google Workspace, Microsoft Entra ID, or Okta.
• Granular RBAC: Permissions are restricted using numeric bitmasks controlling research, document access, drafting, and matter management privileges.`,
      },
      {
        heading: "5. Immutable Audit Trails & Continuous Backups",
        content: `Every document access, permission modification, export, and search is logged to an append-only, tamper-evident audit repository. Automated point-in-time database backups are encrypted and geo-replicated across Indian data centers with automated recovery verification.`,
      },
      {
        heading: "6. Indian Regulatory & Bar Council Standards",
        content: `Legal AI's security controls are aligned with the Information Technology Act, 2000, the Digital Personal Data Protection Act (DPDP Act), 2023, and the confidentiality guidelines of the Bar Council of India (BCI).`,
      },
    ],
  },
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace("/", "");
  const activeDoc = DOCUMENTS[slug] || DOCUMENTS.privacy;

  usePageMeta(activeDoc.title, `${activeDoc.title} — Legal AI.`);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 1rem' }}>
      <Container className="max-w-4xl">
        {/* Navigation Tabs - Modern Segmented Control without underlines */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '0.4rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              minWidth: 'max-content',
            }}
          >
            {LEGAL_TABS.map((tab) => {
              const isActive = pathname === tab.path;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.key}
                  to={tab.path}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 650 : 500,
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#0b1329' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    boxShadow: isActive ? '0 2px 4px rgba(11, 19, 41, 0.2)' : 'none',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Document Container */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '2.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Header */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                Official Legal & Compliance Policy
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                {activeDoc.updated}
              </span>
            </div>

            <h1
              style={{
                marginTop: '1rem',
                fontSize: '1.85rem',
                fontWeight: 750,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {activeDoc.title}
            </h1>

            {/* Summary Box */}
            <div
              style={{
                marginTop: '1.25rem',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '1.1rem 1.25rem',
                fontSize: '0.875rem',
                color: '#334155',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ display: 'block', marginBottom: '0.35rem', color: '#0f172a', fontWeight: 650 }}>
                Executive Summary:
              </strong>
              {activeDoc.summary}
            </div>
          </div>

          {/* Document Content Sections */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {activeDoc.sections.map((section, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.heading}
                </h2>
                <div
                  style={{
                    fontSize: '0.885rem',
                    color: '#475569',
                    lineHeight: 1.68,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Contact Note */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8rem',
              color: '#64748b',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, color: '#1e293b', margin: 0 }}>Legal AI Compliance & Regulatory Office</p>
              <p style={{ marginTop: '0.2rem', color: '#64748b', margin: 0 }}>Barakhamba Road, Connaught Place, New Delhi 110001 · compliance@legalai.in</p>
            </div>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            >
              Contact Legal Counsel <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
