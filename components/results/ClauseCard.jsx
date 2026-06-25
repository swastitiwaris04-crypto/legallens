'use client';
import { motion, AnimatePresence } from 'framer-motion';

const severityConfig = {
  red_flag: { label: 'Red Flag', color: 'var(--danger)', bg: 'var(--danger-bg)' },
  review: { label: 'Review', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  standard: { label: 'Standard', color: 'var(--success)', bg: 'var(--success-bg)' },
};

export default function ClauseCard({ clause, isExpanded, onToggle }) {
  const severity = severityConfig[clause.severity] || severityConfig.standard;

  return (
    <div
      style={{
        borderBottom: '1px solid var(--border)',
        borderLeft: isExpanded && clause.is_red_flag ? '4px solid var(--danger)' : '4px solid transparent',
        transition: 'border-color 0.3s ease',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
        aria-expanded={isExpanded}
        aria-controls={`clause-content-${clause.id}`}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>
              {clause.title}
            </span>
            {clause.severity !== 'standard' && (
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, color: severity.color, background: severity.bg, padding: '2px 8px', borderRadius: 10 }}>
                {severity.label === 'Red Flag' ? '🔴 ' : '⚠️ '}{severity.label}
              </span>
            )}
          </div>
          {!isExpanded && (
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {clause.simple_explanation?.substring(0, 100)}...
            </p>
          )}
        </div>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </motion.svg>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`clause-content-${clause.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Original Text</div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {clause.original_text}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>What this means</div>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {clause.simple_explanation}
                </p>
              </div>
              {clause.is_red_flag && clause.red_flag_reason && (
                <div style={{ borderLeft: '3px solid var(--danger)', paddingLeft: 16 }}>
                  <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Why this is concerning</div>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--danger)', lineHeight: 1.6 }}>{clause.red_flag_reason}</p>
                </div>
              )}
              {clause.your_rights && (
                <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: 16 }}>
                  <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--success)', marginBottom: 4 }}>Your rights</div>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{clause.your_rights}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
