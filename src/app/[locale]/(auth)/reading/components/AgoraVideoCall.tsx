'use client';

import AgoraRTC from 'agora-rtc-sdk-ng';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VideoComponent from './Video';

type Props = {
  appId: string;
};

export default function AgoraVideoCall({ appId }: Props) {
  const [ready, setReady] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);

  const channel = 'dev';
  const token =
    '007eJxTYDjwNOOSd3Drrx1n22KOi7SYWHLIxVR+r5dqXycR3WOQ8E2BIcXYwtLE0MTYyMzMxCTN2MQyJdHILDXFxNwwJc08zdwi6LtpRkMgI0PWtWQWRgYIBPGZGVJSyxgYABgaHnQ=';

  useEffect(() => {
    if (!ready) return;

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);
    let tracks: any[] = [];

    const start = async () => {
      try {
        await agoraClient.join(appId, channel, token);
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks(tracks);

        tracks[1].play(localRef.current!);
        await agoraClient.publish(tracks);

        agoraClient.on('user-published', async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          if (mediaType === 'video') {
            user.videoTrack?.play(remoteRef.current!);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });
      } catch (error) {
        console.error('Failed to start Agora client:', error);
      }
    };

    start();

    return () => {
      if (tracks.length > 0) {
        tracks.forEach((track) => {
          track.stop();
          track.close();
        });
      }
      agoraClient.leave();
    };
  }, [ready]);

  const toggleCamera = async () => {
    if (!localTracks[1]) return;
    const newState = !isCameraOn;
    await localTracks[1].setEnabled(newState);
    setIsCameraOn(newState);
  };

  const toggleMic = async () => {
    if (!localTracks[0]) return;
    const newState = !isMicOn;
    await localTracks[0].setEnabled(newState);
    setIsMicOn(newState);
  };

  const endCall = async () => {
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
    setReady(false); // reset để tránh rejoin
  };

  return (
    <div className="m-4 size-full rounded-lg bg-[#FFFFFF] p-6 shadow-lg">
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
          Meeting topic: {channel}
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

      <div className="mt-4 relative">
        <VideoComponent localRef={localRef} isShowWaitingText />

        <div className="absolute h-[181px] w-[297px] right-2 top-2">
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

      <div className="mt-4 h-[76px] rounded-sm bg-[#F9F9F9] px-2 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Toggle Camera */}
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
            className="cursor-pointer"
            onClick={toggleCamera}
          />

          {/* Toggle Microphone */}
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
            className="cursor-pointer"
            onClick={toggleMic}
          />

          {/* End Call */}
          <Image
            src="/assets/icons/meeting/end-call.svg"
            width={44}
            height={44}
            alt="end-call-icon"
            loading="lazy"
            className="cursor-pointer"
            onClick={endCall}
          />

          {/* (Optional) Share screen */}
          <Image
            src="/assets/icons/meeting/share-screen.svg"
            width={44}
            height={44}
            alt="share-screen-icon"
            loading="lazy"
            className="cursor-pointer"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
