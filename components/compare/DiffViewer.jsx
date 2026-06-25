export default function DiffViewer({ original, revised }) {
  if (!original && !revised) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14 }}>
        Upload both documents and click compare to see differences.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--success)' }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-secondary)' }}>Improved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--danger)' }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-secondary)' }}>Worse</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--bg-secondary)' }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-secondary)' }}>Unchanged</span>
        </div>
      </div>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: 32, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
        Diff comparison will appear here after analysis.
      </div>
    </div>
  );
}
