'use client';

import AgoraRTC from 'agora-rtc-sdk-ng';
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalTrack,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Env } from '@/libs/Env.mjs';
import { useAttendReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { MeetingConnectionState, MeetingError } from '../types';

/** Maps Agora's uppercase connection states onto the room's own vocabulary. */
const CONNECTION_STATE_MAP: Record<string, MeetingConnectionState> = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  RECONNECTING: 'reconnecting',
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnected',
};

type UseMeetingSessionOptions = {
  channel: string;
  /**
   * The RTC token minted by the backend and delivered through `sessionUrl`.
   *
   * Callers MUST pass the value with `+` restored — see `readAgoraToken` below.
   */
  token: string;
  /** Session id used for the attendance stamp. `undefined` skips the stamp. */
  sessionId?: string;
  /** Called when the local camera track becomes available, so it can be mounted. */
  onLocalVideoTrack?: (track: ICameraVideoTrack) => void;
  /** Called when a remote video track becomes available, so it can be mounted. */
  onRemoteVideoTrack?: (track: IRemoteVideoTrack) => void;
  /** Called with the remote audio track, which must be played without a container. */
  onRemoteAudioTrack?: (track: IRemoteAudioTrack) => void;
};

/**
 * Reads the Agora token out of a query string.
 *
 * `+` in a query string decodes to a space, so the backend's token comes back
 * mangled and has to be repaired before `join()`. Dropping this repair breaks
 * every join in production and fails silently, so it lives here with a comment
 * rather than inline.
 */
export function readAgoraToken(search: string): string {
  const raw = new URLSearchParams(search).get('token') ?? '';
  return raw.replace(/ /g, '+');
}

/**
 * Owns the Agora client lifecycle for the 1:1 reading room.
 *
 * The join effect deliberately depends on `[channel, token]` only. An earlier
 * version also depended on `isVibing` and on the RTK Query mutation trigger —
 * both of which change reference after the session query resolves — so the
 * whole join/publish block could re-run and re-join the channel mid-call.
 */
export function useMeetingSession({
  channel,
  token,
  sessionId,
  onLocalVideoTrack,
  onRemoteVideoTrack,
  onRemoteAudioTrack,
}: UseMeetingSessionOptions) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [micTrack, setMicTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [cameraTrack, setCameraTrack] = useState<ICameraVideoTrack | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteMicOn, setRemoteMicOn] = useState(false);
  const [remoteCameraOn, setRemoteCameraOn] = useState(false);
  const [hasParticipantJoined, setHasParticipantJoined] = useState(false);
  const [connectionState, setConnectionState] = useState<MeetingConnectionState>('connecting');
  const [error, setError] = useState<MeetingError | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const [attendReadingSession] = useAttendReadingSessionMutation();

  // Tracks and callbacks are read inside async event handlers that outlive a
  // render, so they are mirrored into refs instead of being re-bound per render.
  const localCameraRef = useRef<ICameraVideoTrack | null>(null);
  const trackCallbacksRef = useRef({ onLocalVideoTrack, onRemoteVideoTrack, onRemoteAudioTrack });
  useEffect(() => {
    trackCallbacksRef.current = { onLocalVideoTrack, onRemoteVideoTrack, onRemoteAudioTrack };
  }, [onLocalVideoTrack, onRemoteVideoTrack, onRemoteAudioTrack]);

  // The RTK Query mutation trigger is a fresh reference on every render. Held in
  // a ref so the attendance stamp can call it without the join effect depending
  // on its identity — depending on it was what let the block re-join mid-call.
  const attendRef = useRef(attendReadingSession);
  useEffect(() => {
    attendRef.current = attendReadingSession;
  }, [attendReadingSession]);

  const publishExistingRemoteTracks = useCallback(async (agoraClient: IAgoraRTCClient) => {
    // A peer may already be publishing by the time we finish joining. Without
    // this pass the second person to arrive never sees the first.
    await Promise.all(
      agoraClient.remoteUsers.map(async (remoteUser: IAgoraRTCRemoteUser) => {
        if (remoteUser.hasVideo && !remoteUser.videoTrack) {
          await agoraClient.subscribe(remoteUser, 'video');
          if (remoteUser.videoTrack) {
            trackCallbacksRef.current.onRemoteVideoTrack?.(remoteUser.videoTrack);
            setRemoteCameraOn(true);
          }
        }

        if (remoteUser.hasAudio && !remoteUser.audioTrack) {
          await agoraClient.subscribe(remoteUser, 'audio');
          if (remoteUser.audioTrack) {
            trackCallbacksRef.current.onRemoteAudioTrack?.(remoteUser.audioTrack);
            setRemoteMicOn(true);
          }
        }
      }),
    );
  }, []);

  useEffect(() => {
    if (!channel) {
      return undefined;
    }

    let cancelled = false;
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);

    const handleConnectionStateChange = (current: string) => {
      const next = CONNECTION_STATE_MAP[current];
      if (next) {
        setConnectionState(next);
      }
    };

    const handleException = (exception: { code?: string; msg?: string }) => {
      setError({
        code: 'agora-exception',
        message: exception?.msg ?? exception?.code ?? 'Agora exception',
      });
    };

    agoraClient.on('connection-state-change', handleConnectionStateChange as never);
    agoraClient.on('exception', handleException as never);

    agoraClient.on('user-joined', () => {
      setHasParticipantJoined(true);
    });

    agoraClient.on('user-left', () => {
      setHasParticipantJoined(agoraClient.remoteUsers.length > 0);
      setRemoteMicOn(false);
      setRemoteCameraOn(false);
    });

    agoraClient.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await agoraClient.subscribe(user, mediaType);
      if (cancelled) {
        return;
      }
      if (mediaType === 'video' && user.videoTrack) {
        trackCallbacksRef.current.onRemoteVideoTrack?.(user.videoTrack);
        setRemoteCameraOn(true);
      }
      if (mediaType === 'audio' && user.audioTrack) {
        trackCallbacksRef.current.onRemoteAudioTrack?.(user.audioTrack);
        setRemoteMicOn(true);
      }
    });

    agoraClient.on('user-unpublished', (_user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType === 'video') {
        setRemoteCameraOn(false);
      }
      if (mediaType === 'audio') {
        setRemoteMicOn(false);
      }
    });

    const start = async () => {
      try {
        // Every participant joins with uid 0 — attendance is derived from the JWT
        // by the backend, so Agora UIDs are not identities and must not be used
        // to key any state here.
        await agoraClient.join(Env.NEXT_PUBLIC_AGORA_APP_ID, channel, token, 0);

        if (cancelled) {
          return;
        }
        setIsJoined(true);

        // Stamp attendance only once the Agora join actually resolved: the backend
        // marks a session missed when the Huber's column is still empty ~30min
        // after the meeting ends, so failing to reach this line must not count as
        // attendance. Fire-and-forget and silent — a stamp failure must never
        // interrupt the call. The endpoint is idempotent, and the attendee is
        // derived from the JWT, not the Agora UID (all tokens use uid 0).
        if (sessionId) {
          try {
            await attendRef.current(sessionId).unwrap();
          } catch {
            // Intentionally swallowed, see above.
          }
        }

        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        if (cancelled) {
          tracks.forEach(track => track.stop());
          return;
        }

        setMicTrack(tracks[0]);
        setCameraTrack(tracks[1]);
        localCameraRef.current = tracks[1];
        trackCallbacksRef.current.onLocalVideoTrack?.(tracks[1]);

        await agoraClient.publish([tracks[0], tracks[1]]);
        await publishExistingRemoteTracks(agoraClient);
      } catch (joinError) {
        if (cancelled) {
          return;
        }
        setConnectionState('disconnected');
        setError({
          code: 'join-failed',
          message: joinError instanceof Error ? joinError.message : String(joinError),
        });
      }
    };

    void start();

    return () => {
      cancelled = true;
      agoraClient.off('connection-state-change', handleConnectionStateChange as never);
      agoraClient.off('exception', handleException as never);
      void agoraClient.leave();
      setIsJoined(false);
    };
    // Intentionally NOT depending on `attendReadingSession` (fresh reference each
    // render, held in `attendRef` instead) or on any session-derived value.
  }, [channel, token, sessionId, publishExistingRemoteTracks]);

  /** Publishes additional local tracks, used by screen share (video + optional system audio). */
  const publishTrack = useCallback(async (...tracks: ILocalTrack[]) => {
    if (!client || tracks.length === 0) {
      return;
    }
    await client.publish(tracks);
  }, [client]);

  const unpublishTrack = useCallback(async (track: ILocalTrack) => {
    if (!client) {
      return;
    }
    try {
      await client.unpublish([track]);
    } catch {
      // The track may already be gone if the peer left mid-teardown.
    }
    track.stop();
    track.close();
  }, [client]);

  const leave = useCallback(async () => {
    if (micTrack) {
      micTrack.stop();
      micTrack.close();
    }
    if (cameraTrack) {
      cameraTrack.stop();
      cameraTrack.close();
    }
    await client?.leave();
    setMicTrack(null);
    setCameraTrack(null);
    localCameraRef.current = null;
    setIsJoined(false);
  }, [micTrack, cameraTrack, client]);

  return {
    client,
    isJoined,
    micTrack,
    cameraTrack,
    /** Ref-tracked so screen share can re-publish the camera it tore down. */
    localCameraRef,
    isMicOn,
    isCameraOn,
    setIsMicOn,
    setIsCameraOn,
    remoteMicOn,
    remoteCameraOn,
    setRemoteMicOn,
    setRemoteCameraOn,
    hasParticipantJoined,
    connectionState,
    error,
    setError,
    publishTrack,
    unpublishTrack,
    leave,
  };
}