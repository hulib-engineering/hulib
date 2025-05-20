import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { SessionCard } from './SessionCard';

interface PortalSessionCardProps {
  session: any;
  expanded?: boolean;
  position: { top: number; left: number };
  onClose?: () => void;
}

export const PortalSessionCard: React.FC<PortalSessionCardProps> = ({
  session,
  expanded = true,
  position,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!session) return null;

  return createPortal(
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 9999,
        background: 'transparent',
      }}
      onMouseLeave={onClose}
    >
      <SessionCard session={session} expanded={expanded} />
    </div>,
    typeof window !== 'undefined' ? document.body : (null as any),
  );
};
