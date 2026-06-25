'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RedFlagBanner({ redFlagCount = 0, clauses = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (redFlagCount === 0) return null;

  const redFlagClauses = clauses.filter(c => c.is_red_flag);

  return (
    <div style={{ marginTop: 24 }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          background: 'var(--danger-bg)',
          borderLeft: '4px solid var(--danger)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          border: 'none',
          textAlign: 'left',
        }}
        aria-expanded={isExpanded}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 14, color: 'var(--danger)', flex: 1 }}>
          {redFlagCount} red flag{redFlagCount > 1 ? 's' : ''} found in this document &mdash; review carefully
        </span>
        <motion.svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </motion.svg>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', background: 'var(--danger-bg)', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}
          >
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {redFlagClauses.map((clause) => (
                <div key={clause.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: 'var(--danger)', fontSize: 14, lineHeight: 1.7 }}>&bull;</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--danger)', lineHeight: 1.7 }}>
                    <strong>{clause.title}</strong>: {clause.red_flag_reason}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
