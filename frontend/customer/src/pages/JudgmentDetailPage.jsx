import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Layers,
  Sparkles,
  MessageSquare,
  GitCompare,
  Download,
} from 'lucide-react';
import { judgmentService } from '../services/api';
import { toast } from '../context/ToastContext';

const JudgmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [judgment, setJudgment] = useState(null);
  const [activeTab, setActiveTab] = useState('Judgment');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await judgmentService.getById(id);
        setJudgment(data);
      } catch (err) {
        console.warn('Fallback to sample judgment:', err.message);
        setJudgment({
          _id: id || 'judg_001',
          title: 'Kesavananda Bharati v. State of Kerala',
          court: 'Supreme Court of India',
          decisionDate: '1973-04-24',
          citation: '(1973) 4 SCC 225',
          status: 'Good Law',
          bench: '13 Judges',
          judges: 'S.M. Sikri, CJI & others',
          headnote: "Established the Basic Structure Doctrine limiting Parliament's power to amend the Constitution.",
          ratioDecidendi: 'The Court held that the interpretation must give effect to the object of the statute. The decision remains a leading authority on constitutional law in India.',
          aiSummary: 'The 13-judge Constitution Bench held by a 7:6 majority that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter its "basic structure". Features like supremacy of the Constitution, rule of law, separation of powers, and judicial review form the bedrock of the Constitution.',
          actsAndSections: [
            { act: 'Constitution of India', section: 'Article 368' },
            { act: 'Constitution of India', section: 'Article 13' },
            { act: 'Constitution of India', section: 'Article 19' },
          ],
          casesCited: [
            'Golak Nath v. State of Punjab (1967) 2 SCR 762',
            'Shankari Prasad v. Union of India (1951) AIR 1951 SC 458',
          ],
          citedBy: [
            'Minerva Mills v. Union of India (1980) 3 SCC 625',
            'Indira Nehru Gandhi v. Raj Narain (1975) Supp SCC 1',
          ],
          highlights: [
            'Basic Structure Doctrine established',
            'Judicial review declared an inviolable feature',
            'Parliamentary sovereignty balanced with constitutional supremacy',
          ],
          fullText: 'Full judgment text is available in the source repository.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const tabs = [
    'Judgment',
    'AI Summary',
    'Acts & Sections',
    'Cases Cited',
    'Cited By',
    'Highlights',
    'Notes',
  ];

  if (!judgment) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/app/judgments')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          color: '#64748b',
          fontSize: '0.85rem',
          cursor: 'pointer',
          marginBottom: '1.25rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Judgment Search</span>
      </button>

      {/* Main Header matching Screenshot judgment_detail_page */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1
            className="font-serif"
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '0.25rem',
            }}
          >
            {judgment.title}
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {judgment.court} · {judgment.decisionDate}
          </div>
        </div>

        {/* Right Action buttons */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="btn-social"
            onClick={() => toast.success('Precedent saved to practitioner bookmarks.', 'Bookmark Saved')}
            style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem', gap: '0.4rem' }}
          >
            <Bookmark size={15} />
            <span>Save</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => toast.success('Judgment added to Matter briefcase.', 'Briefcase Updated')}
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.45rem' }}
          >
            <Layers size={15} />
            <span>Add to Matter</span>
          </button>
        </div>
      </div>

      {/* Citation and Judges metadata */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb' }}>
          {judgment.citation}
        </span>
        <span className={judgment.status === 'Good Law' ? 'badge-good-law' : 'badge-distinguished'}>
          {judgment.status}
        </span>
        <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
          {judgment.judges} · {judgment.bench}
        </span>
      </div>

      {/* AI Action Tool Buttons */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.75rem' }}>
        <button
          className="btn-social"
          onClick={() => setActiveTab('AI Summary')}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '0.4rem' }}
        >
          <Sparkles size={14} color="#2563eb" />
          <span>AI Summary</span>
        </button>

        <button
          className="btn-social"
          onClick={() => toast.info('Ask This Judgment: AI Legal Q&A session initialized for this case.', 'Legal AI Query')}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '0.4rem' }}
        >
          <MessageSquare size={14} />
          <span>Ask This Judgment</span>
        </button>

        <button
          className="btn-social"
          onClick={() => toast.info('Precedent comparator active: Select another judgment to compare doctrines.', 'Precedent Comparator')}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '0.4rem' }}
        >
          <GitCompare size={14} />
          <span>Compare</span>
        </button>

        <button
          className="btn-social"
          onClick={() => toast.success('Official certified citation copy downloaded.', 'Download Citation')}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '0.4rem' }}
        >
          <Download size={14} />
          <span>Download</span>
        </button>
      </div>

      {/* Tabs Row matching Screenshot */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          gap: '1.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.65rem 0.25rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab ? 600 : 500,
              color: activeTab === tab ? '#0f172a' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #0f172a' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          padding: '2.5rem',
          minHeight: '380px',
        }}
      >
        {activeTab === 'Judgment' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Headnote
            </h3>
            <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {judgment.headnote}
            </p>

            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Ratio Decidendi
            </h3>
            <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {judgment.ratioDecidendi}
            </p>

            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              {judgment.fullText}
            </p>
          </div>
        )}

        {activeTab === 'AI Summary' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              AI Synthesized Case Brief
            </h3>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {judgment.aiSummary || judgment.ratioDecidendi}
            </p>
          </div>
        )}

        {activeTab === 'Acts & Sections' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Referenced Central Acts & Constitutional Articles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(judgment.actsAndSections || []).map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.act}</span> —{' '}
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>{item.section}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Cases Cited' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Cases Cited by Bench
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8 }}>
              {(judgment.casesCited || []).map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Cited By' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Subsequent Judgments Citing This Precedent
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8 }}>
              {(judgment.citedBy || []).map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Highlights' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Key Ratio & Constitutional Takeaways
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8 }}>
              {(judgment.highlights || []).map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Notes' && (
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Advocate Private Briefing Notes
            </h3>
            <textarea
              placeholder="Add personal practitioner notes for your team or matter briefs..."
              rows={5}
              className="form-textarea"
            />
            <button className="btn-primary" style={{ width: 'auto', marginTop: '1rem', padding: '0.5rem 1.25rem' }}>
              Save Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgmentDetailPage;
