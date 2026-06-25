'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

function RiskBadge({ score }) {
  const variant = score === 'Low' ? 'success' : score === 'Medium' ? 'review' : 'red_flag';
  const colors = { success: 'var(--success-bg)', review: '#FFF3E0', red_flag: 'var(--danger-bg)' };
  const textColors = { success: 'var(--success)', review: '#E65100', red_flag: 'var(--danger)' };
  const icon = score === 'Low' ? (
    <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>
  ) : score === 'Medium' ? (
    <><path d="M12 9v4"/><path d="M12 17h.01"/></>
  ) : (
    <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: colors[variant], color: textColors[variant], fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 20 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      {score} Risk
    </span>
  );
}

export default function HeroSection() {
  const [user, setUser] = useState(null);
  const [recentDoc, setRecentDoc] = useState(null);
  const [docLoading, setDocLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!user) { setDocLoading(false); return; }
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => {
        const docs = data.documents || [];
        setRecentDoc(docs.length > 0 ? docs[0] : null);
        setDocLoading(false);
      })
      .catch(() => setDocLoading(false));
  }, [user, authChecked]);

  function renderHeroCard() {
    const cardStyle = {
      background: 'var(--bg-card)',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-xl)',
      padding: 28,
      width: '100%',
      maxWidth: 420,
      transform: 'rotate(1deg)',
    };

    if (!user) {
      return (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
              Your documents, analyzed
            </h3>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>
              Sign up to see your analyzed documents here — explained in plain language.
            </p>
            <Link href="/signup" className="btn-primary" style={{ display: 'inline-flex', height: 44, padding: '0 24px' }}>
              Get started — it&apos;s free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      );
    }

    if (docLoading) {
      return (
        <div style={cardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ height: 24, width: 120, background: 'var(--bg-secondary)', borderRadius: 20 }} />
            <div style={{ height: 72, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ height: 72, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      );
    }

    if (!recentDoc) {
      return (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
              No documents yet
            </h3>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>
              Upload your first legal document and see the analysis right here.
            </p>
            <Link href="/upload" className="btn-primary" style={{ display: 'inline-flex', height: 44, padding: '0 24px' }}>
              Upload a Document
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      );
    }

    const analysis = recentDoc.analyses?.[0];
    const clauses = analysis?.result_json?.clauses || [];
    const firstTwo = clauses.slice(0, 2);

    return (
      <Link href={`/results/${recentDoc.id}`} style={{ textDecoration: 'none' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <RiskBadge score={analysis?.risk_score || 'Low'} />
            <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20 }}>
              {analysis?.document_type || recentDoc.file_type || 'Document'}
            </span>
          </div>
          <div style={{ fontSize: 13, fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--text-primary)', fontWeight: 500, marginBottom: 10 }}>
            {recentDoc.filename || recentDoc.original_name || 'Untitled'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {firstTwo.map((clause, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {clause.is_red_flag ? '⚠️ ' : ''}{clause.title || clause.id}
                </div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {clause.simple_explanation?.substring(0, 80) || clause.original_text?.substring(0, 80)}...
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>Ask anything about your document...</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45,80,22,0.06) 0%, transparent 70%)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div className="container-main" style={{ width: '100%', paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">
          <div style={{ maxWidth: 600 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  background: 'var(--accent-light)',
                  textTransform: 'uppercase',
                  marginBottom: 24,
                }}
              >
                AI-Powered Legal Analysis
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: 'clamp(2.75rem, 6vw, 5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                Understand any<br />
                <span style={{ fontStyle: 'italic' }}>legal document.</span><br />
                Instantly.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 400,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 480,
                marginTop: 20,
              }}
            >
              Upload your rent agreement, property paper, or any contract. Our AI explains every clause in plain language — no lawyer needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}
            >
              <Link href="/upload" className="btn-primary" style={{ height: 48, padding: '0 28px', fontSize: 15 }}>
                Upload a Document
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <a href="#how-it-works" className="btn-secondary" style={{ height: 48, padding: '0 28px', fontSize: 15 }}>
                See how it works
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}
            >
              {['Free to use', 'No sign-up needed', 'Works in Hindi & English'].map((text) => (
                <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
            className="hero-card-col"
          >
            {renderHeroCard()}
          </motion.div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
            </svg>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .hero-card-col {
            order: -1;
          }
          .hero-card {
            max-width: 100% !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
