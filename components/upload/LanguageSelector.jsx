'use client';

const languages = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिंदी' },
  { code: 'Marathi', label: 'मराठी' },
  { code: 'Tamil', label: 'தமிழ்' },
  { code: 'Telugu', label: 'తెలుగు' },
  { code: 'Bengali', label: 'বাংলা' },
];

export default function LanguageSelector({ selected, onSelect }) {
  return (
    <div>
      <label style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10, display: 'block' }}>
        Explain in:
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: 999,
              border: selected === lang.code ? 'none' : '1px solid var(--border)',
              background: selected === lang.code ? 'var(--accent)' : 'transparent',
              color: selected === lang.code ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-pressed={selected === lang.code}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
