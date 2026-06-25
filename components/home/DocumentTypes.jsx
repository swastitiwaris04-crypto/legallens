const documentTypes = [
  'Rent Agreement', 'Property Sale Deed', 'Employment Contract', 'Loan Agreement',
  'NDA', 'Power of Attorney', 'Partnership Deed', 'Service Agreement', 'Lease Agreement',
];

export default function DocumentTypes() {
  const duplicated = [...documentTypes, ...documentTypes];
  return (
    <section style={{ background: 'var(--bg-dark)', padding: '5rem 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--text-inverse)', letterSpacing: '-0.02em', padding: '0 24px' }}>
          Works with every legal document you&apos;ll ever face.
        </h2>
      </div>
      <div className="marquee-container" style={{ padding: '12px 0' }}>
        <div className="marquee-content" style={{ display: 'flex', gap: 12 }}>
          {duplicated.map((type, i) => (
            <span
              key={`${type}-${i}`}
              style={{
                display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 999,
                padding: '8px 18px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                color: 'rgba(253,251,246,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
