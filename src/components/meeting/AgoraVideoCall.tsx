'use client';

import AgoraRTC from 'agora-rtc-sdk-ng';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Chat,
  Heart,
  Microphone,
  MicrophoneSlash,
  PhoneSlash,
  Screencast,
  VideoCamera,
  VideoCameraSlash,
  X,
} from '@phosphor-icons/react';

import IconButton from '../iconButton/IconButton';
import VideoComponent from './Video';
import { useAppSelector } from '@/libs/hooks';

import { useGetReadingSessionByIdQuery } from '@/libs/services/modules/reading-session';
import { Env } from '@/libs/Env.mjs';
import { mergeClassnames } from '@/components/private/utils';
import { HeaderIconButtonWithBadge } from '@/layouts/webapp/Header';
import { MessengerInput } from '@/components/messages/MessengerInput';

export default function AgoraVideoCall({ onEndCall }: { onEndCall: () => void }) {
  const urlParams = useSearchParams();
  const channel = urlParams.get('channel') || '';
  const sessionId = channel.split('-')[1];
  const token = urlParams.get('token')?.replace(/ /g, '+') || '';

  const t = useTranslations('Reading.AgoraMeeting');

  const { data: readingSession } = useGetReadingSessionByIdQuery(sessionId || 0, {
    skip: !sessionId,
  });

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  // Thêm state để theo dõi việc setup tracks
  const [tracksReady, setTracksReady] = useState(false);
  // Thêm state để track trạng thái microphone của remote user
  const [remoteMicOn, setRemoteMicOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenTrack, setScreenTrack] = useState<any>(null);
  // const [isRecording, setIsRecording] = useState(false);
  const [hasParticipantJoined, setHasParticipantJoined] = useState(false);
  const [isChatOpening, setIsChatOpening] = useState(false);

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
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
            setRemoteMicOn(true); // Remote user has audio track
          }
        });

        // Xử lý khi remote user unpublish (bật/tắt mic)
        agoraClient.on('user-unpublished', async (_user, mediaType) => {
          if (mediaType === 'audio') {
            setRemoteMicOn(false); // Remote user muted microphone
          }
        });

        await agoraClient.join(Env.NEXT_PUBLIC_AGORA_APP_ID, channel, token, 0);

        // Create microphone and camera tracking
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        await tracks[0]?.setEnabled(false);
        await tracks[1]?.setEnabled(false);

        // Update localTracks state
        setLocalTracks(tracks);
        setTracksReady(true);

        // Play video track in a local container
        if (tracks[1] && localRef.current) {
          tracks[1].play(localRef.current);
        }

        // Publish tracks to remote participant
        await agoraClient.publish(tracks);

        // **FIX: Xử lý existing users đã có sẵn trong channel**
        // Khi join vào channel, cần kiểm tra và subscribe tới remote users đã có sẵn
        const { remoteUsers } = agoraClient;

        // Sử dụng Promise.all để xử lý concurrent thay vì await trong loop
        const subscribePromises = remoteUsers.map(async (remoteUser) => {
          const promises = [];

          // Subscribe tới video track nếu user đã publish video
          if (remoteUser.hasVideo && !remoteUser.videoTrack) {
            const videoPromise = agoraClient
              .subscribe(remoteUser, 'video')
              .then(() => {
                if (remoteUser.videoTrack && remoteRef.current) {
                  remoteUser.videoTrack.play(remoteRef.current);
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

        // Chờ tất cả subscription hoàn thành
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
  }, [ready, channel, token]);

  const isVibing = Number(userInfo.id) === Number(readingSession?.reader?.id);
  const isHuber
    = Number(userInfo.id) === Number(readingSession?.humanBook?.id);

  const toggleScreenShare = async () => {
    if (!client) {
      return;
    }

    if (!isSharingScreen) {
      try {
        // Tắt camera trước khi share
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

        // Tạo track từ màn hình
        const sTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_1',
        });

        // Nếu trả về mảng, chỉ lấy video track
        const videoTrack = Array.isArray(sTrack) ? sTrack[0] : sTrack;

        // Hiển thị tại video local
        if (localRef.current && videoTrack) {
          videoTrack.play(localRef.current);
        }

        // Publish track màn hình
        await client.publish([videoTrack]);
        setScreenTrack(videoTrack);
        setIsSharingScreen(true);

        // Nếu người dùng dừng share từ phía OS
        videoTrack.on('track-ended', async () => {
          await client.unpublish([videoTrack]);
          videoTrack.stop();
          videoTrack.close();

          setScreenTrack(null);
          setIsSharingScreen(false);

          // Tái khởi động camera
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
      // Nếu đang share mà tắt
      if (screenTrack) {
        await client.unpublish([screenTrack]);
        screenTrack.stop();
        screenTrack.close();

        setScreenTrack(null);
        setIsSharingScreen(false);
      }

      // Tái khởi động camera
      const newTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

      setLocalTracks(newTracks);
      if (newTracks[1] && localRef.current) {
        newTracks[1].play(localRef.current);
      }
      await client.publish(newTracks);
    }
  };
  /**
   * Toggle camera on/off với improved error handling
   * tracks[1] là camera track, tracks[0] là microphone track
   */
  const toggleCamera = async () => {
    try {
      // Kiểm tra xem tracks đã sẵn sàng chưa
      if (!tracksReady || !localTracks[1]) {
        return;
      }

      const newState = !isCameraOn;

      // Enable/disable camera track
      await localTracks[1].setEnabled(newState);
      setIsCameraOn(newState);
    } catch (error) {
      // Silent error handling - could be replaced with proper error reporting
    }
  };
  /**
   * Toggle microphone on/off với improved error handling
   * tracks[0] là microphone track
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
      // Silent error handling - could be replaced with proper error reporting
    }
  };
  /**
   * End call and cleanup all resources
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

      onEndCall();
    } catch (error) {
      // Silent error handling - could be replaced with proper error reporting
    }
  };

  return (
    <div className="mx-0 my-2 flex size-full items-stretch justify-center gap-6 xl:m-6">
      <div className="flex size-full flex-col gap-4 rounded-[40px] rounded-tl-none bg-[#FFFFFF] p-4 shadow-popover xl:rounded-tl-[40px]">
        {/* Header with meeting info and controls */}
        <div className="flex items-center justify-between">
          <div />
          <div className="flex items-center gap-4 text-center text-2xl leading-8 text-primary-60">
            {/* {isRecording && ( */}
            {/*  <Chip */}
            {/*    disabled */}
            {/*    className={mergeClassnames('rounded-full border border-primary-80 bg-primary-60 text-sm leading-4 text-neutral-98', 'opacity-100')} */}
            {/*  > */}
            {/*    <Record color="#aa2727" weight="fill" /> */}
            {/*    <span>00:00:00</span> */}
            {/*  </Chip> */}
            {/* )} */}
            <h5 className="font-medium">
              {t('meeting_topic')}
              {': '}
              {readingSession.story.title}
            </h5>
          </div>

          <button type="button" onClick={() => setIsChatOpening(!isChatOpening)}>
            <HeaderIconButtonWithBadge badge={10} open={isChatOpening}>
              <Chat className="text-[28px] text-primary-60" />
            </HeaderIconButtonWithBadge>
          </button>
        </div>

        {/* Video display area */}
        <div className="relative">
          <VideoComponent
            agoraVideoPlayerRef={localRef}
            className="h-[700px]"
            isShowWaitingText={!hasParticipantJoined}
            isMicOn={isMicOn}
            isCamOn={isCameraOn}
            roleLabel={isVibing ? 'Liber' : 'Huber'}
            participantAvatarUrl={userInfo.photo?.path}
          />

          {/* Picture-in-picture video (remote) */}
          {hasParticipantJoined && (
            <div
              className="absolute right-2 top-2 h-[181px] w-[135px] rounded-3xl border-2 border-white bg-black xl:h-[181px] xl:w-[297px]"
            >
              <VideoComponent
                agoraVideoPlayerRef={remoteRef}
                isShowWaitingText={false}
                isMicOn={remoteMicOn}
                roleLabel={isVibing ? 'Huber' : 'Liber'}
                isLocal={false}
                participantName={readingSession?.humanBook?.fullName}
                participantAvatarUrl={readingSession?.humanBook?.photo?.path}
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
          <IconButton variant="outline" size="lg" className="!size-11 border-none bg-white p-2.5 shadow-sm">
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
      {isChatOpening && (
        <div className="flex w-1/3 flex-col overflow-hidden rounded-[20px] rounded-tr-none bg-neutral-90 shadow-popover">
          <div className="flex items-center justify-between bg-white px-3 py-2 text-neutral-10">
            <X className="invisible size-7" />
            <h6 className="text-xl font-medium">{t('chat')}</h6>
            <X className="size-7 cursor-pointer text-[#343330]" onClick={() => setIsChatOpening(false)} />
          </div>
          <div className="flex flex-1 flex-col bg-neutral-98" />
          <MessengerInput
            onSend={(value, type) =>
              console.log(value, type, 'send message')}
          />
        </div>
      )}
    </div>
  );
}
