'use client';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import ExportButton from './ExportButton';
import Toast from '@/components/ui/Toast';

export default function DocumentHeader({ filename, docType, language, documentId, data }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const handleShare = async () => {
    if (!documentId) return;
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, expiresInDays: 7 }),
      });
      const data = await res.json();
      if (data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        setToast({ visible: true, message: 'Share link copied to clipboard!', type: 'success' });
      }
    } catch {
      setToast({ visible: true, message: 'Failed to create share link', type: 'error' });
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        position: 'sticky',
        top: 68,
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {filename || 'Document Analysis'}
        </h1>
        <Badge variant="success">{docType || 'Document'}</Badge>
        {language && language !== 'English' && (
          <Badge variant="standard">{language}</Badge>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <ExportButton data={data} onClick={(msg) => setToast({ visible: true, message: msg || 'Summary downloaded!', type: 'success' })} />
        <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={handleShare}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </button>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
