'use client';
import RevealOnScroll from '@/components/animations/RevealOnScroll';

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'AI-Powered Analysis',
    description: 'Google Gemini AI reads your entire document, identifies every clause, and flags risky terms — all in seconds.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: 'Plain Language',
    description: 'Complex legal jargon translated into simple Hindi, Marathi, Tamil, Telugu, Bengali, or English — whatever you prefer.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Free & Private',
    description: 'No hidden costs, no subscriptions. Your documents are encrypted and only you can access them.',
  },
];

export default function WhyLegalLens() {
  return (
    <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>
            Why LegalLens
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', marginTop: 12, letterSpacing: '-0.02em' }}>
            Legal help, without the lawyer fees
          </h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((b, i) => (
            <RevealOnScroll key={b.title} delay={i * 0.1}>
              <div className="card" style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {b.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 12 }}>
                  {b.title}
                </h3>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>
                  {b.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <style jsx>{`
          .benefit-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          @media (max-width: 1024px) {
            .benefit-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }
        `}</style>
      </div>
    </section>
  );
}