import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import { X, Database, Server, CheckCircle2, AlertCircle, RefreshCw, HardDrive, ArrowRight } from 'lucide-react';

export default function DatabaseModal() {
  const { closeModal, dbStatus, refreshDbStatus, addToast, refreshOverview } = useAdmin();
  const [mongoUri, setMongoUri] = useState(dbStatus?.uri || 'mongodb://127.0.0.1:27017/themes-ai');
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLiveMongo = dbStatus?.isMongooseConnected;

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!mongoUri) {
      addToast('Please enter a MongoDB connection string', 'error');
      return;
    }

    setConnecting(true);
    setErrorMsg('');

    try {
      const res = await adminApi.connectCustomDb(mongoUri);
      if (res.success) {
        addToast(res.message);
        await refreshDbStatus();
        await refreshOverview();
        closeModal();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to MongoDB');
      addToast('Connection failed: ' + err.message, 'error');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Database & Schema Connectivity
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Configure live MongoDB (Atlas / Local) or dynamic persisted storage
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current DB Status Pill Card */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${isLiveMongo ? 'badge-emerald' : 'badge-blue'}`}>
                {isLiveMongo ? <CheckCircle2 size={12} /> : <HardDrive size={12} />}
                <span>{dbStatus?.dbMode || 'Dynamic Persistent DB'}</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                • {dbStatus?.counts?.users || 9} Users · {dbStatus?.counts?.firms || 6} Firms
              </span>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
              onClick={refreshDbStatus}
            >
              <RefreshCw size={12} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Target URI: <span style={{ color: 'var(--accent-blue)' }}>{dbStatus?.uri || 'Local storage'}</span>
          </div>
        </div>

        {/* Connect Form */}
        <form onSubmit={handleConnect} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              MongoDB Connection String (URI)
            </label>
            <input
              type="text"
              className="form-input font-mono"
              placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/themes-ai"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              style={{ fontSize: '0.82rem' }}
              required
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
              Accepts local instances (<code>mongodb://127.0.0.1:27017/themes-ai</code>) or cloud Atlas clusters.
            </span>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                fontSize: '0.78rem',
                color: '#be123c',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Active Mongoose Collections */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Active Database Models & Collections:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div>• <code>users</code> (Advocates, Roles, Bitmasks)</div>
              <div>• <code>firms</code> (Multi-Tenant Chambers)</div>
              <div>• <code>auditlogs</code> (Security Audit Stream)</div>
              <div>• <code>aimodels</code> (Inference Quotas & Specs)</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
            <button type="submit" className="btn btn-blue" disabled={connecting}>
              <RefreshCw size={15} className={connecting ? 'animate-spin' : ''} />
              <span>{connecting ? 'Connecting...' : 'Connect & Sync MongoDB'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
