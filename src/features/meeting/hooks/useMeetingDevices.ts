'use client';

import type { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useState } from 'react';

import type { DevicePermissionState, MeetingError } from '../types';

/**
 * Classifies a `getUserMedia` failure into something the UI can act on.
 *
 * The browser reports these through the DOM error name rather than an exit code,
 * so the name is the only reliable signal available after the fact.
 */
export function classifyDeviceError(error: unknown): DevicePermissionState {
  const name = (error as { name?: string } | null)?.name;

  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'SecurityError':
      return 'denied';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'unavailable';
    default:
      return 'unknown';
  }
}

type UseMeetingDevicesOptions = {
  micTrack: IMicrophoneAudioTrack | null;
  cameraTrack: ICameraVideoTrack | null;
  /** False until the local tracks exist; the control bar dims while this is false. */
  isReady: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
  onMicChange: (isOn: boolean) => void;
  onCameraChange: (isOn: boolean) => void;
  onError: (error: MeetingError) => void;
};

/**
 * Owns the microphone and camera toggle behaviour.
 *
 * Toggling uses `setEnabled()` rather than unpublishing, so the remote peer sees a
 * mute state instead of a participant vanishing — the same approach the previous
 * inline implementation used.
 */
export function useMeetingDevices({
  micTrack,
  cameraTrack,
  isReady,
  isMicOn,
  isCameraOn,
  onMicChange,
  onCameraChange,
  onError,
}: UseMeetingDevicesOptions) {
  const [micPermission, setMicPermission] = useState<DevicePermissionState>('unknown');
  const [cameraPermission, setCameraPermission] = useState<DevicePermissionState>('unknown');

  /**
   * Records the permission state discovered when the tracks were first created.
   * `useMeetingSession` calls this after a failed `createMicrophoneAndCameraTracks()`.
   */
  const reportDeviceState = useCallback((state: DevicePermissionState) => {
    setMicPermission(state);
    setCameraPermission(state);
  }, []);

  const toggleMic = useCallback(async () => {
    // Guarded so a click before the tracks exist cannot throw.
    if (!isReady || !micTrack) {
      return;
    }

    const next = !isMicOn;
    try {
      await micTrack.setEnabled(next);
      setMicPermission('granted');
      onMicChange(next);
    } catch (error) {
      const state = classifyDeviceError(error);
      setMicPermission(state);
      onError({
        code: 'device-failed',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }, [isReady, micTrack, isMicOn, onMicChange, onError]);

  const toggleCamera = useCallback(async () => {
    if (!isReady || !cameraTrack) {
      return;
    }

    const next = !isCameraOn;
    try {
      await cameraTrack.setEnabled(next);
      setCameraPermission('granted');
      onCameraChange(next);
    } catch (error) {
      const state = classifyDeviceError(error);
      setCameraPermission(state);
      onError({
        code: 'device-failed',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }, [isReady, cameraTrack, isCameraOn, onCameraChange, onError]);

  return {
    isMicOn,
    isCameraOn,
    micPermission,
    cameraPermission,
    reportDeviceState,
    toggleMic,
    toggleCamera,
  };
}
