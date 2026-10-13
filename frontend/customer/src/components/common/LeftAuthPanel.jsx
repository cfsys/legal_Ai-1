import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Sparkles, ArrowRight, ShieldCheck, Star, Lock } from 'lucide-react';
import { APP_STRINGS } from '../../constants/appStrings';

const LeftAuthPanel = () => {
  return (
    <div className="auth-left bg-grid-pattern" style={{ overflow: 'hidden', contain: 'paint' }}>
      {/* Ambient background glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, rgba(139, 92, 246, 0) 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Logo & Badge */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Subtle Pill Tag */}
        <div style={{ marginBottom: '0.75rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(37, 99, 235, 0.18)',
              border: '1px solid rgba(96, 165, 250, 0.35)',
              color: '#93c5fd',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              letterSpacing: '0.03em',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={11} color="#60a5fa" />
            <span>{APP_STRINGS.BRAND.TAGLINE}</span>
          </span>
        </div>

        {/* Brand Header linking to Homepage */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          title="Return to Legal AI Homepage"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070e24',
              boxShadow: '0 8px 20px -3px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Scale size={22} strokeWidth={2.4} />
          </div>
          <div>
            <span className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              Legal <span style={{ color: '#60a5fa' }}>AI</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.04em', fontWeight: 500 }}>
              LEGAL INTELLIGENCE SUITE
            </span>
          </div>
        </Link>

        {/* Hero Title */}
        <h1
          className="font-serif"
          style={{
            fontSize: '2.5rem',
            lineHeight: 1.12,
            fontWeight: 700,
            marginBottom: '0.65rem',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
          }}
        >
          {APP_STRINGS.BRAND.SLOGAN_LINE1}<br />
          <span
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {APP_STRINGS.BRAND.SLOGAN_LINE2}
          </span>
        </h1>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            maxWidth: '520px',
            lineHeight: 1.5,
            marginBottom: '1rem',
          }}
        >
          {APP_STRINGS.BRAND.HERO_SUBTITLE}
        </p>

        {/* Floating Mock Browser Card */}
        <div className="browser-preview-card" style={{ marginTop: '0.5rem', maxWidth: '520px', width: '100%' }}>
          {/* Browser Window Bar */}
          <div className="browser-header" style={{ padding: '0.6rem 0.95rem' }}>
            <div className="browser-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="browser-url-pill" style={{ padding: '0.25rem 0.75rem', fontSize: '0.725rem' }}>
              <Lock size={11} color="#2563eb" style={{ marginRight: '4px' }} />
              <span>legalai.in/app/research</span>
            </div>
          </div>

          {/* Browser Inner Content */}
          <div style={{ padding: '0.95rem' }}>
            {/* Search Query Pill */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1.5px solid #bfdbfe',
                borderRadius: '0.5rem',
                padding: '0.45rem 0.75rem',
                fontSize: '0.775rem',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={13} color="#2563eb" />
              <span style={{ fontWeight: 600 }}>Query:</span>
              <span style={{ color: '#475569' }}>Section 5 Limitation Act condonation principles</span>
            </div>

            {/* AI Answer Card */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '0.6rem',
                padding: '0.75rem 0.9rem',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e40af', letterSpacing: '0.03em' }}>
                  LEGAL AI LEGAL REASONING ENGINE
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: '#1e293b', lineHeight: 1.45, fontWeight: 500 }}>
                Under Section 5, <strong>"sufficient cause"</strong> receives a liberal construction where no gross negligence or lack of bona fides is imputable to the litigant.
              </p>
            </div>

            {/* Authorities Mini Cards */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <div
                style={{
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.55rem 0.7rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <span className="badge-good-law" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>✔ GOOD LAW</span>
                </div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>
                  Collector, Land Acquisition v. Mst. Katiji
                </div>
                <div style={{ fontSize: '0.675rem', color: '#2563eb', fontWeight: 600, marginTop: '0.15rem' }}>
                  (1987) 2 SCC 107
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.55rem 0.7rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <span className="badge-good-law" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>✔ GOOD LAW</span>
                </div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>
                  Perumon Bhagvathy Devaswom
                </div>
                <div style={{ fontSize: '0.675rem', color: '#2563eb', fontWeight: 600, marginTop: '0.15rem' }}>
                  (2008) 8 SCC 321
                </div>
              </div>
            </div>
          </div>

          {/* Dark Bar at bottom of card */}
          <div
            style={{
              background: 'linear-gradient(180deg, #0d162d 0%, #060b18 100%)',
              padding: '0.65rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#93c5fd', fontWeight: 500 }}>
              <ShieldCheck size={14} color="#60a5fa" />
              <span>5 authorities · citation-backed</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>Save to Matter</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof & Trust Footer */}
      <div style={{ marginTop: '1.25rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#facc15', fontSize: '0.75rem', fontWeight: 600 }}>
            <Star size={12} fill="#facc15" />
            <Star size={12} fill="#facc15" />
            <Star size={12} fill="#facc15" />
            <Star size={12} fill="#facc15" />
            <Star size={12} fill="#facc15" />
            <span style={{ color: '#ffffff', marginLeft: '0.25rem' }}>4.9/5</span>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>10,000+ Advocates</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>256-Bit Encryption</span>
        </div>

        {/* Footer Copyright */}
        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>{APP_STRINGS.BRAND.COPYRIGHT}</span>
        </div>
      </div>
    </div>
  );
};

export default LeftAuthPanel;
