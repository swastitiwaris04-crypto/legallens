'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark)' }}>
      <div className="container-main" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(253,251,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 18, color: 'rgba(253,251,246,0.8)' }}>
              LegalLens
            </span>
          </div>
          <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { href: '/#how-it-works', label: 'How it works' },
              { href: '/#features', label: 'Features' },
              { href: '/compare', label: 'Compare' },
              { href: '/dashboard', label: 'Dashboard' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(253,251,246,0.5)', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(253,251,246,0.8)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(253,251,246,0.5)'}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 32, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'rgba(253,251,246,0.4)' }}>
            © 2024 LegalLens. Not a substitute for legal advice.
          </span>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'rgba(253,251,246,0.4)' }}>
            Made with care for everyday Indians.
          </span>
        </div>
      </div>
    </footer>
  );
}
