import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  FileText,
  Search,
  HardDrive,
  TrendingUp,
  Users,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CustomSelect from '../../components/common/CustomSelect';

const UsagePage = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('Current Year 2026');

  const monthlyBars = [
    { month: 'Jan', credits: 1240, height: 40 },
    { month: 'Feb', credits: 1980, height: 60 },
    { month: 'Mar', credits: 1560, height: 48 },
    { month: 'Apr', credits: 2750, height: 85 },
    { month: 'May', credits: 3120, height: 96 },
    { month: 'Jun', credits: 2420, height: 75 },
  ];

  const memberUsage = [
    { name: 'Chirag Poshiya', email: 'cfsys.xyz@gmail.com', role: 'Partner / Counsel', credits: '2,450', docs: 48, queries: 780, lastActive: '10 mins ago' },
    { name: 'Priya Sharma', email: 'priya@legalai.in', role: 'Senior Associate', credits: '1,890', docs: 54, queries: 620, lastActive: '1 hour ago' },
    { name: 'Rohan Mehta', email: 'rohan@legalai.in', role: 'Associate', credits: '1,120', docs: 26, queries: 340, lastActive: '3 hours ago' },
    { name: 'Ananya Verma', email: 'ananya@legalai.in', role: 'Paralegal', credits: '780', docs: 14, queries: 150, lastActive: 'Yesterday' },
  ];

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Top Banner (Matching modern workspace aesthetic) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Gauge size={19} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Usage & Resource Analytics
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              AI credits consumption, document storage quotas, and query activity across your organisation.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>AI Credits Used</span>
            <Sparkles size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            6,240 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/ 10,000</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={12} />
            +18% from last month
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Docs Analyzed</span>
            <FileText size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            142 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>files</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Contracts, briefs & petitions
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Queries Executed</span>
            <Search size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            1,890 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>calls</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Precedent & case law search
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Cloud Storage</span>
            <HardDrive size={16} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            4.2 GB <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>/ 20 GB</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            21% encrypted vault used
          </div>
        </div>
      </div>

      {/* Monthly Chart Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Monthly AI Usage Trend</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Total credits consumed across all organisation members</p>
          </div>
          <div style={{ width: '180px' }}>
            <CustomSelect
              name="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={['Current Year 2026', 'Last 6 Months', 'Last 30 Days', 'Last 7 Days']}
              icon={Calendar}
              size="sm"
            />
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', padding: '0 1.5rem', borderBottom: '1px solid #e2e8f0', gap: '1rem' }}>
          {monthlyBars.map((bar) => (
            <div key={bar.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                {bar.credits}
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: '48px',
                  height: `${bar.height}%`,
                  background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease',
                }}
              ></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>
                {bar.month}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Breakdown Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Member Consumption Breakdown</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Individual activity and resource utilization</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>User</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Role</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>AI Credits</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Docs Processed</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Queries</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {memberUsage.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>{m.role}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#2563eb' }}>{m.credits}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#334155' }}>{m.docs}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#334155' }}>{m.queries}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{m.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;
