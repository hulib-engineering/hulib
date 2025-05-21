import React, { useEffect, useRef, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      const { offsetWidth, offsetHeight } = cardRef.current;
      setCardDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [session]);

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

  const getCardStyle = () => {
    if (isMobile) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        background: 'transparent',
        maxWidth: '90%',
        maxHeight: '80%',
        overflow: 'auto',
      };
    }
    const CARD_WIDTH = 400;
    const CARD_HEIGHT = cardDimensions.height || 300;
    const PADDING = 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedLeft = position.left;
    let adjustedTop = position.top;

    if (adjustedLeft < PADDING) {
      adjustedLeft = PADDING;
    }

    if (adjustedLeft + CARD_WIDTH + PADDING > viewportWidth) {
      adjustedLeft = Math.max(PADDING, viewportWidth - CARD_WIDTH - PADDING);
    }

    if (position.top + CARD_HEIGHT + PADDING > viewportHeight) {
      adjustedTop = Math.max(PADDING, viewportHeight - CARD_HEIGHT - PADDING);
    }

    return {
      position: 'fixed',
      top: adjustedTop,
      left: adjustedLeft,
      zIndex: 9999,
      background: 'transparent',
    };
  };

  return createPortal(
    <div
      ref={cardRef}
      style={getCardStyle() as React.CSSProperties}
      onMouseLeave={isMobile ? undefined : onClose}
    >
      <SessionCard session={session} expanded={expanded} />
    </div>,
    typeof window !== 'undefined' ? document.body : (null as any),
  );
};
