'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';

export default function ObligationsPage() {
  const params = useParams();

  return (
    <PageTransition>
      <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 68px)', padding: '4rem 0' }}>
        <div className="container-main" style={{ maxWidth: 700, margin: '0 auto' }}>
          <Link href={`/results/${params.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to document
          </Link>

          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Obligations &amp; Deadlines
          </h1>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Track all your obligations and set reminders for critical deadlines.
          </p>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>
              Obligation tracking coming soon
            </h3>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              You&apos;ll be able to set email reminders for rent payments, notice periods, and other critical deadlines. This feature is in development.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
