/** Meeting room domain types (#792). */

/** How the stage is arranged for the two participants. */
export type MeetingLayoutMode =
  /** Remote participant fills the stage, local user is picture-in-picture. */
  | 'spotlight'
  /** Shared screen fills the stage, both participants collapse into a side rail. */
  | 'rail';

/** Agora connection lifecycle, surfaced from `client.connection.on('state-change')`. */
export type MeetingConnectionState =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

/**
 * Permission / hardware state for a single capture device.
 *
 * Agora reports these through the DOM error name when
 * `createMicrophoneAndCameraTracks()` rejects:
 * `NotAllowedError` -> denied, `NotFoundError` / `OverconstrainedError` -> unavailable.
 */
export type DevicePermissionState = 'granted' | 'denied' | 'unavailable' | 'unknown';

export type MeetingRole = 'liber' | 'huber';

/** One side of the 1:1 call. A meeting only ever has two. */
export type MeetingParticipant = {
  id: string;
  name?: string;
  avatarUrl?: string;
  role: MeetingRole;
  isLocal: boolean;
  /** Mic state. For the local participant this is the source of truth for the toggle. */
  isMicOn: boolean;
  /** Camera state. For the local participant this is the source of truth for the toggle. */
  isCameraOn: boolean;
};

/** Metadata returned by `POST agora/recording/start`, required by `agora/recording/stop`. */
export type CloudRecordingInfo = {
  resourceId: string;
  sid: string;
  uid: string;
};

/**
 * A selectable `getDisplayMedia` source.
 *
 * `deviceId` is `undefined` for "share the whole screen with no picker", which is the
 * only form guaranteed on browsers that do not expose individual screen/window ids.
 */
export type ScreenShareSource = {
  deviceId: string;
  kind: 'screen' | 'window';
  label: string;
};

export type ScreenShareStatus =
  | 'idle'
  | 'picker-open'
  | 'starting'
  | 'sharing'
  | 'error';

/** A recoverable, user-facing failure raised out of the Agora lifecycle. */
export type MeetingError = {
  code: 'join-failed' | 'device-failed' | 'screen-share-failed' | 'agora-exception';
  message: string;
};
