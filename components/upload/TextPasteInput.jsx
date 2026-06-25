'use client';
import { useState } from 'react';

export default function TextPasteInput({ onTextChange }) {
  const [text, setText] = useState('');
  const maxChars = 50000;

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= maxChars) {
      setText(val);
      onTextChange(val);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Paste the full text of your legal document here..."
        style={{
          width: '100%',
          minHeight: 320,
          padding: 20,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-primary)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        aria-label="Paste document text"
      />
      <div style={{ position: 'absolute', bottom: 12, right: 16, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: text.length > maxChars * 0.9 ? 'var(--danger)' : 'var(--text-muted)' }}>
        {text.length.toLocaleString()} / {maxChars.toLocaleString()} characters
      </div>
    </div>
  );
}
