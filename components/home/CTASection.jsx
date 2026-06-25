'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section style={{ background: 'var(--accent)', padding: '6rem 0', textAlign: 'center' }}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.15, maxWidth: 600, margin: '0 auto 16px' }}>
            Your document deserves clarity.
          </h2>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>
            Join thousands of people who finally understood what they signed.
          </p>
          <Link
            href="/upload"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'white',
              color: 'var(--accent)',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 15,
              padding: '16px 32px',
              borderRadius: 'var(--radius-md)',
              height: 52,
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
          >
            Analyze your first document &mdash; it&apos;s free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
