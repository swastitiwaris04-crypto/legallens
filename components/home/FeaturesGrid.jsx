'use client';
import { StaggerGrid, StaggerItem } from '@/components/animations/StaggerGrid';

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    title: 'Clause Breakdown',
    desc: 'Every clause explained in plain, simple language',
    extraClass: '',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: 'Red Flag Detection',
    desc: 'Automatically flags unfair or unusual terms',
    extraClass: 'red-flag-card',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Risk Score',
    desc: 'Get an instant Low / Medium / High risk rating',
    extraClass: '',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Chat With Doc',
    desc: 'Ask anything about your document, get instant answers',
    extraClass: '',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8l6 6"/><path d="M4 14l4 4 2-2"/><path d="M9 9l3-3 2 2"/><path d="M17 7l-1.5 1.5"/><circle cx="18.5" cy="5.5" r="2.5"/>
      </svg>
    ),
    title: 'Multilingual',
    desc: 'Explanations in Hindi, Marathi, Tamil, Telugu and more',
    extraClass: '',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: 'Export Summary',
    desc: 'Download a clean PDF summary to share with anyone',
    extraClass: '',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" style={{ background: 'var(--bg-primary)', padding: '6rem 0' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: 56, maxWidth: 600, margin: '0 auto 56px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Everything you need to understand your document.
          </h2>
        </div>

        <StaggerGrid className="features-grid">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div
                className={`card feature-card ${feature.extraClass}`}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 17, color: 'var(--text-primary)', marginTop: 4 }}>{feature.title}</h3>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <style jsx>{`
          .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .red-flag-card:hover {
            border-left: 4px solid var(--danger);
            padding-left: 25px;
          }
          @media (max-width: 1024px) {
            .features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 640px) {
            .features-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
