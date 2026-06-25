'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const json = await res.json();
          setDocuments(json.documents || []);
        } else if (res.status === 401) {
          setDocuments([]);
        }
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  const filteredDocs = documents.filter((doc) => {
    if (filter === 'All') return true;
    if (filter === 'High Risk') return doc.analyses?.[0]?.risk_score === 'High';
    if (filter === 'This Month') {
      const docDate = new Date(doc.created_at);
      const now = new Date();
      return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  if (loading) {
    return (
      <PageTransition>
        <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
          <Skeleton height={32} width="40%" />
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={72} />
            <Skeleton height={72} />
            <Skeleton height={72} />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!loading && documents.length === 0) {
    return (
      <PageTransition>
        <div style={{ textAlign: 'center', padding: '6rem 24px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 24px' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', marginBottom: 12 }}>
            No documents yet
          </h1>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Upload your first document to get AI-powered analysis in plain language.
          </p>
          <Link href="/upload" className="btn-primary" style={{ height: 48, padding: '0 28px' }}>
            Upload a Document
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 68px)', padding: '4rem 0' }}>
        <div className="container-main" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                My Documents
              </h1>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-secondary)', marginTop: 4 }}>
                {documents.length} document{documents.length !== 1 ? 's' : ''} analyzed
              </p>
            </div>
            <Link href="/upload" className="btn-primary" style={{ height: 44, padding: '0 20px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Analysis
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {['All', 'High Risk', 'This Month'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: filter === f ? 'var(--accent)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredDocs.map((doc) => {
              const analysis = doc.analyses?.[0];
              const riskScore = analysis?.risk_score || 'Low';
              const riskVariant = riskScore === 'Low' ? 'success' : riskScore === 'Medium' ? 'review' : 'red_flag';
              return (
                <div
                  key={doc.id}
                  className="card"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', cursor: 'pointer', flexWrap: 'wrap' }}
                  onClick={() => router.push(`/results/${doc.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/results/${doc.id}`); }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>
                      {doc.filename || doc.original_name || 'Untitled Document'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      {analysis?.document_type && <Badge variant="standard">{analysis.document_type}</Badge>}
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Badge variant={riskVariant}>{riskScore}</Badge>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
