import React from 'react';
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
  if (!session) return null;
  return createPortal(
    <div
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
