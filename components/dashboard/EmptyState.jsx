import Link from 'next/link';

export default function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 24px' }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 24px' }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
        No documents yet
      </h3>
      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
        You haven&apos;t analyzed any documents yet. Upload your first document to get started.
      </p>
      <Link href="/upload" className="btn-primary" style={{ height: 48, padding: '0 28px' }}>
        Analyze your first document
      </Link>
    </div>
  );
}
