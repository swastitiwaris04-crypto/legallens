'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const variants = {
  Low: { bg: 'var(--success-bg)', text: 'var(--success)', icon: 'shield-check' },
  Medium: { bg: 'var(--warning-bg)', text: 'var(--warning)', icon: 'shield-exclamation' },
  High: { bg: 'var(--danger-bg)', text: 'var(--danger)', icon: 'shield-x' },
};

const shieldIcons = {
  'shield-check': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  'shield-exclamation': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  'shield-x': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  ),
};

export default function RiskScoreBadge({ riskScore = 'Low', riskScoreNumber = 15, riskReason = '' }) {
  const variant = variants[riskScore] || variants.Low;
  const [showReason, setShowReason] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, riskScoreNumber, { duration: 1.2, ease: 'easeOut' });
    const timer = setTimeout(() => setShowReason(true), 1200);
    return () => { controls.stop(); clearTimeout(timer); };
  }, [count, riskScoreNumber]);

  return (
    <div style={{ background: variant.bg, borderRadius: 'var(--radius-lg)', padding: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ color: variant.text }}>
        {shieldIcons[variant.icon]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 28, color: variant.text }}>
            {riskScore} Risk
          </h2>
          <motion.span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: variant.text, opacity: 0.6 }}>
            <motion.span>{rounded}</motion.span>/100
          </motion.span>
        </div>
        {riskReason && (
          <motion.p
            initial={false}
            animate={{ opacity: showReason ? 1 : 0, y: showReason ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: variant.text, marginTop: 4, opacity: 0.75 }}
          >
            {riskReason}
          </motion.p>
        )}
      </div>
    </div>
  );
}
