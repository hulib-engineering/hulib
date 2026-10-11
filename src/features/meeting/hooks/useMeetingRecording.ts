'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import type { CloudRecordingInfo } from '../types';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useStartCloudRecordingMutation, useStopCloudRecordingMutation } from '@/libs/services/modules/agora';

type UseMeetingRecordingOptions = {
  channel: string;
  /** Only the Liber is prompted for consent; the Huber is never asked. */
  isPromptedUser: boolean;
  /** True once a peer is in the channel — the prompt waits for this. */
  hasParticipantJoined: boolean;
};

/**
 * Owns cloud recording for the call.
 *
 * `startedAt` is stamped when `startRecording` resolves, not when the consent
 * modal opens, so the badge reflects the real recording length.
 */
export function useMeetingRecording({
  channel,
  isPromptedUser,
  hasParticipantJoined,
}: UseMeetingRecordingOptions) {
  const t = useTranslations('Reading.AgoraMeeting');
  const [startRecording] = useStartCloudRecordingMutation();
  const [stopRecording] = useStopCloudRecordingMutation();

  const [isRecording, setIsRecording] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [recordingInfo, setRecordingInfo] = useState<CloudRecordingInfo | null>(null);

  // Held in a ref so unmount / unload teardown can stop the recording without
  // depending on state that may not have committed yet.
  const recordingInfoRef = useRef<CloudRecordingInfo | null>(null);
  const channelRef = useRef(channel);
  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  useEffect(() => {
    if (isPromptedUser && hasParticipantJoined && !isRecording) {
      setIsConsentOpen(true);
    }
  }, [isPromptedUser, hasParticipantJoined, isRecording]);

  const start = useCallback(async () => {
    setIsConsentOpen(false);
    try {
      const data = await startRecording({ channel }).unwrap();
      setRecordingInfo(data);
      recordingInfoRef.current = data;
      setIsRecording(true);
      setStartedAt(Date.now());
      pushSuccess(t('recording_started'));
    } catch {
      // Previously a hard-coded English string; now localized like every other failure.
      pushError(t('recording_start_failed'));
    }
  }, [channel, startRecording, t]);

  const stop = useCallback(async (): Promise<CloudRecordingInfo | null> => {
    const info = recordingInfoRef.current;
    if (!info) {
      return null;
    }

    try {
      await stopRecording({ channel: channelRef.current, ...info }).unwrap();
      pushSuccess(t('recording_stopped'));
      return info;
    } catch {
      pushError(t('recording_stop_failed'));
      return null;
    } finally {
      recordingInfoRef.current = null;
      setRecordingInfo(null);
      setIsRecording(false);
      setStartedAt(null);
    }
  }, [stopRecording, t]);

  const decline = useCallback(() => {
    setIsConsentOpen(false);
  }, []);

  // Best-effort teardown so navigating away does not leave a recording running.
  useEffect(() => {
    const stopOnUnload = () => {
      const info = recordingInfoRef.current;
      if (!info) {
        return;
      }
      recordingInfoRef.current = null;
      void stopRecording({ channel: channelRef.current, ...info });
    };

    window.addEventListener('beforeunload', stopOnUnload);

    return () => {
      window.removeEventListener('beforeunload', stopOnUnload);
      stopOnUnload();
    };
  }, [stopRecording]);

  return {
    isRecording,
    startedAt,
    isConsentOpen,
    recordingInfo,
    start,
    stop,
    decline,
  };
}
