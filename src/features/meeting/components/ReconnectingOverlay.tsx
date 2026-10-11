'use client';

import { useTranslations } from 'next-intl';

import { mergeClassnames } from '@/components/core/private/utils';
import type { MeetingConnectionState } from '../types';

export type ReconnectingOverlayProps = {
  connectionState: MeetingConnectionState;
};

/**
 * Covers the stage while the Agora connection is degraded.
 *
 * `reconnecting` shows a transient spinner; `disconnected` stays up with an
 * actionable message. Both states were previously invisible — the SDK retried in
 * the background and the user was left looking at a frozen tile.
 */
export function ReconnectingOverlay({ connectionState }: ReconnectingOverlayProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  if (connectionState !== 'reconnecting' && connectionState !== 'disconnected') {
    return null;
  }

  const isDisconnected = connectionState === 'disconnected';

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-3xl bg-black/60 text-white"
    >
      {!isDisconnected && (
        <span
          className={mergeClassnames(
            'size-8 animate-spin rounded-full border-2 border-white/30 border-t-white',
          )}
        />
      )}
      <p className="text-sm font-medium">
        {isDisconnected ? t('connection_lost') : t('reconnecting')}
      </p>
    </div>
  );
}