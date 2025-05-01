import { useState, useCallback } from 'react';

export function useBooleanState() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback(() => setIsOpen(true), [setIsOpen]);

  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);

  return { isOpen, open, close, toggle };
}
