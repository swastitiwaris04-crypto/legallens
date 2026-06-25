'use client';
import { useState, useCallback } from 'react';

export default function useToast() {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const show = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hide = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return { toast, show, hide };
}
