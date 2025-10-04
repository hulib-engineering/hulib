'use client';

import {
  Chat,
  Heart,
  Microphone,
  MicrophoneSlash,
  PhoneSlash,
  Screencast,
  VideoCamera,
  VideoCameraSlash,
} from '@phosphor-icons/react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import Popover from '@/components/core/popover/Popover';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import { PlayableAgoraMeetView } from '@/components/meeting/PlayableAgoraMeetView';
import ChatInCall from '@/layouts/reading/ChatInCall';
import RecordingTimer from '@/layouts/reading/RecordingTimer';
import { HeaderIconButtonWithBadge } from '@/layouts/webapp/Header';
import { Env } from '@/libs/Env.mjs';
import { useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';
import { useStartCloudRecordingMutation } from '@/libs/services/modules/agora';
import { useGetReadingSessionByIdQuery } from '@/libs/services/modules/reading-session';

export default function AgoraMeeting({ onEndCall }: { onEndCall: (recordedInfo?: { resourceId: string; sid: string; uid: string }) => void }) {
  const urlParams = useSearchParams();
  const channel = urlParams.get('channel') || '';
  const sessionId = channel.split('-')[1];
  const token = urlParams.get('token')?.replace(/ /g, '+') || '';

  const t = useTranslations('Reading.AgoraMeeting');

  const { data: readingSession } = useGetReadingSessionByIdQuery(sessionId || 0, {
    skip: !sessionId,
  });
  const [startRecording] = useStartCloudRecordingMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [tracksReady, setTracksReady] = useState(false);
  const [remoteMicOn, setRemoteMicOn] = useState(false);
  const [remoteCameraOn, setRemoteCameraOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenTrack, setScreenTrack] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasParticipantJoined, setHasParticipantJoined] = useState(false);
  const [isChatOpening, setIsChatOpening] = useState(false);
  const [isRecordingAlertModalOpen, setIsRecordingAlertModalOpen] = useState(false);
  const [cloudRecordingData, setCloudRecordingData] = useState<{ resourceId: string; sid: string; uid: string } | undefined>(undefined);
  const [heartShown, setHeartShown] = useState(false);
  const [miniHeartShown, setMiniHeartShown] = useState(false);
  const [unreadChatInCallMessageCount, setUnreadChatInCallMessageCount] = useState(0);

  const { emit } = useSocket({
    namespace: '',
    listeners: {
      reaction: () => {
        setMiniHeartShown(true);
        setTimeout(() => {
          setMiniHeartShown(false);
        }, 5000);
      },
    },
  });

  const isVibing = Number(userInfo.id) === Number(readingSession?.reader?.id);
  const remoteParticipant = isVibing ? readingSession?.humanBook : readingSession?.reader;

  useEffect(() => {
    // Always return a cleanup function, even if we don't set up anything
    if (!ready) {
      // Return an empty cleanup function for consistency
      return () => {};
    }

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);
    let tracks: any[] = [];

    const start = async () => {
      try {
        // Listen for when a remote user joins
        agoraClient.on('user-joined', (_user) => {
          setHasParticipantJoined(true);

          if (isVibing && agoraClient.remoteUsers.length >= 1 && agoraClient.uid) {
            setIsRecordingAlertModalOpen(true);
          }
        });
        // Listen for when a remote user leaves
        agoraClient.on('user-left', (_user) => {
          setHasParticipantJoined(false);
        });
        // Set up remote user handling
        agoraClient.on('user-published', async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          if (mediaType === 'video' && remoteRef.current) {
            user.videoTrack?.play(remoteRef.current);
            setRemoteCameraOn(true); // Remote user has camera track
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
            setRemoteMicOn(true); // Remote user has audio track
          }
        });
        // Xử lý khi remote user unpublish (bật/tắt mic)
        agoraClient.on('user-unpublished', async (_user, mediaType) => {
          if (mediaType === 'video') {
            setRemoteCameraOn(false); // Remote user muted camera
          }
          if (mediaType === 'audio') {
            setRemoteMicOn(false); // Remote user muted microphone
          }
        });

        await agoraClient.join(Env.NEXT_PUBLIC_AGORA_APP_ID, channel, token, 0);

        // Create microphone and camera tracking
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        // Update localTracks state
        setLocalTracks(tracks);
        setTracksReady(true);

        // Play video track in a local container
        if (tracks[1] && localRef.current) {
          tracks[1].play(localRef.current);
        }

        // Publish tracks to remote participant
        await agoraClient.publish(tracks);

        // await tracks[0]?.setEnabled(false);
        // await tracks[1]?.setEnabled(false);

        // **FIX: Xử lý existing users đã có sẵn trong channel**
        // When joining the channel, need to check and subscribe to available remote user
        const { remoteUsers } = agoraClient;

        const subscribePromises = remoteUsers.map(async (remoteUser) => {
          const promises = [];

          // Subscribe tới video track nếu user đã publish video
          if (remoteUser.hasVideo && !remoteUser.videoTrack) {
            const videoPromise = agoraClient
              .subscribe(remoteUser, 'video')
              .then(() => {
                if (remoteUser.videoTrack && remoteRef.current) {
                  remoteUser.videoTrack.play(remoteRef.current);
                  setRemoteCameraOn(true);
                }
              });
            promises.push(videoPromise);
          }

          // Subscribe tới audio track nếu user đã publish audio
          if (remoteUser.hasAudio && !remoteUser.audioTrack) {
            const audioPromise = agoraClient
              .subscribe(remoteUser, 'audio')
              .then(() => {
                if (remoteUser.audioTrack) {
                  remoteUser.audioTrack.play();
                  setRemoteMicOn(true);
                }
              });
            promises.push(audioPromise);
          }

          return Promise.all(promises);
        });

        await Promise.all(subscribePromises);
      } catch (error) {
        // Silent error handling could be replaced with proper error reporting
      }
    };

    start();

    // Cleanup function với proper function declaration
    // Always return a cleanup function for consistent return behavior
    return () => {
      if (tracks.length > 0) {
        tracks.forEach((track) => {
          if (track) {
            track.stop();
            track.close();
          }
        });
      }
      agoraClient.leave();
      setTracksReady(false);
    };
  }, [ready, channel, token, isVibing]);

  const isHuber
    = Number(userInfo.id) === Number(readingSession?.humanBook?.id);

  const startRecordingSession = async () => {
    try {
      const recordingData = await startRecording({
        channel,
      }).unwrap();
      setIsRecording(true);
      setCloudRecordingData(recordingData);
    } catch (e) {
      pushError('Cannot start recording this session!');
    }
  };
  const handleEnableRecording = async () => {
    setIsRecordingAlertModalOpen(false);
    await startRecordingSession();
  };
  const toggleScreenShare = async () => {
    if (!client) {
      return;
    }

    if (!isSharingScreen) {
      try {
        // Turn off camera and before sharing
        if (localTracks[1]) {
          if (Array.isArray(localTracks[1])) {
            await Promise.all(
              localTracks[1].map(async (track) => {
                await client.unpublish([track]);
                track.stop();
                track.close();
              }),
            );
          } else {
            await client.unpublish([localTracks[1]]);
            localTracks[1].stop();
            localTracks[1].close();
          }
        }

        // Create a screen track
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_1',
        });

        const videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;

        // Hiển thị tại video local
        if (localRef.current && videoTrack) {
          videoTrack.play(localRef.current);
        }

        // Publish this screen track
        await client.publish([videoTrack]);
        setScreenTrack(videoTrack);
        setIsSharingScreen(true);

        videoTrack.on('track-ended', async () => {
          await client.unpublish([videoTrack]);
          videoTrack.stop();
          videoTrack.close();

          setScreenTrack(null);
          setIsSharingScreen(false);

          // Resetting camera and microphone
          const newTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

          setLocalTracks(newTracks);
          if (newTracks[1] && localRef.current) {
            newTracks[1].play(localRef.current);
          }
          await client.publish(newTracks);
        });
      } catch (error) {
        console.error('Share screen failed!', error);
      }
    } else {
      // If the share screen is on, toggle it off
      if (screenTrack) {
        await client.unpublish([screenTrack]);
        screenTrack.stop();
        screenTrack.close();

        setScreenTrack(null);
        setIsSharingScreen(false);
      }

      // Still resetting camera and microphone
      const newTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

      setLocalTracks(newTracks);
      if (newTracks[1] && localRef.current) {
        newTracks[1].play(localRef.current);
      }
      await client.publish(newTracks);
    }
  };
  /**
   * Toggle camera on/off and improved error handling
   * Second track is camera track, first one is a microphone track
   */
  const toggleCamera = async () => {
    try {
      if (!tracksReady || !localTracks[1]) {
        return;
      }

      const newState = !isCameraOn;

      // Enable/disable camera track
      await localTracks[1].setEnabled(newState);
      setIsCameraOn(newState);
    } catch (error) {
      // Silent error handling could be replaced with proper error reporting
    }
  };
  /**
   * Toggle microphone on/off and improved error handling
   * tracks[0] is microphone track
   */
  const toggleMic = async () => {
    try {
      if (!tracksReady || !localTracks[0]) {
        return;
      }

      const newState = !isMicOn;

      // Enable/disable microphone track
      await localTracks[0].setEnabled(newState);
      setIsMicOn(newState);
    } catch (error) {
      // Silent error handling could be replaced with proper error reporting
    }
  };
  /**
   * End call and clean up all resources
   */
  const endCall = async () => {
    try {
      if (localTracks.length > 0) {
        localTracks.forEach((track) => {
          track.stop();
          track.close();
        });
      }

      await client?.leave();
      setLocalTracks([]);
      setIsCameraOn(false);
      setIsMicOn(false);
      setTracksReady(false);
      setReady(false); // avoid rejoining

      onEndCall(cloudRecordingData);
    } catch (error) {
      // Silent error handling could be replaced with proper error reporting
    }
  };
  const handleReact = async () => {
    emit('reaction', { recipientId: remoteParticipant?.id });
    setHeartShown(true);
    setTimeout(() => {
      setHeartShown(false);
    }, 5000);
  };

  return (
    <div className="mx-0 my-2 flex size-full items-stretch justify-center gap-6 xl:m-6">
      <Modal
        open={isRecordingAlertModalOpen && !isRecording}
        disableClosingTrigger
        onClose={() => setIsRecordingAlertModalOpen(false)}
      >
        <Modal.Backdrop className="bg-[#2E3032]/50" />
        <Modal.Panel className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl px-5 py-6">
          <h6 className="text-xl font-medium text-neutral-10">{t('recording_title')}</h6>
          <p className="text-center text-sm font-medium text-neutral-20">
            {t('recording_detail')}
          </p>
          <div className="flex w-full items-center gap-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsRecordingAlertModalOpen(false)}
            >
              {t('not_record')}
            </Button>
            <Button fullWidth onClick={handleEnableRecording}>
              {t('start_recording')}
            </Button>
          </div>
        </Modal.Panel>
      </Modal>
      <div
        className={mergeClassnames(
          'flex size-full flex-col gap-4 rounded-[40px] rounded-tl-none bg-[#FFFFFF] p-4 shadow-popover',
          'xl:rounded-tl-[40px]',
        )}
      >
        {/* Header with meeting info and controls */}
        <div className="flex items-center justify-between">
          <div />
          <div className="flex items-center gap-4 text-center leading-8 text-primary-60 xl:text-2xl">
            {isRecording && <RecordingTimer />}
            <h5 className="font-medium">
              {t('meeting_topic')}
              {': '}
              {readingSession.story.title}
            </h5>
          </div>

          <Popover position="bottom-end" className="xl:hidden">
            <Popover.Trigger data-testid="chat-in-call-trigger">
              <HeaderIconButtonWithBadge badge={unreadChatInCallMessageCount}>
                <Chat className="text-[28px] text-primary-60" />
              </HeaderIconButtonWithBadge>
            </Popover.Trigger>
            <Popover.Panel className="mt-2 h-[612px] w-[301px] rounded-none bg-transparent p-0">
              {({ close }) => (
                <ChatInCall
                  participantId={remoteParticipant?.id}
                  participantAvatarUrl={remoteParticipant?.photo?.path}
                  isShow
                  onClose={close}
                  onUnreadCountChange={count => setUnreadChatInCallMessageCount(count)}
                />
              )}
            </Popover.Panel>
          </Popover>
          <button type="button" className="hidden xl:block" onClick={() => setIsChatOpening(!isChatOpening)}>
            <HeaderIconButtonWithBadge badge={unreadChatInCallMessageCount} open={isChatOpening}>
              <Chat className="text-[28px] text-primary-60" />
            </HeaderIconButtonWithBadge>
          </button>
        </div>

        {/* Video display area */}
        <div className="relative">
          <PlayableAgoraMeetView
            agoraVideoPlayerRef={localRef}
            className="h-[612px] xl:h-[732px]"
            isShowWaitingText={!hasParticipantJoined}
            isMicOn={isMicOn}
            isCamOn={isCameraOn}
            isReactionShown={heartShown}
            roleLabel={isVibing ? 'Liber' : 'Huber'}
            participantAvatarUrl={userInfo.photo?.path}
          />

          {/* Picture-in-picture video (remote) */}
          {hasParticipantJoined && (
            <div
              className="absolute right-2 top-2 h-[181px] w-[135px] rounded-3xl border-2 border-white bg-black xl:h-[181px] xl:w-[297px]"
            >
              <PlayableAgoraMeetView
                agoraVideoPlayerRef={remoteRef}
                isShowWaitingText={false}
                isMicOn={remoteMicOn}
                isCamOn={remoteCameraOn}
                isReactionShown={miniHeartShown}
                roleLabel={isVibing ? 'Huber' : 'Liber'}
                isLocal={false}
                participantName={remoteParticipant?.fullName}
                participantAvatarUrl={remoteParticipant?.photo?.path}
              />
            </div>
          )}
        </div>

        {/* Control panel */}
        <div className="flex items-center justify-between rounded-[40px] bg-neutral-98 shadow-sm">
          <IconButton size="lg" className="invisible !size-11" />
          <div className="flex items-center gap-4">
            {/* Toggle Camera Button */}
            <IconButton
              size="lg"
              className={mergeClassnames(
                '!size-11 bg-primary-60 transition-opacity',
                tracksReady ? 'opacity-100' : 'opacity-50',
              )}
              onClick={toggleCamera}
            >
              {isCameraOn ? <VideoCameraSlash /> : <VideoCamera />}
            </IconButton>

            {/* Toggle Microphone Button */}
            <IconButton
              size="lg"
              className={mergeClassnames(
                '!size-11 bg-primary-60 transition-opacity backdrop-blur-[15px]',
                tracksReady ? 'opacity-100' : 'opacity-50',
              )}
              onClick={toggleMic}
            >
              {isMicOn ? <MicrophoneSlash /> : <Microphone />}
            </IconButton>

            {/* End Call Button */}
            <IconButton
              size="lg"
              className={mergeClassnames(
                '!size-11 border border-red-50 bg-red-50 transition-opacity backdrop-blur-[15px]',
                tracksReady ? 'opacity-100' : 'opacity-50',
              )}
              onClick={endCall}
            >
              <PhoneSlash />
            </IconButton>

            {/* Share Screen Button */}
            <IconButton
              variant="outline"
              className={mergeClassnames(
                '!size-11 p-2.5 transition-opacity border-primary-60 text-primary-60',
                tracksReady ? 'opacity-100' : 'opacity-50',
              )}
              onClick={toggleScreenShare}
            >
              <Screencast size={24} />
            </IconButton>
          </div>
          <IconButton
            variant="outline"
            size="lg"
            disabled={heartShown}
            className="!size-11 border-none bg-white p-2.5 shadow-sm"
            onClick={handleReact}
          >
            <Heart size={24} color="#FF2C94" />
          </IconButton>
        </div>

        {/* Debug info (only development environment) */}
        {Env.NODE_ENV === 'development' && (
          <div className="rounded bg-gray-100 p-2 text-xs">
            <div>
              Tracks Ready:
              {tracksReady ? '✅' : '❌'}
            </div>
            <div>
              Local Tracks:
              {localTracks.length}
            </div>
            <div>
              Local Camera:
              {isCameraOn ? 'ON' : 'OFF'}
            </div>
            <div>
              Local Microphone:
              {isMicOn ? 'ON' : 'OFF'}
            </div>
            <div>
              Remote Microphone:
              {remoteMicOn ? 'ON' : 'OFF'}
            </div>
            <div>
              Remote Users Count:
              {client?.remoteUsers?.length || 0}
            </div>
            <div>
              Remote Users:
              {' '}
              {client?.remoteUsers
                ?.map(
                  (u: any) =>
                    `${u.uid}(${u.hasVideo ? 'V' : ''}${u.hasAudio ? 'A' : ''})`,
                )
                .join(', ') || 'None'}
            </div>
            <div>
              User ID:
              {userInfo?.id}
            </div>
            <div>
              Reader ID:
              {readingSession?.reader?.id}
            </div>
            <div>
              HumanBook ID:
              {readingSession?.humanBook?.id}
            </div>
            <div>
              Is Vibing (Liber):
              {isVibing ? '✅' : '❌'}
            </div>
            <div>
              Is Huber:
              {isHuber ? '✅' : '❌'}
            </div>
          </div>
        )}
      </div>
      <ChatInCall
        participantId={remoteParticipant?.id}
        participantAvatarUrl={remoteParticipant?.photo?.path}
        isShow={isChatOpening}
        onClose={() => setIsChatOpening(false)}
        onUnreadCountChange={count => setUnreadChatInCallMessageCount(count)}
      />
    </div>
  );
}
