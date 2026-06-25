export default function KeyAmounts({ amounts = [] }) {
  if (amounts.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', marginBottom: 12 }}>
        Key Amounts
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {amounts.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              minWidth: 140,
            }}
          >
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
