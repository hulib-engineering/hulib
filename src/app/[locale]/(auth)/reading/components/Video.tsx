import Image from 'next/image';
import React from 'react';

type VideoProps = {
  localRef?: React.RefObject<HTMLDivElement>;
  height?: number;
  width?: number;
  waitingText?: string;
  isShowWaitingText?: boolean;
  isSelf?: boolean;
  customClass?: string;
};

const VideoComponent = (props: VideoProps) => {
  const {
    localRef,
    height = 700,
    width = 700,
    waitingText = 'Waiting for partner to join...',
    isShowWaitingText = false,
    isSelf,
    customClass = '',
  } = props;

  return (
    <div
      className={`${customClass} flex w-full items-center justify-center rounded-[32px] bg-gray-100`}
      style={{ height: `${height}px` }}
    >
      <div
        ref={localRef}
        className="relative flex size-full items-center justify-center rounded-lg bg-[#2E3032] text-[#0858FA]"
      >
        <div className="absolute left-2 top-2 flex gap-2 z-[12312]">
          <div className="rounded-[100px] bg-[#FFFDF5] px-4 py-2 text-[#F3C00C]">
            {isSelf ? 'You' : 'Huber'}
          </div>

          <div className="rounded-[100px] bg-[#FFFDF5] px-4 py-2 text-[#F3C00C]">
            {isSelf ? 'You' : 'Huber Name'}
          </div>
        </div>

        <div className="absolute bottom-1/2 left-1/2 flex flex-col items-center gap-4 -translate-x-1/2">
          <Image
            alt="author-avatar"
            src="/assets/images/Avatar.png"
            width={168}
            height={168}
            className="size-6 rounded-full"
          />

          {isShowWaitingText && (
            <div className="text-center text-lg text-white">
              Waiting for partner to join...
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-2 flex flex-col items-center  z-[12312]">
          <Image
            src="/assets/icons/meeting/mute-voice.svg"
            width={44}
            height={44}
            alt="arrow-icon"
            loading="lazy"
            onClick={() => {}}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
