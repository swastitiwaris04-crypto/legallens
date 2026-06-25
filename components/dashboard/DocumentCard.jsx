import Link from 'next/link';
import Badge from '@/components/ui/Badge';

export default function DocumentCard({ doc }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', cursor: 'pointer', flexWrap: 'wrap' }}>
      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>{doc.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <Badge variant="standard">{doc.type}</Badge>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>{doc.date}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Badge variant={doc.risk === 'Low' ? 'success' : doc.risk === 'Medium' ? 'review' : 'red_flag'}>
          {doc.risk}
        </Badge>
        <Link href={`/results/${doc.id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>
          View
        </Link>
      </div>
    </div>
  );
}
