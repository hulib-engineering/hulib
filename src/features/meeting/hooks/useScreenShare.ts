'use client';

import AgoraRTC from 'agora-rtc-sdk-ng';
import type { ICameraVideoTrack, ILocalAudioTrack, ILocalTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ScreenShareSource, ScreenShareStatus } from '../types';

type UseScreenShareOptions = {
  /** Publishes one or more local tracks to the Agora channel. */
  publishTrack: (...tracks: ILocalTrack[]) => Promise<void>;
  unpublishTrack: (track: ILocalTrack) => Promise<void>;
  /**
   * Tears the camera down before sharing and brings it back afterwards.
   * Supplied by the shell, which owns the device tracks.
   */
  suspendCamera: () => Promise<ICameraVideoTrack | null>;
  restoreCamera: () => Promise<ICameraVideoTrack | null>;
  onError: (message: string) => void;
};

/**
 * Screen sharing built on raw `getDisplayMedia`.
 *
 * Agora's `createScreenVideoTrack` opens the browser's own picker and offers no
 * source selection, so a custom picker cannot be layered on top of it. Capturing
 * the stream directly and wrapping it with `createCustomVideoTrack` is what makes
 * the design's own source grid possible.
 */
export function useScreenShare({
  publishTrack,
  unpublishTrack,
  suspendCamera,
  restoreCamera,
  onError,
}: UseScreenShareOptions) {
  const [status, setStatus] = useState<ScreenShareStatus>('idle');
  const [sources, setSources] = useState<ScreenShareSource[]>([]);
  const [includeAudio, setIncludeAudio] = useState(false);

  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const screenAudioTrackRef = useRef<ILocalAudioTrack | null>(null);
  // The camera's on/off state from before sharing, so stopping restores what the
  // user actually had rather than forcing the camera on.
  const cameraWasOnRef = useRef(true);
  const restoringRef = useRef(false);

  /** Restores the camera. Safe to call from every stop path exactly once. */
  const restoreCameraTrack = useCallback(async () => {
    if (restoringRef.current) {
      return;
    }
    restoringRef.current = true;

    try {
      const track = await restoreCamera();
      if (track) {
        // Reflect the real device state back into the control bar. The previous
        // implementation recreated the tracks but left this flag as-is, so after
        // a share the UI claimed the camera was off while it was actually on.
        cameraWasOnRef.current = true;
      }
    } finally {
      restoringRef.current = false;
    }
  }, [restoreCamera]);

  const stop = useCallback(async () => {
    const track = screenTrackRef.current;
    screenTrackRef.current = null;

    if (track) {
      await unpublishTrack(track);
    }

    if (screenAudioTrackRef.current) {
      await unpublishTrack(screenAudioTrackRef.current);
      screenAudioTrackRef.current = null;
    }

    await restoreCameraTrack();
    setStatus('idle');
  }, [unpublishTrack, restoreCameraTrack]);

  const start = useCallback(async (source?: ScreenShareSource) => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      onError('getDisplayMedia is not supported in this browser');
      setStatus('error');
      return;
    }

    setStatus('starting');

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: source?.deviceId
          ? { displaySurface: source.kind }
          : true,
        audio: includeAudio,
      } as DisplayMediaStreamOptions);
    } catch {
      // The user dismissing the picker is not an error worth reporting.
      setStatus('idle');
      return;
    }

    const [mediaTrack] = stream.getVideoTracks();
    if (!mediaTrack) {
      setStatus('idle');
      return;
    }

    const wasCameraOn = cameraWasOnRef.current;
    const suspendedCamera = await suspendCamera();

    try {
      const screenTrack = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: mediaTrack });
      screenTrackRef.current = screenTrack;

      const tracksToPublish: ILocalTrack[] = [screenTrack];

      // System audio captured by getDisplayMedia has to be published as its own
      // Agora track, otherwise the "Include system audio" option is silently a no-op.
      const [systemAudioTrack] = stream.getAudioTracks();
      if (systemAudioTrack) {
        screenAudioTrackRef.current = AgoraRTC.createCustomAudioTrack({
          mediaStreamTrack: systemAudioTrack,
        });
        tracksToPublish.push(screenAudioTrackRef.current);
      }

      await publishTrack(...tracksToPublish);

      // Browser-native "Stop sharing" bar. The old implementation only handled
      // our own toggle, so sharing stopped via the browser left the SDK
      // publishing a dead track and the camera switched off for good.
      mediaTrack.addEventListener('ended', () => {
        void stop();
      });

      setStatus('sharing');
      cameraWasOnRef.current = wasCameraOn;
      if (suspendedCamera) {
        suspendedCamera.stop();
      }
    } catch {
      await restoreCameraTrack();
      setStatus('error');
      onError('failed to publish the screen track');
    }
  }, [includeAudio, publishTrack, suspendCamera, restoreCameraTrack, stop, onError]);

  /** Enumerates selectable screens and windows for the custom picker. */
  const loadSources = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const display = devices.filter(device => device.kind === 'videoinput');

      if (display.length === 0) {
        setSources([]);
        return;
      }

      setSources(
        display.map((device, index) => ({
          deviceId: device.deviceId,
          kind: 'screen',
          label: device.label || `Screen ${index + 1}`,
        })),
      );
    } catch {
      setSources([]);
    }
  }, []);

  const openPicker = useCallback(() => {
    setStatus('picker-open');
    void loadSources();
  }, [loadSources]);

  const closePicker = useCallback(() => {
    setStatus(current => (current === 'picker-open' ? 'idle' : current));
  }, []);

  // Leaving the room must not strand a live screen track.
  useEffect(() => () => {
    const track = screenTrackRef.current;
    if (track) {
      screenTrackRef.current = null;
      track.stop();
      track.close();
    }
    const audioTrack = screenAudioTrackRef.current;
    if (audioTrack) {
      screenAudioTrackRef.current = null;
      audioTrack.stop();
      audioTrack.close();
    }
  }, []);

  return {
    status,
    isSharing: status === 'sharing',
    isPickerOpen: status === 'picker-open',
    sources,
    includeAudio,
    setIncludeAudio,
    openPicker,
    closePicker,
    loadSources,
    start,
    stop,
  };
}
