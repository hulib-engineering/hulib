'use client';

import {
  Heart,
  Microphone,
  MicrophoneSlash,
  PhoneSlash,
  Screencast,
  VideoCamera,
  VideoCameraSlash,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';

export type ControlBarProps = {
  isMicOn: boolean;
  isCameraOn: boolean;
  isSharingScreen: boolean;
  /** False until local tracks exist; the buttons render dimmed until then. */
  isReady: boolean;
  /** Prevents a second reaction while the first is still playing. */
  isReactionPlaying?: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
  onShareScreen: () => void;
  onReact: () => void;
  /** Rendered inside the strip, used to host the screen share picker popover. */
  children?: React.ReactNode;
};

/**
 * The in-call control strip.
 *
 * The button group is centred with `mx-auto` rather than by padding it out with
 * invisible spacer buttons, which is what the previous implementation did — that
 * approach broke the moment a fifth item was added and left the reaction button
 * unbalanced against the group.
 */
export function ControlBar({
  isMicOn,
  isCameraOn,
  isSharingScreen,
  isReady,
  isReactionPlaying = false,
  onToggleMic,
  onToggleCamera,
  onEndCall,
  onShareScreen,
  onReact,
  children,
}: ControlBarProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  return (
    <div className="relative flex items-center justify-between rounded-[40px] bg-neutral-98 px-6 py-4 shadow-sm">
      <div className="flex flex-1 justify-center">
        <div className="flex items-center gap-4">
          <IconButton
            size="lg"
            aria-label={t('toggle_camera')}
            className={mergeClassnames('!size-11', isReady ? 'opacity-100' : 'opacity-50')}
            onClick={onToggleCamera}
          >
            {isCameraOn ? <VideoCameraSlash /> : <VideoCamera />}
          </IconButton>

          <IconButton
            size="lg"
            aria-label={t('toggle_mic')}
            className={mergeClassnames('!size-11', isReady ? 'opacity-100' : 'opacity-50')}
            onClick={onToggleMic}
          >
            {isMicOn ? <MicrophoneSlash /> : <Microphone />}
          </IconButton>

          <IconButton
            size="lg"
            aria-label={t('end_call')}
            className={mergeClassnames(
              '!size-11 border border-red-50 bg-red-50',
              isReady ? 'opacity-100' : 'opacity-50',
            )}
            onClick={onEndCall}
          >
            <PhoneSlash />
          </IconButton>

          <IconButton
            variant="outline"
            size="lg"
            aria-label={isSharingScreen ? t('stop_sharing') : t('share_screen')}
            className={mergeClassnames(
              '!size-11 border-primary-60 p-2.5 text-primary-60',
              isSharingScreen && 'ring-2 ring-primary-60',
              isReady ? 'opacity-100' : 'opacity-50',
            )}
            onClick={onShareScreen}
          >
            <Screencast size={24} />
          </IconButton>
        </div>
      </div>

      {children}

      <IconButton
        variant="outline"
        size="lg"
        disabled={isReactionPlaying}
        aria-label={t('send_reaction')}
        className="!size-11 border-none bg-white p-2.5 shadow-sm"
        onClick={onReact}
      >
        <Heart size={24} color="#FF2C94" />
      </IconButton>
    </div>
  );
}
