import Image from 'next/image';
import type { RefObject } from 'react';
import { Microphone, MicrophoneSlash } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { mergeClassnames } from '@/components/private/utils';
import IconButton from '@/components/iconButton/IconButton';
import { ReactionAnimation } from '@/components/meeting/ReactionAnimation';

type IVideoProps = {
  agoraVideoPlayerRef: RefObject<HTMLDivElement>;
  waitingText?: string;
  isShowWaitingText?: boolean;
  className?: string;
  isMicOn?: boolean;
  isCamOn?: boolean;
  isReactionShown?: boolean;
  roleLabel?: 'Liber' | 'Huber';
  isLocal?: boolean;
  participantName?: string;
  participantAvatarUrl?: string;
};

const VideoComponent = (props: IVideoProps) => {
  const t = useTranslations('Reading.AgoraMeeting');

  const {
    agoraVideoPlayerRef,
    waitingText = t('waiting'),
    isShowWaitingText = true,
    className = '',
    isMicOn = false,
    isCamOn = false,
    isReactionShown = false,
    roleLabel,
    isLocal = true,
    participantName,
    participantAvatarUrl,
  } = props;

  return (
    <div
      className={mergeClassnames(
        'relative flex size-full items-center justify-center text-[#0858FA]',
        isLocal ? 'rounded-[32px] bg-neutral-20' : 'rounded-3xl bg-black',
        className,
      )}
    >
      {isReactionShown
      && (
        <ReactionAnimation
          size={!isLocal ? 'sm' : 'md'}
          className={mergeClassnames('z-[999999]', !isLocal && 'absolute bottom-1 right-1')}
        />
      )}
      <div
        ref={agoraVideoPlayerRef}
        className={mergeClassnames(
          'absolute inset-0 size-full overflow-hidden',
          isLocal ? 'rounded-[32px]' : 'rounded-3xl',
          isCamOn ? 'block' : 'hidden',
        )}
      >
      </div>
      <div className="absolute left-2 top-2 z-[12312] flex gap-2 font-medium">
        {roleLabel && (
          <div
            className={mergeClassnames(
              'rounded-[100px] bg-neutral-98 backdrop-blur-[15px]',
              isLocal ? 'px-4 py-2 text-[#F3C00C]' : 'px-2 py-1 text-sm text-primary-60',
            )}
          >
            {roleLabel}
          </div>
        )}
        {isLocal ? (
          <div
            className={mergeClassnames(
              'rounded-[100px] bg-neutral-98 text-[#F3C00C] backdrop-blur-[15px]',
              isLocal ? 'px-4 py-2' : 'px-2 py-1 text-sm',

            )}
          >
            {t('you')}
          </div>
        ) : (
          <div
            className={mergeClassnames(
              'rounded-[100px] bg-neutral-98 text-primary-60 backdrop-blur-[15px]',
              isLocal ? 'px-4 py-2' : 'px-2 py-1 text-sm',
            )}
          >
            {participantName}
          </div>
        )}
      </div>

      {!isCamOn && (
        <div className="absolute bottom-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 translate-y-1/2">
          <Image
            alt="User avatar"
            src={participantAvatarUrl ?? '/assets/images/ava-placeholder.png'}
            width={isLocal ? 168 : 56}
            height={isLocal ? 168 : 56}
            className={mergeClassnames(
              'rounded-full object-cover object-center',
              isLocal ? 'size-40' : 'size-16',
            )}
          />

          {isShowWaitingText && (
            <h6 className="text-center text-xl font-medium text-white">{waitingText}</h6>
          )}
        </div>
      )}

      <div className="absolute bottom-2 left-2 z-[12312] flex flex-col items-center">
        <IconButton
          variant="outline"
          size="lg"
          className={mergeClassnames(
            ' bg-white text-primary-60 backdrop-blur-[15px]',
            isLocal ? 'h-11 p-2.5' : 'h-7 p-1.5',
          )}
        >
          {isMicOn ? <Microphone size={isLocal ? 24 : 16} /> : <MicrophoneSlash size={isLocal ? 24 : 16} /> }
        </IconButton>
      </div>
    </div>
  );
};

export default VideoComponent;
