'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/animations/PageTransition';
import FileDropzone from '@/components/upload/FileDropzone';
import TextPasteInput from '@/components/upload/TextPasteInput';
import LanguageSelector from '@/components/upload/LanguageSelector';
import UploadProgress from '@/components/upload/UploadProgress';
import Toast from '@/components/ui/Toast';
import Spinner from '@/components/ui/Spinner';

export default function UploadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const tabs = [
    { id: 'file', label: 'Upload File' },
    { id: 'paste', label: 'Paste Text' },
    { id: 'photo', label: 'Take Photo' },
  ];

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const canSubmit = activeTab === 'file' ? !!file : activeTab === 'paste' ? text.trim().length >= 50 : false;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setProgressStep(0);
    const stepInterval = setInterval(() => {
      setProgressStep(prev => Math.min(prev + 1, 4));
    }, 2000);

    try {
      let documentText = text;
      let documentId = null;

      if (activeTab === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', language);

        const uploadRes = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) { showToast(uploadData.error || 'Upload failed', 'error'); return; }

        documentText = uploadData.rawText;
        documentId = uploadData.id;
      }

      if (!documentText || documentText.trim().length < 50) {
        showToast('Document text is too short. Please upload a longer document.', 'error');
        return;
      }

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, language, documentId }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) { showToast(analyzeData.error || 'Analysis failed', 'error'); return; }

      const finalId = documentId || `${analyzeData.document_type?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      localStorage.setItem(`doc_${finalId}`, JSON.stringify({ ...analyzeData, documentText, language }));
      router.push(`/results/${finalId}`);
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handlePhotoCapture = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setActiveTab('file'); }
  };

  return (
    <PageTransition>
      <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 68px)', padding: '4rem 0' }}>
        <div className="container-main" style={{ maxWidth: 680, margin: '0 auto' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </a>

          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>
              Step 1 of 1
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--text-primary)', marginTop: 8, letterSpacing: '-0.02em' }}>
              Upload your document
            </h1>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.7 }}>
              We&apos;ll analyze it and explain everything in plain language.
            </p>
          </div>

          <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 24, display: 'flex', gap: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'file' && (
            <FileDropzone onFileSelect={(f) => setFile(f)} />
          )}

          {activeTab === 'paste' && (
            <TextPasteInput onTextChange={(t) => setText(t)} />
          )}

          {activeTab === 'photo' && (
            <div
              className="upload-zone"
              style={{ minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', padding: 32 }}
              onClick={() => document.getElementById('camera-input')?.click()}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 16, color: 'var(--text-primary)' }}>Take a photo of your document</p>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-muted)' }}>Position the document in frame and capture</p>
              <input id="camera-input" type="file" accept="image/*" capture="camera" onChange={handlePhotoCapture} style={{ display: 'none' }} />
              <span className="btn-secondary" style={{ marginTop: 8, padding: '8px 20px', fontSize: 13 }}>
                Open camera
              </span>
            </div>
          )}

          <div style={{ marginTop: 28 }}>
            <LanguageSelector selected={language} onSelect={setLanguage} />
          </div>

          <button
            className="btn-primary"
            disabled={!canSubmit || isAnalyzing}
            onClick={handleAnalyze}
            style={{ width: '100%', height: 54, marginTop: 28, fontSize: 16 }}
          >
            {isAnalyzing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Spinner size={18} color="white" />
                Analyzing your document...
              </span>
            ) : (
              <>
                Analyze Document
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>

          {isAnalyzing && <UploadProgress currentStep={progressStep} />}
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </PageTransition>
  );
}
