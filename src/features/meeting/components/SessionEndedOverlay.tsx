'use client';

import { useTranslations } from 'next-intl';

export type SessionEndedOverlayProps = {
  reason: 'timeout' | 'peer' | 'manual';
};

/**
 * Covers the stage when the session has ended (timeout, peer hang-up, or local end)
 * so the user sees a clear state before navigation tears the room down.
 */
export function SessionEndedOverlay({ reason }: SessionEndedOverlayProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  const message
    = reason === 'timeout'
      ? t('session_ended_timeout')
      : reason === 'peer'
        ? t('session_ended_by_peer')
        : t('session_ended');

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-3xl bg-black/70 text-white"
    >
      <p className="text-base font-medium">{message}</p>
      <p className="text-sm text-white/80">{t('session_ended_leaving')}</p>
    </div>
  );
}
