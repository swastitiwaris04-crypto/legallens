'use client';
import RevealOnScroll from '@/components/animations/RevealOnScroll';

const testimonials = [
  {
    quote: 'I had no idea my rent agreement had a clause that let the landlord enter without notice. LegalLens caught it immediately and explained what it meant.',
    name: 'Priya M.',
    location: 'Mumbai',
    docType: 'Rent Agreement',
  },
  {
    quote: 'Used this for my job offer letter. Found that the non-compete clause was extremely restrictive. Saved me from a bad decision.',
    name: 'Arjun S.',
    location: 'Bengaluru',
    docType: 'Employment Contract',
  },
  {
    quote: 'My father couldn\'t understand his loan agreement. We uploaded it and explained it to him in Hindi within seconds. Life changing.',
    name: 'Rohan P.',
    location: 'Jaipur',
    docType: 'Loan Agreement',
  },
];

const initials = (name) => name.split(' ').map(n => n[0]).join('');

export default function Testimonials() {
  return (
    <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>
            Testimonials
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', marginTop: 12, letterSpacing: '-0.02em' }}>
            Trusted by everyday Indians
          </h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 0.1}>
              <div className="card" style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)" style={{ marginBottom: 16, opacity: 0.3 }}>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.433.917-3.995 3.638-3.995 5.849h4v10H0z"/>
                </svg>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.7, flex: 1 }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 14 }}>
                    {initials(t.name)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>{t.location} &middot; {t.docType}</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <style jsx>{`
          .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          @media (max-width: 1024px) {
            .testimonial-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
