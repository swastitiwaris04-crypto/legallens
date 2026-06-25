'use client';
import { motion } from 'framer-motion';

const statusMessages = [
  'Extracting text...',
  'Reading clauses...',
  'Detecting red flags...',
  'Generating summary...',
  'Almost done...',
];

export default function UploadProgress({ currentStep = 0 }) {
  const progress = Math.min((currentStep / (statusMessages.length - 1)) * 100, 100);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
        <motion.div
          style={{ height: '100%', background: 'var(--accent)', borderRadius: 3, width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: 'var(--text-secondary)' }}
        >
          {statusMessages[Math.min(currentStep, statusMessages.length - 1)]}
        </motion.div>
        <span style={{ display: 'flex', gap: 3 }}>
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </span>
      </div>
    </div>
  );
}
