'use client';
import { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import FileDropzone from '@/components/upload/FileDropzone';
import Toast from '@/components/ui/Toast';

export default function ComparePage() {
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  return (
    <PageTransition>
      <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 68px)', padding: '4rem 0' }}>
        <div className="container-main" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Compare Documents
            </h1>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16, color: 'var(--text-secondary)', marginTop: 8 }}>
              Upload two versions of a document to see what changed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>
                Original Document
              </h3>
              <FileDropzone onFileSelect={setLeftFile} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>
                Revised Document
              </h3>
              <FileDropzone onFileSelect={setRightFile} />
            </div>
          </div>

          <button
            className="btn-primary"
            disabled={!leftFile || !rightFile}
            onClick={() => setToast({ visible: true, message: 'Comparison coming soon! This feature is in development.', type: 'success' })}
            style={{ width: '100%', height: 54, marginTop: 28, fontSize: 16 }}
          >
            Compare Documents
          </button>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </PageTransition>
  );
}
