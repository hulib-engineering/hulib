'use client';

import AgoraRTC from 'agora-rtc-sdk-ng';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionByIdQuery } from '@/libs/services/modules/reading-session';

import VideoComponent from './Video';

type Props = {
  appId: string;
};

export default function AgoraVideoCall({ appId }: Props) {
  const router = useRouter();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [ready, setReady] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);

  // Thêm state để theo dõi việc setup tracks
  const [tracksReady, setTracksReady] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const channel = urlParams.get('channel') || '';
  const [storyName, sessionId] = channel?.split('-') || [];
  const token = urlParams.get('token') || '';
  const { data: readingSession } = useGetReadingSessionByIdQuery(
    {
      id: sessionId || 0,
    },
    {
      skip: !sessionId,
    },
  );

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always return a cleanup function, even if we don't set up anything
    if (!ready) {
      // Return empty cleanup function for consistency
      return () => {};
    }

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);
    let tracks: any[] = [];

    const start = async () => {
      try {
        await agoraClient.join(appId, channel, token);

        // Tạo tracks cho microphone và camera
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        // Cập nhật localTracks state
        setLocalTracks(tracks);
        setTracksReady(true);

        // Play video track vào local container
        if (tracks[1] && localRef.current) {
          tracks[1].play(localRef.current);
        }

        // Publish tracks
        await agoraClient.publish(tracks);

        // Set up remote user handling
        agoraClient.on('user-published', async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          if (mediaType === 'video' && remoteRef.current) {
            user.videoTrack?.play(remoteRef.current);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });
      } catch (error) {
        // Silent error handling - could be replaced with proper error reporting
      }
    };

    start();

    // Cleanup function với proper function declaration
    const cleanup = () => {
      if (tracks.length > 0) {
        tracks.forEach((track) => {
          track.stop();
          track.close();
        });
      }
      agoraClient.leave();
      setTracksReady(false);
    };

    // Always return cleanup function for consistent return behavior
    return cleanup;
  }, [ready, appId, channel, token]);

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
   * End call và cleanup tất cả resources
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
      setIsCameraOn(true);
      setIsMicOn(true);
      setTracksReady(false);
      setReady(false); // reset để tránh rejoin
      const isLiber = readingSession?.reader.id === userInfo.id;
      if (!isLiber) {
        router.push(`/after-meeting/${sessionId}?storyName=${storyName}`);
      }
    } catch (error) {
      // Silent error handling - could be replaced with proper error reporting
    }
  };

  return (
    <div className="m-4 size-full rounded-lg bg-[#FFFFFF] p-6 shadow-lg">
      {/* Header với meeting info và controls */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-8 text-center text-2xl text-lp-primary-blue">
          <div className="flex items-center justify-center gap-2 rounded-full bg-[#0858FA] px-4 py-2 text-sm text-white">
            <Image
              src="/assets/icons/meeting/record.svg"
              width={20}
              height={20}
              alt="record-icon"
              loading="lazy"
            />
            <span>00:00:00</span>
          </div>
          Meeting topic: {storyName}
        </div>

        <Image
          src="/assets/icons/meeting/chat.svg"
          width={44}
          height={44}
          alt="chat-icon"
          loading="lazy"
          className="cursor-pointer"
          onClick={() => {}}
        />
      </div>

      {/* Video display area */}
      <div className="relative mt-4">
        {/* Main video (local) */}
        <VideoComponent localRef={localRef} isShowWaitingText />

        {/* Picture-in-picture video (remote) */}
        <div className="absolute right-2 top-2 h-[181px] w-[297px]">
          <VideoComponent
            localRef={remoteRef}
            isShowWaitingText={false}
            height={181}
            width={297}
            isSelf
            customClass=""
          />
        </div>
      </div>

      {/* Control panel */}
      <div className="mt-4 h-[76px] rounded-sm bg-[#F9F9F9] px-2 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Toggle Camera Button */}
          <Image
            src={
              isCameraOn
                ? '/assets/icons/meeting/camera-on.svg'
                : '/assets/icons/meeting/camera-off.svg'
            }
            width={44}
            height={44}
            alt="camera-icon"
            loading="lazy"
            className={`cursor-pointer transition-opacity ${
              tracksReady ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={toggleCamera}
            title={tracksReady ? 'Toggle Camera' : 'Camera not ready'}
          />

          {/* Toggle Microphone Button */}
          <Image
            src={
              isMicOn
                ? '/assets/icons/meeting/voice.svg'
                : '/assets/icons/meeting/mute-voice.svg'
            }
            width={44}
            height={44}
            alt="mic-icon"
            loading="lazy"
            className={`cursor-pointer transition-opacity ${
              tracksReady ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={toggleMic}
            title={tracksReady ? 'Toggle Microphone' : 'Microphone not ready'}
          />

          {/* End Call Button */}
          <Image
            src="/assets/icons/meeting/end-call.svg"
            width={44}
            height={44}
            alt="end-call-icon"
            loading="lazy"
            className="cursor-pointer"
            onClick={endCall}
            title="End Call"
          />

          {/* Share Screen Button (placeholder) */}
          <Image
            src="/assets/icons/meeting/share-screen.svg"
            width={44}
            height={44}
            alt="share-screen-icon"
            loading="lazy"
            className="cursor-pointer"
            onClick={() => {}}
            title="Share Screen (Coming Soon)"
          />
        </div>
      </div>

      {/* Debug info (chỉ hiện trong development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 rounded bg-gray-100 p-2 text-xs">
          <div>Tracks Ready: {tracksReady ? '✅' : '❌'}</div>
          <div>Local Tracks: {localTracks.length}</div>
          <div>Camera: {isCameraOn ? 'ON' : 'OFF'}</div>
          <div>Microphone: {isMicOn ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </div>
  );
}
