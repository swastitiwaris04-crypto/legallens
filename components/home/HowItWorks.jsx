'use client';
import { StaggerGrid, StaggerItem } from '@/components/animations/StaggerGrid';

const steps = [
  {
    num: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    title: 'Upload your document',
    desc: 'PDF, image, or paste text directly',
  },
  {
    num: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5a4 4 0 0 0 0 7 4 4 0 0 0 7 0"/>
      </svg>
    ),
    title: 'AI reads everything',
    desc: 'Our AI analyzes every clause and term',
  },
  {
    num: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: 'Get full clarity',
    desc: 'Plain language breakdown with risk flags',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '6rem 0' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>
            How it works
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', marginTop: 12, letterSpacing: '-0.02em' }}>
            From upload to clarity in seconds.
          </h2>
        </div>

        <StaggerGrid className="step-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}>
          {steps.map((step, i) => (
            <StaggerItem key={step.num}>
              <div style={{ position: 'relative', textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 72, fontWeight: 700, lineHeight: 1, color: 'var(--accent-light)', opacity: 0.5, pointerEvents: 'none' }}>
                  {step.num}
                </div>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative' }}>
                  {step.icon}
                </div>
                <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <style jsx>{`
          .step-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
          @media (max-width: 768px) {
            .step-grid {
              grid-template-columns: 1fr;
              gap: 24px;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
