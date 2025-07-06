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
  // Thêm state để track trạng thái microphone của remote user
  const [remoteMicOn, setRemoteMicOn] = useState(true);

  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenTrack, setScreenTrack] = useState<any>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const channel = urlParams.get('channel') || '';
  const sessionId = channel.split('-')[1];
  const token = urlParams.get('token')?.replace(/ /g, '+') || '';
  const { data: readingSession } = useGetReadingSessionByIdQuery(
    {
      id: sessionId || 0,
    },
    {
      skip: !sessionId,
    }
  );

  // Xác định vai trò của user hiện tại
  const isVibing = Number(userInfo?.id) === Number(readingSession?.reader?.id); // User là Liber (reader)
  const isHuber =
    Number(userInfo?.id) === Number(readingSession?.humanBook?.id); // User là Huber (humanBook)

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);

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
        await agoraClient.join(appId, channel, token, 0);

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
            setRemoteMicOn(true); // Remote user has audio track
          }
        });

        // Xử lý khi remote user unpublish (bật/tắt mic)
        agoraClient.on('user-unpublished', async (user, mediaType) => {
          if (mediaType === 'audio') {
            setRemoteMicOn(false); // Remote user muted microphone
          }
        });

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

    // Always return a cleanup function for consistent return behavior
    return cleanup;
  }, [ready, appId, channel, token]);

  const toggleScreenShare = async () => {
    if (!client) return;

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
              })
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

      if (isVibing) {
        router.push(
          `/after-meeting/${sessionId}?storyName=${readingSession.story.title}`
        );
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
          Meeting story: {readingSession.story.title}
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
        {/* Main video (local) - luôn là video của chính user hiện tại */}
        <VideoComponent
          localRef={localRef}
          isShowWaitingText
          isMicOn={isMicOn} // Trạng thái mic của user hiện tại
          showMicIndicator // Luôn hiển thị indicator cho local video
          roleLabel="You"
        />

        {/* Picture-in-picture video (remote) - là video của người kia */}
        <div className="absolute right-2 top-2 h-[181px] w-[135px] rounded-lg border border-gray-300 bg-white shadow-lg md:h-[181px] md:w-[297px]">
          <VideoComponent
            localRef={remoteRef}
            isShowWaitingText={false}
            height={181}
            isMicOn={remoteMicOn} // Trạng thái mic của remote user
            showMicIndicator // Hiển thị indicator cho remote video
            roleLabel={isVibing ? 'Huber' : 'Liber'}
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
                : '/assets/icons/meeting/voice-off.svg'
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
            src={
              !isSharingScreen
                ? '/assets/icons/meeting/share-screen.svg'
                : '/assets/icons/meeting/stop-share-screen.svg'
            }
            width={44}
            height={44}
            alt="share-screen-icon"
            loading="lazy"
            className="cursor-pointer"
            onClick={toggleScreenShare}
            title="Share Screen (Coming Soon)"
          />
        </div>
      </div>

      {/* Debug info (chỉ hiện trong development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 rounded bg-gray-100 p-2 text-xs">
          <div>Tracks Ready: {tracksReady ? '✅' : '❌'}</div>
          <div>Local Tracks: {localTracks.length}</div>
          <div>Local Camera: {isCameraOn ? 'ON' : 'OFF'}</div>
          <div>Local Microphone: {isMicOn ? 'ON' : 'OFF'}</div>
          <div>Remote Microphone: {remoteMicOn ? 'ON' : 'OFF'}</div>
          <div>Remote Users Count: {client?.remoteUsers?.length || 0}</div>
          <div>
            Remote Users:{' '}
            {client?.remoteUsers
              ?.map(
                (u: any) =>
                  `${u.uid}(${u.hasVideo ? 'V' : ''}${u.hasAudio ? 'A' : ''})`
              )
              .join(', ') || 'None'}
          </div>
          <div>User ID: {userInfo?.id}</div>
          <div>Reader ID: {readingSession?.reader?.id}</div>
          <div>HumanBook ID: {readingSession?.humanBook?.id}</div>
          <div>Is Vibing (Liber): {isVibing ? '✅' : '❌'}</div>
          <div>Is Huber: {isHuber ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
}
