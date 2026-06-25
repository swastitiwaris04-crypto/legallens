'use client';
import { useState, useRef } from 'react';

export default function FileDropzone({ onFileSelect }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      onFileSelect(f);
    }
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      onFileSelect(f);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  return (
    <div
      className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !file && inputRef.current?.click()}
      style={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        cursor: file ? 'default' : 'pointer',
        padding: 32,
        textAlign: 'center',
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload your document"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      {file ? (
        <>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 16, color: 'var(--text-primary)' }}>{file.name}</p>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); onFileSelect(null); }}
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--danger)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
            aria-label="Remove file"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 16, color: 'var(--text-primary)' }}>Drop your file here</p>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-muted)' }}>PDF or image (JPG, PNG) &mdash; max 20MB</p>
          <span className="btn-secondary" style={{ marginTop: 8, padding: '8px 20px', fontSize: 13 }}>
            Browse files
          </span>
        </>
      )}
    </div>
  );
}
