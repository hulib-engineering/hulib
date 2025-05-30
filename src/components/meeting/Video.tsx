import Image from 'next/image';

type VideoProps = {
  localRef?: React.RefObject<HTMLDivElement>;
  height?: number;
  width?: number;
  waitingText?: string;
  isShowWaitingText?: boolean;
  isSelf?: boolean;
  customClass?: string;
  isVibing?: boolean;
  isMicOn?: boolean;
  showMicIndicator?: boolean;
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
    isVibing,
    isMicOn,
    showMicIndicator,
  } = props;

  return (
    <div
      className={`${customClass} flex w-full items-center justify-center rounded-[32px] bg-gray-100`}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <div
        ref={localRef}
        className="relative flex size-full items-center justify-center rounded-lg bg-[#2E3032] text-[#0858FA]"
      >
        <div className="absolute left-2 top-2 z-[12312] flex gap-2">
          <div className="rounded-[100px] bg-[#FFFDF5] px-4 py-2 text-[#F3C00C]">
            {isSelf ? 'You' : isVibing ? 'Liber' : 'Huber'}
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
            <div className="text-center text-lg text-white">{waitingText}</div>
          )}
        </div>

        {/* Microphone indicator - chỉ hiện khi showMicIndicator = true */}
        {showMicIndicator && (
          <div className="absolute bottom-2 left-2 z-[12312] flex flex-col items-center">
            <Image
              src={
                isMicOn
                  ? '/assets/icons/meeting/voice-2-on.svg'
                  : '/assets/icons/meeting/voice-2-off.svg'
              }
              width={32}
              height={32}
              alt="microphone-icon"
              loading="lazy"
              className={`${
                isMicOn ? 'opacity-100' : 'opacity-60'
              } transition-opacity`}
              title={isMicOn ? 'Microphone On' : 'Microphone Off'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoComponent;
