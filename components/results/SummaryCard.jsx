import Divider from '@/components/ui/Divider';

export default function SummaryCard({ summary, keyFacts }) {
  return (
    <div className="card" style={{ padding: 28 }}>
      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', marginBottom: 16 }}>
        Plain Language Summary
      </h3>
      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {summary}
      </p>
      {keyFacts && keyFacts.length > 0 && (
        <>
          <Divider />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {keyFacts.map((fact, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{fact.label}</div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{fact.value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
