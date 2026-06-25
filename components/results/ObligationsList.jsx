'use client';
import { useState } from 'react';
import Toast from '@/components/ui/Toast';

export default function ObligationsList({ obligations = [], documentId }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(null);

  if (obligations.length === 0) return null;

  const setReminder = async (ob) => {
    setLoading(ob.id);
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          obligationId: ob.id,
          description: ob.description,
          deadlineDate: ob.deadline || null,
          isRecurring: ob.deadline === 'Monthly' || ob.deadline === 'Weekly',
          recurringType: ob.deadline?.toLowerCase().includes('month') ? 'monthly' : null,
        }),
      });
      if (res.ok) {
        setToast({ visible: true, message: 'Reminder set successfully!', type: 'success' });
      } else {
        setToast({ visible: true, message: 'Failed to set reminder. Try again.', type: 'error' });
      }
    } catch {
      setToast({ visible: true, message: 'Failed to set reminder.', type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--text-primary)', marginBottom: 16 }}>
        Your Obligations &amp; Deadlines
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {obligations.map((ob) => (
          <div
            key={ob.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              borderLeft: ob.is_critical ? '3px solid var(--danger)' : '3px solid var(--accent)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{ob.description}</div>
              {ob.deadline && (
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>Deadline: {ob.deadline}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {ob.responsible_party && (
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 500, color: 'var(--accent)', background: 'var(--accent-light)', padding: '3px 8px', borderRadius: 10 }}>
                  {ob.responsible_party}
                </span>
              )}
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: 12 }}
                onClick={() => setReminder(ob)}
                disabled={loading === ob.id}
                aria-label="Set reminder for this obligation"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {loading === ob.id ? '...' : 'Reminder'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
