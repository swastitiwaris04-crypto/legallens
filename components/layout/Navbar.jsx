'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const navLinks = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/compare', label: 'Compare' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 68,
        background: scrolled ? 'rgba(253, 251, 246, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <div className="container-main" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 22, color: 'var(--accent)' }}>
            LegalLens
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-actions">
          <Link href="/upload" className="btn-primary" style={{ height: 40, padding: '0 20px' }}>
            Analyze a Document
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          {user ? (
            <button onClick={handleSignOut} className="btn-secondary" style={{ height: 40, padding: '0 16px', fontSize: 13 }}>
              Sign out
            </button>
          ) : (
            <Link href="/login" className="btn-secondary" style={{ height: 40, padding: '0 16px', fontSize: 13 }}>
              Sign in
            </Link>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{ display: 'none', background: 'none', border: 'none', padding: 8 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(17,19,16,0.4)', zIndex: 60 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 300,
                background: 'var(--bg-primary)', zIndex: 70, padding: 32,
                display: 'flex', flexDirection: 'column', gap: 24,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ padding: 8 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 18, fontWeight: 500, color: 'var(--text-secondary)', padding: '8px 0' }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/upload" className="btn-primary" style={{ marginTop: 16, justifyContent: 'center', height: 48 }}>
                Analyze a Document
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              {user ? (
                <button onClick={handleSignOut} style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-muted)', padding: '8px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Sign out
                </button>
              ) : (
                <Link href="/login" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--accent)', padding: '8px 0' }}>
                  Sign in
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
