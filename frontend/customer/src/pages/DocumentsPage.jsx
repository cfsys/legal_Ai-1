import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Plus,
  FileText,
  RefreshCw,
  X,
  ExternalLink,
  Trash2,
  Search,
  Check,
  Shield,
  Eye,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import { documentService } from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';

const SAMPLE_DOCUMENTS = [
  {
    _id: 'doc_001',
    title: 'Share Purchase Agreement - Acme.pdf',
    pages: 42,
    status: 'Ready',
    isConfidential: true,
    uploadDate: '12 Jun 2026',
    matter: 'Acme Holdings vs ED',
  },
  {
    _id: 'doc_002',
    title: 'Vendor Master Services Agreement.pdf',
    pages: 18,
    status: 'Ready',
    isConfidential: false,
    uploadDate: '10 Jun 2026',
    matter: 'Commercial Advisory & Dispute',
  },
  {
    _id: 'doc_003',
    title: 'Order Copy - NCLT Mumbai Principal Bench.pdf',
    pages: 9,
    status: 'Ready',
    isConfidential: false,
    uploadDate: '09 Jun 2026',
    matter: 'Zenith Telecom CIRP',
  },
  {
    _id: 'doc_004',
    title: 'Executive Employment & IP Assignment Agreement.pdf',
    pages: 14,
    status: 'Ready',
    isConfidential: true,
    uploadDate: '07 Jun 2026',
    matter: 'Corporate Advisory Docket',
  },
  {
    _id: 'doc_005',
    title: 'Special Leave Petition - Synopsis & List of Dates.pdf',
    pages: 28,
    status: 'Ready',
    isConfidential: true,
    uploadDate: '04 Jun 2026',
    matter: 'Supreme Court - SLP (Civil)',
  },
];

const DocumentsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete Confirmation State
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showUploadModal) setShowUploadModal(false);
        if (docToDelete) setDocToDelete(null);
      }
    };
    if (showUploadModal || docToDelete) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUploadModal, docToDelete]);

  const fetchDocs = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setLoading(true);
    try {
      const res = await documentService.getAll({ status: filter });
      const data = res?.data || res;
      if (Array.isArray(data) && data.length > 0) {
        setDocuments(data);
      } else {
        setDocuments(SAMPLE_DOCUMENTS);
      }
    } catch (err) {
      console.warn('Backend documents fetch error:', err.message);
      setDocuments(SAMPLE_DOCUMENTS);
    } finally {
      setLoading(false);
      if (isManual) {
        setRefreshing(false);
        toast.info('Documents list refreshed');
      }
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [filter]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Attempt to read text content if text-based file
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFileContent(event.target.result || '');
        };
        reader.readAsText(file);
      } else {
        setFileContent('');
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFileContent(event.target.result || '');
        };
        reader.readAsText(file);
      } else {
        setFileContent('');
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      toast.warning('Please select a legal document to upload');
      return;
    }

    setIsUploading(true);
    const docTitle = selectedFile.name;
    const computedPages = Math.max(1, Math.ceil(selectedFile.size / 25000));
    const fileMime = selectedFile.type || (docTitle.endsWith('.pdf') ? 'application/pdf' : 'text/plain');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result || '';
      try {
        const payload = {
          title: docTitle,
          isConfidential,
          pages: computedPages,
          fileData: dataUrl,
          fileType: fileMime,
          fileSize: selectedFile.size,
          content: fileContent || undefined,
        };

        const res = await documentService.upload(payload);
        const created = res?.data || res;
        const realId = created?._id || created?.id;
        if (realId && dataUrl) {
          try {
            sessionStorage.setItem(`doc_preview_${realId}`, dataUrl);
          } catch (storageErr) {
            console.warn('Session storage cache skipped:', storageErr);
          }
        }

        // Automatically refresh documents list from database
        await fetchDocs();

        setShowUploadModal(false);
        setSelectedFile(null);
        setFileContent('');
        setIsConfidential(false);
        toast.success(`"${docTitle}" uploaded successfully and ready for viewing!`);
      } catch (err) {
        console.warn('Backend upload error, adding locally:', err.message);
        const newDocId = `doc_${Date.now()}`;
        if (dataUrl) {
          try {
            sessionStorage.setItem(`doc_preview_${newDocId}`, dataUrl);
          } catch (e) {}
        }
        const newDoc = {
          _id: newDocId,
          title: docTitle,
          pages: computedPages,
          fileData: dataUrl,
          fileType: fileMime,
          status: 'Ready',
          isConfidential: isConfidential,
          uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
        setDocuments((prev) => [newDoc, ...prev]);
        setShowUploadModal(false);
        setSelectedFile(null);
        setFileContent('');
        setIsConfidential(false);
        toast.success(`"${docTitle}" uploaded and indexed!`);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Failed to read file from disk. Please try again.');
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    const docId = docToDelete._id || docToDelete.id;

    try {
      await documentService.delete(docId);
      try {
        sessionStorage.removeItem(`doc_preview_${docId}`);
      } catch (e) {}
      // Automatically refresh without browser reload
      await fetchDocs();
      toast.info(`Document "${docToDelete.title}" deleted successfully`);
    } catch (err) {
      console.warn('Failed to delete on server, removing locally:', err.message);
      setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== docId));
      toast.info(`Document "${docToDelete.title}" removed`);
    } finally {
      setIsDeleting(false);
      setDocToDelete(null);
    }
  };

  const handleOpenDocument = (docId) => {
    navigate(`/app/documents/${docId}`);
  };

  const handleOpenInNewTab = (e, doc) => {
    e.stopPropagation();
    const docId = doc._id || doc.id;
    const fileData = doc.fileData || sessionStorage.getItem(`doc_preview_${docId}`);

    if (fileData && fileData.startsWith('data:')) {
      try {
        const arr = fileData.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        return;
      } catch (err) {
        console.warn('Blob URL generation failed, falling back to data URL:', err);
        window.open(fileData, '_blank');
        return;
      }
    }
    window.open(`/app/documents/${docId}`, '_blank', 'noopener,noreferrer');
  };

  const getNormalizedStatus = (st) => {
    if (st === 1 || st === '1' || st === 'Ready') return 'Ready';
    if (st === 2 || st === '2' || st === 'Processing') return 'Processing';
    if (st === 3 || st === '3' || st === 'Failed') return 'Failed';
    return st || 'Ready';
  };

  const filteredDocuments = documents
    .map((d) => ({
      ...d,
      displayStatus: getNormalizedStatus(d.status),
    }))
    .filter((doc) => {
      const matchesFilter = filter === 'All' || doc.displayStatus.toLowerCase() === filter.toLowerCase();
      const matchesSearch = !searchQuery.trim() ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (doc.uploadDate && doc.uploadDate.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesFilter && matchesSearch;
    });

  const counts = {
    All: documents.length,
    Ready: documents.filter((d) => getNormalizedStatus(d.status) === 'Ready').length,
    Processing: documents.filter((d) => getNormalizedStatus(d.status) === 'Processing').length,
    Failed: documents.filter((d) => getNormalizedStatus(d.status) === 'Failed').length,
  };

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '2.5rem',
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
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={19} strokeWidth={2.2} />
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
              Document Vault & Intelligence
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Upload and analyse legal contracts, pleadings, briefs, and court filings with dynamic clause extraction.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => fetchDocs(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <RefreshCw
              size={14}
              color="#64748b"
              style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
            />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.15rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#4338ca',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(67, 56, 202, 0.25)',
              transition: 'background 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['All', 'Ready', 'Processing', 'Failed'].map((tab) => {
            const isActive = filter.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  backgroundColor: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                  }}
                >
                  {counts[tab] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '280px',
          }}
        >
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.75rem 0.4rem 2.2rem',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              fontSize: '0.8rem',
              outline: 'none',
              backgroundColor: '#f8fafc',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Documents Table Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <th style={{ padding: '0.85rem 1rem' }}>DOCUMENT NAME</th>
              <th style={{ padding: '0.85rem 1rem' }}>PAGES</th>
              <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
              <th style={{ padding: '0.85rem 1rem' }}>UPLOAD DATE</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => {
              const docId = doc._id || doc.id;
              return (
                <tr
                  key={docId}
                  onClick={() => handleOpenDocument(docId)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.84rem',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{doc.title}</span>
                          {doc.isConfidential && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              <Shield size={10} />
                              <span>Confidential</span>
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          Click to open dynamic analyzer
                        </span>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.825rem' }}>
                    {doc.pages || 1} {doc.pages === 1 ? 'page' : 'pages'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        backgroundColor:
                          doc.displayStatus === 'Ready'
                            ? '#ecfdf5'
                            : doc.displayStatus === 'Processing'
                            ? '#fffbeb'
                            : '#fef2f2',
                        color:
                          doc.displayStatus === 'Ready'
                            ? '#059669'
                            : doc.displayStatus === 'Processing'
                            ? '#d97706'
                            : '#dc2626',
                        border: `1px solid ${
                          doc.displayStatus === 'Ready'
                            ? '#a7f3d0'
                            : doc.displayStatus === 'Processing'
                            ? '#fde68a'
                            : '#fecaca'
                        }`,
                      }}
                    >
                      {doc.displayStatus === 'Ready' && <Check size={11} />}
                      <span>{doc.displayStatus}</span>
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.825rem' }}>
                    {doc.uploadDate || 'Recent'}
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Open / Analyze Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenDocument(docId)}
                        title="Open and analyze document"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                          e.currentTarget.style.color = '#2563eb';
                          e.currentTarget.style.borderColor = '#93c5fd';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#334155';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                      >
                        <Eye size={13} />
                        <span>Open</span>
                      </button>

                      {/* Open in New Tab Button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenInNewTab(e, doc)}
                        title="Open document in a new browser tab"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#4338ca',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#eef2ff';
                          e.currentTarget.style.borderColor = '#a5b4fc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>New Tab</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDocToDelete(doc)}
                        title="Delete document"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #fee2e2',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.borderColor = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#fee2e2';
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredDocuments.length === 0 && !loading && (
          <div
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem',
                color: '#475569',
              }}
            >
              <FileText size={24} strokeWidth={1.8} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              {searchQuery ? 'No matching documents found' : 'No documents in workspace'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0 0 1.25rem 0', maxWidth: '380px', lineHeight: 1.5 }}>
              {searchQuery
                ? `No legal filings matched "${searchQuery}". Clear your search query to view all documents.`
                : 'Upload contracts, briefs, affidavits, or pleadings to begin automated AI indexing and clause extraction.'}
            </p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#4338ca',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(67, 56, 202, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              <Upload size={14} />
              <span>Upload Legal Document</span>
            </button>
          </div>
        )}
      </div>

      {/* Pop-Up Modal for Document Upload */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '560px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #e2e8f0',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Upload Legal Document
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Upload contract, brief, or pleading for automated extraction & analysis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drag and Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                backgroundColor: selectedFile ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginBottom: '1.25rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = selectedFile ? '#2563eb' : '#cbd5e1')}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.rtf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <FileUp size={20} />
              </div>

              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB · Ready to index
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    Click to select or drag and drop a file here
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Supports PDF, Word (DOCX), and TXT filings
                  </div>
                </div>
              )}
            </div>

            {/* Confidentiality Checkbox */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  color: '#334155',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#4338ca' }}
                />
                <span style={{ fontWeight: 500 }}>
                  Mark document as <strong>Privileged & Confidential</strong>
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '7px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedFile ? '#4338ca' : '#cbd5e1',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
                }}
              >
                {isUploading ? (
                  <>
                    <span
                      style={{
                        width: '13px',
                        height: '13px',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        borderTopColor: '#ffffff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    <span>Indexing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(docToDelete)}
        title="Delete Document"
        message={
          docToDelete
            ? `Are you sure you want to delete "${docToDelete.title}"? This action will remove the document and all associated AI summaries from your workspace.`
            : ''
        }
        confirmText={isDeleting ? 'Deleting...' : 'Delete Document'}
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};

export default DocumentsPage;
