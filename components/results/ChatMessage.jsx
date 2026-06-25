'use client';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '10px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser ? 'var(--accent)' : 'var(--bg-secondary)',
          color: isUser ? 'white' : 'var(--text-primary)',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
