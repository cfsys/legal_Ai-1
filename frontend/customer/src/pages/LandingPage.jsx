import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Check,
  Search,
  BookOpen,
  FileText,
  FileCheck,
  FolderGit2,
  PenTool,
  Shield,
  ShieldCheck,
  Lock,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  X,
  Database,
  KeyRound,
  History,
  CheckCircle2,
} from 'lucide-react';
import { showSuccess, showInfo } from '../utils/commonUtils';

const LandingPage = () => {
  const navigate = useNavigate();

  // Announcement bar state
  const [showBanner, setShowBanner] = useState(true);

  // Dropdown states for navigation
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Interactive Hero Preview state
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  // Workflow Pipeline active tab
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('Research');

  // Book a demo modal state
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', organisation: '', phone: '' });

  // Close demo modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showDemoModal) setShowDemoModal(false);
      }
    };
    if (showDemoModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDemoModal]);

  const samplePrompts = [
    {
      query: 'Find Supreme Court judgments on delay condonation under Section 5 of the Limitation Act.',
      answer:
        'Courts adopt a liberal, justice-oriented approach to condonation of delay. The leading authority holds that substantial justice must be preferred over technical considerations...',
      goodLaw: 'Collector, Land Acquisition v. Mst. Katiji · (1987) 2 SCC 107',
      distinguished: 'Esher Singh v. State of A.P. · (2004) 11 SCC 585',
      authoritiesCount: 5,
    },
    {
      query: 'What are the essential ingredients for dishonor of cheque under Section 138 NI Act?',
      answer:
        'Section 138 requires: (1) drawer drew cheque on account for debt, (2) presented within validity, (3) returned unpaid, (4) statutory demand notice served within 30 days, (5) failure to pay within 15 days...',
      goodLaw: 'Dashrath Rupsingh Rathod v. State of Maharashtra · (2014) 9 SCC 129',
      distinguished: 'K. Bhaskaran v. Sankaran Vaidhyan Balan · (1999) 7 SCC 510',
      authoritiesCount: 8,
    },
    {
      query: 'Enforceability of non-compete clauses in employment contracts under Section 27 of Indian Contract Act.',
      answer:
        'Post-termination negative covenants restricting employee freedom of profession are void under Section 27. Negative covenants during the active period of employment are permissible and valid...',
      goodLaw: 'Percept D’Mark (India) Pvt. Ltd. v. Zaheer Khan · (2006) 4 SCC 227',
      distinguished: 'Niranjan Shankar Golikari v. Century Spg. & Mfg. Co. · (1967) 2 SCR 378',
      authoritiesCount: 6,
    },
  ];

  const currentPrompt = samplePrompts[activePromptIndex];

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setShowDemoModal(false);
    showSuccess(`Thank you ${demoForm.name}! Our legal team will connect shortly for your guided demo.`, 'Demo Requested');
    setDemoForm({ name: '', email: '', organisation: '', phone: '' });
  };

  const workflowSteps = [
    { id: 'Ask', label: 'Ask', desc: 'State legal issues in plain English without complex boolean strings.' },
    { id: 'Research', label: 'Research', desc: 'AI queries Indian enactments, rules, and precedents in seconds.' },
    { id: 'Find Judgments', label: 'Find Judgments', desc: 'Pinpoint good law citations from Supreme Court and 25 High Courts.' },
    { id: 'Analyse Documents', label: 'Analyse Documents', desc: 'Upload case bundles, agreements and petitions for instant risk indexing.' },
    { id: 'Review Contracts', label: 'Review Contracts', desc: 'Identify missing clauses, uncapped indemnities and compliance pitfalls.' },
    { id: 'Draft', label: 'Draft', desc: 'Generate verified notices, SLPs, affidavits and contract clauses.' },
    { id: 'Organise in Matter', label: 'Organise in Matter', desc: 'Unite research, filings, cause lists and deadlines under one matter workspace.' },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {showBanner && (
        <div
          style={{
            backgroundColor: '#0b132b',
            color: '#ffffff',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={15} color="#60a5fa" />
            <span>Introducing Legal AI Deep Research</span>
            <button
              onClick={() => {
                showInfo('Legal AI Deep Research indexes across 75+ years of Supreme Court and High Court precedents.', 'Deep Research');
              }}
              style={{
                color: '#93c5fd',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                marginLeft: '0.25rem',
              }}
            >
              Learn More →
            </button>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              position: 'absolute',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. STICKY FROSTED NAVBAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.85rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.55rem',
              backgroundColor: '#0b1329',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Scale size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Legal <span style={{ color: '#2563eb' }}>AI</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Product Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveDropdown('product')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="landing-nav-link">
              <span>Product</span>
              <ChevronDown size={14} />
            </button>
            {activeDropdown === 'product' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '260px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.65rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                  padding: '0.6rem 0.4rem',
                  zIndex: 100,
                }}
              >
                {[
                  { name: 'AI Legal Research', desc: 'Statute & precedent discovery', icon: Sparkles },
                  { name: 'Judgment Search', desc: 'Citations & semantic query', icon: Search },
                  { name: 'Document Intelligence', desc: 'Summaries & clause extraction', icon: FileText },
                  { name: 'Contract Review', desc: 'Red flags & risk scoring', icon: FileCheck },
                  { name: 'Matter Management', desc: 'Unified case workspaces', icon: FolderGit2 },
                  { name: 'AI Drafting', desc: 'Court petitions & notices', icon: PenTool },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/login')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.45rem',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <item.icon size={16} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="landing-nav-link">
              <span>Solutions</span>
              <ChevronDown size={14} />
            </button>
            {activeDropdown === 'solutions' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '240px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.65rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                  padding: '0.6rem 0.4rem',
                  zIndex: 100,
                }}
              >
                {[
                  { name: 'Advocates & Counsel', icon: Scale },
                  { name: 'Law Firms', icon: Building },
                  { name: 'Corporate Legal', icon: Briefcase },
                  { name: 'CA / CS Advisors', icon: Users },
                  { name: 'Law Students & Faculty', icon: GraduationCap },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/login')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.45rem',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <s.icon size={16} color="#64748b" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href="#workflow" className="landing-nav-link">Resources</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
          <a href="#security" className="landing-nav-link">About</a>
        </nav>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
              padding: '0.5rem 0.85rem',
            }}
          >
            Login
          </button>

          <button
            onClick={() => setShowDemoModal(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              padding: '0.55rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            Book a Demo
          </button>

          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: '#0b1329',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.55rem 1.35rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 2px 6px rgba(11, 19, 41, 0.15)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0b1329')}
          >
            Start Free
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION WITH LIGHT GRID & INTERACTIVE PREVIEW */}
      <section className="bg-light-grid" style={{ padding: '4.5rem 2.5rem 5rem 2.5rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Hero Column */}
          <div>
            <div
              style={{
                display: 'inline-block',
                fontSize: '0.775rem',
                fontWeight: 700,
                color: '#2563eb',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              BUILT FOR INDIAN LEGAL PROFESSIONALS
            </div>

            <h1
              className="font-serif"
              style={{
                fontSize: '3.75rem',
                fontWeight: 700,
                lineHeight: 1.12,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              Legal Intelligence.<br />
              <span style={{ color: '#2563eb' }}>Reimagined.</span>
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                color: '#64748b',
                lineHeight: 1.6,
                maxWidth: '520px',
                marginBottom: '2.25rem',
              }}
            >
              Research Indian law, discover relevant judgments, analyse documents, review contracts and create legal drafts using one intelligent workspace.
            </p>

            {/* Hero Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#0b1329',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 4px 12px rgba(11, 19, 41, 0.2)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0b1329')}
              >
                <span>Start Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                Book a Demo
              </button>
            </div>

            
          </div>

          {/* Right Hero Product Card Mockup */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.6)',
              overflow: 'hidden',
            }}
          >
            {/* Window bar */}
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  fontSize: '0.775rem',
                  fontFamily: 'monospace',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.35rem',
                  border: '1px solid #f1f5f9',
                }}
              >
                legalai.in/app/research
              </div>
            </div>

            {/* Prompt Selector Pills */}
            <div style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Try Sample Legal Query:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {['Section 5 Limitation Act', 'Section 138 NI Act', 'Section 27 Contract Act'].map((tabLabel, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePromptIndex(idx)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: activePromptIndex === idx ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: activePromptIndex === idx ? '#eff6ff' : '#f8fafc',
                      color: activePromptIndex === idx ? '#1d4ed8' : '#64748b',
                    }}
                  >
                    {tabLabel}
                  </button>
                ))}
              </div>

              {/* Search query box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.65rem',
                  padding: '0.9rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '0.35rem',
                    backgroundColor: '#0b1329',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={14} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                  {currentPrompt.query}
                </div>
              </div>

              {/* AI Answer section */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  AI ANSWER
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.55 }}>
                  {currentPrompt.answer}
                </p>
              </div>

              {/* Citations Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '9999px' }}>
                      GOOD LAW
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                    {currentPrompt.goodLaw}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#d97706', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '1px 6px', borderRadius: '9999px' }}>
                      DISTINGUISHED
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                    {currentPrompt.distinguished}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar matching mockup */}
            <div
              style={{
                backgroundColor: '#0b1329',
                color: '#ffffff',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                <CheckCircle2 size={15} color="#4ade80" />
                <span>{currentPrompt.authoritiesCount} authorities · citation-backed</span>
              </div>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Save to Matter</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AUDIENCE PERSONA CARDS */}
      <section style={{ padding: '3.5rem 2.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.95rem', fontWeight: 500, marginBottom: '2rem' }}>
            Built for professionals who work with law every day.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Advocates', icon: Scale },
              { label: 'Law Firms', icon: Building },
              { label: 'Legal Departments', icon: Briefcase },
              { label: 'CA / CS Professionals', icon: Users },
              { label: 'Law Students', icon: GraduationCap },
              { label: 'Institutions', icon: Database },
            ].map((p, idx) => (
              <div key={idx} className="persona-card">
                <p.icon size={26} color="#475569" strokeWidth={1.75} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ONE CONNECTED WORKFLOW SECTION */}
      <section id="workflow" style={{ padding: '5rem 2.5rem', backgroundColor: '#fafbfc', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: '24px', height: '24px', border: '1.5px solid #0f172a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '4px', height: '4px', backgroundColor: '#0f172a', borderRadius: '50%' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            ONE CONNECTED WORKFLOW
          </div>

          <h2 className="font-serif" style={{ fontSize: '2.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
            From legal question to actionable answer.
          </h2>

          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            Legal AI connects every step of legal work into one intelligent, continuous flow.
          </p>

          {/* Connected Pipeline Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            {workflowSteps.map((step, idx) => {
              const isActive = activeWorkflowTab === step.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveWorkflowTab(step.id)}
                    style={{
                      padding: '0.45rem 1.15rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #0b1329' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#0b1329' : '#ffffff',
                      color: isActive ? '#ffffff' : '#475569',
                      transition: 'all 0.18s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(11, 19, 41, 0.15)' : 'none',
                    }}
                  >
                    {step.label}
                  </button>
                  {idx < workflowSteps.length - 1 && (
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Workflow Tab Explanation Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.85rem',
              padding: '2rem',
              maxWidth: '700px',
              margin: '0 auto',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Phase: {activeWorkflowTab}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              {workflowSteps.find((s) => s.id === activeWorkflowTab)?.desc}
            </div>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.5rem',
              }}
            >
              <span>Launch this workflow in workspace</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. DEEP DIVE FEATURE SHOWCASES (5 Alternating Sections) */}
      <section style={{ padding: '5rem 2.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          
          {/* Feature 1: AI Legal Research */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#0f172a', borderRadius: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1.25rem' }}>
                <Search size={20} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem' }}>
                Research legal issues in minutes, not hours.
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Ask questions in natural language and get citation-backed answers grounded in Indian statutes and case law.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  'Natural-language legal queries',
                  'Statute identification',
                  'Contrary authority detection',
                  'Case-law discovery',
                  'Citation-backed responses',
                  'Research memorandums',
                ].map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                    <Check size={16} color="#2563eb" strokeWidth={2.5} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <span>Explore AI Legal Research</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Feature 1 Card Preview */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <Search size={16} />
                <span>AI Legal Research</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Natural-language legal queries', 'Case-law discovery', 'Statute identification', 'Citation-backed responses', 'Contrary authority detection'].map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#1e293b' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                      <span>{item}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2: Judgment Search */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            {/* Feature 2 Card Preview (Left) */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <Scale size={16} />
                <span>Judgment Search</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Semantic search across Indian case law', 'Keyword & Boolean query parsing', 'Citation search (AIR, SCC, SCR)', 'Act & Section taxonomic filters', 'Court & Judge filters'].map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#1e293b' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0f172a' }} />
                      <span>{item}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 2 Details (Right) */}
            <div>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#0f172a', borderRadius: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1.25rem' }}>
                <Scale size={20} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem' }}>
                Find the judgment that wins your case.
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Uncover binding Supreme Court precedents and authoritative High Court rulings with precise legal taxonomy.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  'Semantic search',
                  'Citation search',
                  'Court & Judge filters',
                  'Keyword search',
                  'Act & Section filters',
                  'Date filters',
                ].map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                    <Check size={16} color="#2563eb" strokeWidth={2.5} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <span>Explore Judgment Search</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Feature 3: Document Intelligence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#0f172a', borderRadius: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1.25rem' }}>
                <FileText size={20} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem' }}>
                Turn legal documents into structured intelligence.
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Upload documents and ask questions, extract clauses, obligations, dates and parties, and build a case chronology.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  'Ask questions from documents',
                  'OCR text extraction',
                  'Obligation identification',
                  'Summarisation',
                  'Clause extraction',
                  'Important date extraction',
                ].map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                    <Check size={16} color="#2563eb" strokeWidth={2.5} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <span>Explore Document Intelligence</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Feature 3 Card Preview */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <FileText size={16} />
                <span>Document Intelligence</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Ask questions from documents', 'Summarisation', 'OCR and scanned document indexing', 'Clause extraction', 'Obligation identification'].map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#1e293b' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                      <span>{item}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 4: Matter Management */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            {/* Feature 4 Card Preview (Left) */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <FolderGit2 size={16} />
                <span>Matter Management</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Documents', 'Research', 'Drafts', 'Hearings', 'Chronology'].map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#1e293b' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0f172a' }} />
                      <span>{item}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 4 Details (Right) */}
            <div>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#0f172a', borderRadius: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1.25rem' }}>
                <FolderGit2 size={20} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem' }}>
                Keep research, documents and deadlines in one matter.
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Organise documents, research, drafts, hearings, chronology, tasks and your team inside a single matter workspace.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  'Documents',
                  'Drafts',
                  'Chronology',
                  'Research',
                  'Hearings',
                  'Tasks',
                ].map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                    <Check size={16} color="#2563eb" strokeWidth={2.5} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <span>Explore Matter Management</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "FOUR STEPS FROM QUESTION TO ACTION" */}
      <section style={{ padding: '5rem 2.5rem', backgroundColor: '#fafbfc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            HOW LEGAL AI WORKS
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '3.5rem', letterSpacing: '-0.02em' }}>
            Four steps from question to action.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
            {[
              { num: '01', title: 'Ask or Upload', desc: 'Ask a legal question or upload documents.' },
              { num: '02', title: 'Legal AI Analyses', desc: 'AI processes relevant statutes, precedents and documents.' },
              { num: '03', title: 'Review Sources', desc: 'Check judgments, citations and original documents.' },
              { num: '04', title: 'Take Action', desc: 'Save research, create drafts and organise into matters.' },
            ].map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="font-serif" style={{ fontSize: '2.75rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1, marginBottom: '1.25rem' }}>
                  {step.num}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {step.title}
                </div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.55 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ENTERPRISE-GRADE SECURITY GRID */}
      <section id="security" style={{ padding: '5.5rem 2.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            SECURITY
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '3.5rem', letterSpacing: '-0.02em' }}>
            Your legal work deserves enterprise-grade protection.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', textAlign: 'left', marginBottom: '2.5rem' }}>
            {[
              { title: 'Encryption', desc: 'TLS 1.3 in transit and AES-256 at rest across all workloads.', icon: Lock },
              { title: 'Tenant Separation', desc: 'Strict organisation-level data isolation between every tenant.', icon: ShieldCheck },
              { title: 'Role-Based Access', desc: 'Granular permissions mapped to Partner, Associate and Paralegal roles.', icon: Users },
              { title: 'Audit Logs', desc: 'Immutable activity trails for every sensitive action.', icon: History },
              { title: 'MFA', desc: 'Multi-factor authentication with enforced policies for organisations.', icon: KeyRound },
              { title: 'Secure Document Storage', desc: 'Confidential briefs stored with per-document access control.', icon: Database },
              { title: 'Access Control', desc: 'Least-privilege access with time-bound elevation.', icon: Shield },
              { title: 'Data Retention', desc: 'Configurable retention and deletion; zero AI training on client briefs.', icon: FileCheck },
            ].map((s, idx) => (
              <div key={idx} className="security-card">
                <s.icon size={20} color="#2563eb" style={{ marginBottom: '0.4rem' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{s.title}</div>
                <div style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              showInfo('Legal AI adheres to SOC-2 compliant and Indian digital data protection standards.', 'Security Standard');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.925rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
            }}
          >
            <span>Learn About Security</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* 9. TRANSPARENT PRICING TIERS */}
      <section id="pricing" style={{ padding: '5.5rem 2.5rem', backgroundColor: '#fafbfc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            PRICING
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Start free. Upgrade as your practice grows.
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '3.5rem' }}>
            Transparent plans for independent advocates, corporate legal teams and established law firms.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'left', marginBottom: '2.5rem' }}>
            {/* Plan 1 */}
            <div className="pricing-card">
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Individual</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>For independent professionals.</div>
                <div style={{ marginBottom: '2rem' }}>
                  <span className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a' }}>₹2,499</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/mo</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Start Free
              </button>
            </div>

            {/* Plan 2: POPULAR */}
            <div className="pricing-card popular">
              <span
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '2rem',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '2px 10px',
                  borderRadius: '9999px',
                }}
              >
                POPULAR
              </span>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Professional</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>For power users.</div>
                <div style={{ marginBottom: '2rem' }}>
                  <span className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a' }}>₹4,999</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/mo</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#0b1329',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Choose Plan
              </button>
            </div>

            {/* Plan 3 */}
            <div className="pricing-card">
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Law Firm</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>For legal teams.</div>
                <div style={{ marginBottom: '2rem' }}>
                  <span className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a' }}>₹7,999</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/mo</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Choose Plan
              </button>
            </div>

            {/* Plan 4 */}
            <div className="pricing-card">
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Enterprise</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>Custom deployment.</div>
                <div style={{ marginBottom: '2rem' }}>
                  <span className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a' }}>Custom</span>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              showInfo('Custom multi-seat licenses with dedicated SLA are available for enterprise legal teams.', 'Pricing Info');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.925rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
            }}
          >
            <span>Compare Plans</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* 10. BOTTOM DARK CTA BANNER WITH GRID */}
      <section className="bg-dark-grid" style={{ padding: '6.5rem 2.5rem', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="font-serif" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Work with law more intelligently.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
            Start researching, analysing and drafting with Legal AI.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: '#ffffff',
                color: '#0b1329',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              }}
            >
              Start Free
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '0.5rem',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* 11. 5-COLUMN PROFESSIONAL LEGAL FOOTER */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '5rem 2.5rem 3rem 2.5rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
            {/* Col 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.5rem',
                    backgroundColor: '#0b1329',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Scale size={18} />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                  Legal <span style={{ color: '#2563eb' }}>AI</span>
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '240px' }}>
                Legal Intelligence. Reimagined. Research, analyse and draft with one intelligent workspace built for Indian law.
              </p>
            </div>

            {/* Col 2: Product */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Product
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>AI Legal Research</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Judgment Search</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Documents</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Drafting</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Contract Review</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Matter Management</a>
              </div>
            </div>

            {/* Col 3: Solutions */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Solutions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Advocates</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Law Firms</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Corporate Legal</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>CA & CS</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Students</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Universities</a>
              </div>
            </div>

            {/* Col 4: Company */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Company
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
                <button onClick={() => setShowDemoModal(true)} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'inherit', font: 'inherit', cursor: 'pointer' }}>Contact Us</button>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Partners</a>
              </div>
            </div>

            {/* Col 5: Resources */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Resources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Guides</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Legal Updates</a>
                <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Help Centre</a>
              </div>
            </div>

            {/* Col 6: Legal */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Legal
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Use</a>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>AI Disclaimer</a>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Policy</a>
                <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.825rem' }}>
            <div>© 2026 Legal AI. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span>SOC-2 Certified Architecture</span>
              <span>•</span>
              <span>Indian Legal Data Sovereignty</span>
            </div>
          </div>
        </div>
      </footer>

      {/* BOOK A DEMO MODAL */}
      {showDemoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.85rem',
              padding: '2.25rem',
              width: '100%',
              maxWidth: '480px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <button
              onClick={() => setShowDemoModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={20} color="#64748b" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <Sparkles size={16} />
              <span>LEGAL AI WORKSPACE</span>
            </div>

            <h3 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Book a Guided Demo
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Experience AI legal research, judgment search, and automated contract review with our legal solutions specialist.
            </p>

            <form onSubmit={handleDemoSubmit}>
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem', display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adv. Rajesh Verma"
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem', display: 'block' }}>
                  Work / Professional Email
                </label>
                <input
                  type="email"
                  placeholder="name@firm.com"
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem', display: 'block' }}>
                    Organisation / Firm
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Veritas Law"
                    value={demoForm.organisation}
                    onChange={(e) => setDemoForm({ ...demoForm, organisation: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem', display: 'block' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Confirm Demo Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
