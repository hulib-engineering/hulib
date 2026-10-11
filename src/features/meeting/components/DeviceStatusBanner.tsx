'use client';

import { useTranslations } from 'next-intl';

import type { DevicePermissionState } from '../types';
import { mergeClassnames } from '@/components/core/private/utils';

export type DeviceStatusBannerProps = {
  micPermission: DevicePermissionState;
  cameraPermission: DevicePermissionState;
};

/**
 * Explains why a device is unusable instead of leaving a blank stage.
 *
 * The previous implementation let a blocked or absent device fail silently, so
 * the user saw an empty tile with no idea that a permission prompt was the cause.
 */
export function DeviceStatusBanner({
  micPermission,
  cameraPermission,
}: DeviceStatusBannerProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  const messages: string[] = [];

  if (micPermission === 'denied') {
    messages.push(t('mic_permission_denied'));
  } else if (micPermission === 'unavailable') {
    messages.push(t('no_microphone'));
  }

  if (cameraPermission === 'denied') {
    messages.push(t('camera_permission_denied'));
  } else if (cameraPermission === 'unavailable') {
    messages.push(t('no_camera'));
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className={mergeClassnames(
        'flex flex-col items-center gap-1 rounded-2xl bg-neutral-20 px-6 py-4 text-center',
      )}
    >
      {messages.map(message => (
        <p key={message} className="text-sm font-medium text-white">
          {message}
        </p>
      ))}
    </div>
  );
}
