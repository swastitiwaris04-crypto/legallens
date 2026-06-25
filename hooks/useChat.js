'use client';
import { useState, useCallback } from 'react';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = useCallback(async (documentText, content, language = 'English') => {
    const userMsg = { role: 'user', content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, messages: updatedMessages, language }),
      });
      const data = await res.json();
      const aiMsg = { role: 'assistant', content: data.answer };
      setMessages(prev => [...prev, aiMsg]);
      return aiMsg;
    } catch {
      const errorMsg = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMsg]);
      return errorMsg;
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const reset = useCallback(() => {
    setMessages([]);
    setLoading(false);
  }, []);

  return { messages, loading, send, reset };
}
