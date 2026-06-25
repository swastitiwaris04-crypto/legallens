export default function ExportButton({ documentId, onClick }) {
  const handleClick = async () => {
    if (documentId) {
      try {
        const res = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId, expiresInDays: 7 }),
        });
        const data = await res.json();
        if (data.shareUrl) {
          await navigator.clipboard.writeText(data.shareUrl);
          if (onClick) onClick('Share link copied to clipboard!');
        }
      } catch {
        if (onClick) onClick(onClick);
      }
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="btn-primary"
      style={{ padding: '10px 18px', fontSize: 13 }}
      aria-label="Download PDF summary"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download Summary
    </button>
  );
}
