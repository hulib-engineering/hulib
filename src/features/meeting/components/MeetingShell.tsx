'use client';

import { Chat } from '@phosphor-icons/react';
import type { ICameraVideoTrack, IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import type { MeetingParticipant } from '../types';
import { useMeetingSession } from '../hooks/useMeetingSession';
import { useMeetingDevices } from '../hooks/useMeetingDevices';
import { useMeetingRecording } from '../hooks/useMeetingRecording';
import { useMeetingSocket } from '../hooks/useMeetingSocket';
import { useScreenShare } from '../hooks/useScreenShare';
import { resolveLayoutMode } from '../utils/layout';
import { ControlBar } from './ControlBar';
import { DeviceStatusBanner } from './DeviceStatusBanner';
import { EndCallConfirmModal } from './EndCallConfirmModal';
import { ParticipantTile } from './ParticipantTile';
import { ReconnectingOverlay } from './ReconnectingOverlay';
import { RecordingBadge } from './RecordingBadge';
import { RecordingConsentModal } from './RecordingConsentModal';
import { ScreenSharePicker } from './ScreenSharePicker';
import { HeaderIconButtonWithBadge } from '@/app/[locale]/(auth)/_components/Header';
import ChatInCall from '@/layouts/reading/ChatInCall';
import Popover from '@/components/core/popover/Popover';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';

export type MeetingShellProps = {
  channel: string;
  token: string;
  sessionId?: string;
  storyTitle: string;
  localUser: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
  remoteParticipant: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
  /** True when the viewer is the Liber (the reader), who alone is prompted to record. */
  isViewerLiber: boolean;
  onEndCall: (recordedInfo?: { resourceId: string; sid: string; uid: string }) => void;
};

/**
 * The 1:1 meeting room.
 *
 * Layout note: the remote participant occupies the large stage and the local user
 * is the picture-in-picture tile. This is the reverse of the previous arrangement,
 * where the local user filled the main stage.
 */
export function MeetingShell({
  channel,
  token,
  sessionId,
  storyTitle,
  localUser,
  remoteParticipant,
  isViewerLiber,
  onEndCall,
}: MeetingShellProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const remoteVideoTrackRef = useRef<IRemoteVideoTrack | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isEndCallOpen, setIsEndCallOpen] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLocalReactionShown, setIsLocalReactionShown] = useState(false);

  const handleLocalVideoTrack = useCallback((track: ICameraVideoTrack) => {
    localVideoTrackRef.current = track;
    if (localVideoRef.current) {
      track.play(localVideoRef.current);
    }
  }, []);

  const handleRemoteVideoTrack = useCallback((track: IRemoteVideoTrack) => {
    remoteVideoTrackRef.current = track;
    if (remoteVideoRef.current) {
      track.play(remoteVideoRef.current);
    }
  }, []);

  const handleRemoteAudioTrack = useCallback((track: IRemoteAudioTrack) => {
    // Remote audio has no container — it plays into the page directly.
    track.play();
  }, []);

  const session = useMeetingSession({
    channel,
    token,
    sessionId,
    onLocalVideoTrack: handleLocalVideoTrack,
    onRemoteVideoTrack: handleRemoteVideoTrack,
    onRemoteAudioTrack: handleRemoteAudioTrack,
  });

  const devices = useMeetingDevices({
    micTrack: session.micTrack,
    cameraTrack: session.cameraTrack,
    isReady: session.isJoined,
    isMicOn: session.isMicOn,
    isCameraOn: session.isCameraOn,
    onMicChange: session.setIsMicOn,
    onCameraChange: session.setIsCameraOn,
    onError: () => pushError(t('generic_error')),
  });

  const recording = useMeetingRecording({
    channel,
    isPromptedUser: isViewerLiber,
    hasParticipantJoined: session.hasParticipantJoined,
  });

  const meetingSocket = useMeetingSocket({
    remoteParticipantId: remoteParticipant.id,
  });

  /** Unpublishes the camera before sharing; returns the track so it can be released. */
  const suspendCamera = useCallback(async () => {
    const track = session.cameraTrack;
    if (!track) {
      return null;
    }
    try {
      await session.client?.unpublish([track]);
    } catch {
      // The track may already be gone if the peer left mid-teardown.
    }
    return track;
  }, [session.cameraTrack, session.client]);

  /** Recreates the camera after a share ends and re-publishes it. */
  const restoreCamera = useCallback(async () => {
    const { default: AgoraRTC } = await import('agora-rtc-sdk-ng');
    const camera = await AgoraRTC.createCameraVideoTrack();

    // The camera was torn down for the share, so the toggle has to reflect that
    // it is off until the user turns it back on. Leaving the previous flag would
    // claim the camera is live while nothing is published.
    session.setIsCameraOn(false);
    session.setCameraTrack(camera);
    localVideoTrackRef.current = camera;

    if (localVideoRef.current) {
      camera.play(localVideoRef.current);
    }

    await session.publishTrack(camera);

    return camera;
  }, [session]);

  const screenShare = useScreenShare({
    publishTrack: session.publishTrack,
    unpublishTrack: session.unpublishTrack,
    suspendCamera,
    restoreCamera,
    onError: () => pushError(t('share_failed')),
  });

  const layoutMode = resolveLayoutMode(screenShare.isSharing);

  // Spotlight and rail mount the same tracks into different DOM containers, so
  // a track has to be re-attached after the swap or its tile goes black.
  useEffect(() => {
    const localTrack = localVideoTrackRef.current;
    if (localTrack && localVideoRef.current) {
      localTrack.play(localVideoRef.current);
    }

    const remoteTrack = remoteVideoTrackRef.current;
    if (remoteTrack && remoteVideoRef.current) {
      remoteTrack.play(remoteVideoRef.current);
    }
  }, [layoutMode]);

  const localParticipant: MeetingParticipant = useMemo(() => ({
    id: localUser.id,
    name: localUser.name,
    avatarUrl: localUser.avatarUrl,
    role: isViewerLiber ? 'liber' : 'huber',
    isLocal: true,
    isMicOn: session.isMicOn,
    isCameraOn: session.isCameraOn,
  }), [localUser, isViewerLiber, session.isMicOn, session.isCameraOn]);

  const remoteTileParticipant: MeetingParticipant = useMemo(() => ({
    id: remoteParticipant.id ?? '',
    name: remoteParticipant.name,
    avatarUrl: remoteParticipant.avatarUrl,
    role: isViewerLiber ? 'huber' : 'liber',
    isLocal: false,
    isMicOn: session.remoteMicOn,
    isCameraOn: session.remoteCameraOn,
  }), [remoteParticipant, isViewerLiber, session.remoteMicOn, session.remoteCameraOn]);

  /** `ChatInCall` addresses peers by numeric id; a missing id still has to be a number. */
  const chatParticipantId = useMemo(
    () => Number(remoteParticipant.id ?? 0),
    [remoteParticipant.id],
  );

  const handleReact = useCallback(() => {
    meetingSocket.sendReaction();
    setIsLocalReactionShown(true);
    setTimeout(() => setIsLocalReactionShown(false), 5000);
  }, [meetingSocket]);

  const handleEndCall = useCallback(async () => {
    setIsEnding(true);
    try {
      // Stop sharing first so the camera teardown does not fight a live track.
      if (screenShare.isSharing) {
        await screenShare.stop();
      }

      const recordedInfo = await recording.stop();

      meetingSocket.notifyCallEnded();
      onEndCall(recordedInfo ?? undefined);
    } finally {
      setIsEnding(false);
      setIsEndCallOpen(false);
    }
  }, [screenShare, recording, meetingSocket, onEndCall]);

  // Toast exactly once when the connection comes back after a loss.
  const wasConnectedRef = useRef(false);
  useEffect(() => {
    if (session.connectionState === 'connected') {
      if (wasConnectedRef.current) {
        pushSuccess(t('connection_restored'));
      }
      wasConnectedRef.current = true;
    }
  }, [session.connectionState, t]);

  useEffect(() => {
    if (session.error) {
      pushError(t('join_failed'));
    }
  }, [session.error, t]);

  // Announce arrivals and departures once each.
  const wasJoinedRef = useRef(false);
  useEffect(() => {
    if (session.hasParticipantJoined && !wasJoinedRef.current) {
      wasJoinedRef.current = true;
      pushSuccess(t('participant_joined'));
    } else if (!session.hasParticipantJoined && wasJoinedRef.current) {
      wasJoinedRef.current = false;
      pushSuccess(t('participant_left'));
    }
  }, [session.hasParticipantJoined, t]);

  const renderStage = () => {
    if (screenShare.isSharing) {
      return (
        <div className="flex size-full items-center justify-center rounded-3xl bg-black">
          <p className="text-sm text-neutral-70">{t('screen_label')}</p>
        </div>
      );
    }

    return (
      <div className="relative size-full rounded-3xl">
        <ParticipantTile
          videoRef={remoteVideoRef}
          participant={remoteTileParticipant}
          isWaiting={!session.hasParticipantJoined}
        />
        <ReconnectingOverlay connectionState={session.connectionState} />
      </div>
    );
  };

  const renderLocalTile = (isCompact: boolean) => (
    <ParticipantTile
      videoRef={localVideoRef}
      participant={localParticipant}
      isReactionShown={isLocalReactionShown || meetingSocket.isReactionReceived}
      isCompact={isCompact}
    />
  );

  return (
    <div
      className={mergeClassnames(
        // `size-full` is load-bearing: without an explicit width the shell
        // shrink-to-fits to its content, collapsing the room into a narrow
        // phone-shaped card on wide desktop viewports.
        'mx-0 my-2 flex size-full items-stretch justify-center gap-6 xl:m-6',
      )}
    >
      <div
        className={mergeClassnames(
          // `min-w-0` lets the card shrink so the rail can sit flush against the
          // right edge instead of pushing into a reserved gutter.
          'flex size-full min-w-0 flex-col gap-4 rounded-[40px] rounded-tl-none bg-[#FFFFFF] p-4 shadow-popover',
          'xl:rounded-tl-[40px]',
        )}
      >
        {/* Header: recording pill, topic, chat toggle. */}
        <div className="relative flex items-center justify-between">
          <div className="flex-1" />

          <div className="flex items-center gap-4 text-center leading-8 text-primary-60 xl:text-2xl">
            {recording.isRecording && recording.startedAt !== null && (
              <RecordingBadge startedAt={recording.startedAt} />
            )}
            <h5 className="font-medium">
              {`${t('meeting_topic')}: ${storyTitle}`}
            </h5>
          </div>

          <div className="flex flex-1 justify-end">
            {/* Below `xl` the chat is a popover; at `xl` and up it docks beside the card. */}
            <Popover position="bottom-end" className="xl:hidden">
              <Popover.Trigger>
                <HeaderIconButtonWithBadge badge={unreadCount}>
                  <Chat className="text-[28px] text-primary-60" />
                </HeaderIconButtonWithBadge>
              </Popover.Trigger>
              <Popover.Panel className="mt-2 h-[612px] w-[301px] rounded-none bg-transparent p-0">
                {({ close }) => (
                  <ChatInCall
                    participantId={chatParticipantId}
                    participantAvatarUrl={remoteParticipant.avatarUrl}
                    participantName={remoteParticipant.name}
                    isShow
                    onClose={close}
                    onUnreadCountChange={setUnreadCount}
                  />
                )}
              </Popover.Panel>
            </Popover>

            <button
              type="button"
              aria-label={isChatOpen ? t('close_chat') : t('open_chat')}
              className="hidden xl:block"
              onClick={() => setIsChatOpen(open => !open)}
            >
              <HeaderIconButtonWithBadge badge={unreadCount} open={isChatOpen}>
                <Chat className="text-[28px] text-primary-60" />
              </HeaderIconButtonWithBadge>
            </button>
          </div>
        </div>

        {/* Spotlight stage, or the shared screen in rail mode. */}
        <div className="relative h-[612px] xl:h-[732px]">
          {renderStage()}

          <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
            <DeviceStatusBanner
              micPermission={devices.micPermission}
              cameraPermission={devices.cameraPermission}
            />
          </div>

          {/* Local user is picture-in-picture over the stage when not sharing. */}
          {!screenShare.isSharing && (
            <div
              className={mergeClassnames(
                'absolute right-2 top-2 h-[181px] w-[135px] overflow-hidden rounded-3xl border-2 border-white',
                'xl:w-[297px]',
              )}
            >
              {renderLocalTile(false)}
            </div>
          )}
        </div>

        <div className="relative">
          <ControlBar
            isMicOn={session.isMicOn}
            isCameraOn={session.isCameraOn}
            isSharingScreen={screenShare.isSharing}
            isReady={session.isJoined}
            isReactionPlaying={isLocalReactionShown}
            onToggleMic={devices.toggleMic}
            onToggleCamera={devices.toggleCamera}
            onEndCall={() => setIsEndCallOpen(true)}
            onShareScreen={screenShare.isSharing ? screenShare.stop : screenShare.openPicker}
            onReact={handleReact}
          >
            {screenShare.isPickerOpen && (
              <ScreenSharePicker
                sources={screenShare.sources}
                includeAudio={screenShare.includeAudio}
                onIncludeAudioChange={screenShare.setIncludeAudio}
                onSelect={(source) => {
                  screenShare.closePicker();
                  void screenShare.start(source);
                }}
                onClose={screenShare.closePicker}
              />
            )}
          </ControlBar>
        </div>
      </div>

      {/* Rail: both participants stack outside the card while a screen is shared. */}
      {layoutMode === 'rail' && (
        <div className="hidden shrink-0 flex-col gap-4 xl:flex">
          <div className="h-[181px] w-[248px] overflow-hidden rounded-3xl">
            {renderLocalTile(true)}
          </div>
          <div className="h-[181px] w-[248px] overflow-hidden rounded-3xl">
            <ParticipantTile
              videoRef={remoteVideoRef}
              participant={remoteTileParticipant}
              isCompact
            />
          </div>
        </div>
      )}

      {/* Docked chat: a flex sibling that the card shrinks to make room for. */}
      {isChatOpen && (
        <ChatInCall
          participantId={chatParticipantId}
          participantAvatarUrl={remoteParticipant.avatarUrl}
          participantName={remoteParticipant.name}
          isShow
          onClose={() => setIsChatOpen(false)}
          onUnreadCountChange={setUnreadCount}
        />
      )}

      <RecordingConsentModal
        open={recording.isConsentOpen}
        isStarting={false}
        onAccept={() => void recording.start()}
        onDecline={recording.decline}
      />

      <EndCallConfirmModal
        open={isEndCallOpen}
        isEnding={isEnding}
        onConfirm={() => void handleEndCall()}
        onCancel={() => setIsEndCallOpen(false)}
      />
    </div>
  );
}
