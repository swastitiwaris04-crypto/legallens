'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ documentText, documentId, language = 'English', suggestedQuestions = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, documentId, messages: newMessages, language }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) sendMessage(input.trim());
  };

  const handleSuggestion = (q) => sendMessage(q);

  return (
    <div style={{ height: 'calc(100vh - 68px - 60px)', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', flex: 1 }}>
          Chat with your document
        </span>
      </div>

      <div ref={threadRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 && showSuggestions && suggestedQuestions.length > 0 && (
          <div style={{ marginTop: 'auto', marginBottom: 12 }}>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>
              Suggested questions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q)}
                  style={{
                    padding: '10px 16px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13,
                    color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--accent-light)'; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg-secondary)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ChatMessage message={msg} />
          </motion.div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: 4, padding: 10, marginBottom: 8 }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your document..."
          style={{
            flex: 1, padding: '10px 14px', fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 14, color: 'var(--text-primary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--bg-secondary)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          disabled={isLoading}
          aria-label="Type your question"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: input.trim() && !isLoading ? 'var(--accent)' : 'var(--bg-secondary)',
            color: input.trim() && !isLoading ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'default',
            transition: 'background 0.2s', flexShrink: 0,
          }}
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
