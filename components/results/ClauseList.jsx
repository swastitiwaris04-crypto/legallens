'use client';
import { useState } from 'react';
import ClauseCard from './ClauseCard';

export default function ClauseList({ clauses = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  if (clauses.length === 0) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginBottom: 16 }}>
        Clause-by-Clause Breakdown
      </h3>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {clauses.map((clause) => (
          <ClauseCard
            key={clause.id}
            clause={clause}
            isExpanded={expandedId === clause.id}
            onToggle={() => setExpandedId(expandedId === clause.id ? null : clause.id)}
          />
        ))}
      </div>
    </div>
  );
}
