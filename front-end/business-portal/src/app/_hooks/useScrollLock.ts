import { useEffect } from 'react';

export function useScrollLock() {
  useEffect(() => {
    const prev = {
      body: document.body.style.overflow,
      html: document.documentElement.style.overflow,
      position: document.body.style.position,
    };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'relative';

    return () => {
      document.body.style.overflow = prev.body;
      document.documentElement.style.overflow = prev.html;
      document.body.style.position = prev.position;
    };
  }, []);
}