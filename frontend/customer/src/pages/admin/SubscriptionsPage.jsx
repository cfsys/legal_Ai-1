import React, { useState } from 'react';
import {
  CreditCard,
  Users,
  Calendar,
  Check,
  Zap,
  ArrowUpRight,
  Download,
  Shield,
  FileText,
  Clock,
} from 'lucide-react';
import { toast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const invoices = [
    { id: 'INV-2026-0891', date: '01 Jun 2026', amount: '₹34,999', plan: 'Law Firm Enterprise (10 Seats)', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-0745', date: '01 May 2026', amount: '₹34,999', plan: 'Law Firm Enterprise (10 Seats)', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-0612', date: '01 Apr 2026', amount: '₹34,999', plan: 'Law Firm Enterprise (10 Seats)', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-0489', date: '01 Mar 2026', amount: '₹24,999', plan: 'Standard Practice (5 Seats)', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  const handleDownloadInvoice = (invId) => {
    toast.success(`Invoice ${invId} downloaded as PDF`);
  };

  const handleAddSeats = () => {
    toast.info('Seat allocation modal opened. Please select number of licenses.');
  };

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
            <CreditCard size={19} strokeWidth={2.2} />
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
              Subscription Tier & Seat Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Manage your firm's subscription tier, active user seat licenses, and billing invoice history.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Plan Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Plan
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                Active
              </span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Law Firm
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Full institutional platform suite with custom AI models.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>₹34,999 / mo</span>
            <button
              onClick={() => toast.info('Plan comparison matrix opened')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* Seats Used Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Seats Used
              </span>
              <Users size={18} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              5 <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 500 }}>/ 10</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '50%', height: '100%', backgroundColor: '#2563eb', borderRadius: '9999px' }}></div>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>5 seats remaining</span>
            <button
              onClick={handleAddSeats}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              + Add Seats
            </button>
          </div>
        </div>

        {/* Renewal & Billing Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Next Renewal
              </span>
              <Calendar size={18} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              01 Jul 2026
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Auto-renews with primary card ending in 4242.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>● Auto-Pay Enabled</span>
            <button
              onClick={() => toast.info('Payment method settings opened')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              Update Card
            </button>
          </div>
        </div>
      </div>

      {/* Plan Capabilities Box */}
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
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
          Included in your Law Firm Plan
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {[
            'Unlimited Ask Legal AI Research queries',
            'Full Supreme Court & High Courts precedent database',
            'Contract Risk Scoring & AI Redline Reviews',
            'Multi-tenant User & Role Permission matrix',
            'Indian Acts, Statutes & Regulations index',
            'Dedicated legal account specialist & SLA support',
          ].map((feature, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={13} strokeWidth={3} />
              </div>
              <span style={{ fontSize: '0.875rem', color: '#334155' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices History Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Invoice History</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Download previous tax invoices and payment receipts</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Invoice</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Billing Date</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Description</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Amount</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{inv.id}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{inv.date}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#334155' }}>{inv.plan}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>{inv.amount}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.35rem' }}
                    >
                      <Download size={13} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
