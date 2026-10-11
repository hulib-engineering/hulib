'use client';

import type { RefObject } from 'react';
import { Microphone, MicrophoneSlash, VideoCamera, VideoCameraSlash } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import type { MeetingParticipant } from '../types';
import Avatar from '@/components/core/avatar/Avatar';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { ReactionAnimation } from '@/components/meeting/ReactionAnimation';

/** Shared stacking token — see the note in `docs/results/result-792.md` about z-index. */
export const TILE_OVERLAY_Z = 'z-10';

export type ParticipantTileProps = {
  /** Container the Agora video track is mounted into. */
  videoRef?: RefObject<HTMLDivElement>;
  participant: MeetingParticipant;
  /** True while nobody else is in the channel. */
  isWaiting?: boolean;
  isReactionShown?: boolean;
  className?: string;
  /** Rail tiles are much smaller, so badges and avatars scale down. */
  isCompact?: boolean;
};

/**
 * One participant's video surface.
 *
 * The name badge is colour-coded by side: the local user reads "You" in primary
 * blue, the remote participant reads their name in orange, so it is obvious at a
 * glance which side of the call is on screen.
 */
export function ParticipantTile({
  videoRef,
  participant,
  isWaiting = false,
  isReactionShown = false,
  className,
  isCompact = false,
}: ParticipantTileProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  const { isLocal, isMicOn, isCameraOn } = participant;

  const badgeSize = isCompact ? 16 : 24;

  return (
    <div
      className={mergeClassnames(
        'relative flex size-full items-center justify-center overflow-hidden',
        isLocal ? 'rounded-[32px] bg-neutral-20' : 'rounded-3xl bg-black',
        className,
      )}
    >
      {isReactionShown && (
        <ReactionAnimation
          size={isLocal ? 'md' : 'sm'}
          className={mergeClassnames(TILE_OVERLAY_Z, !isLocal && 'absolute bottom-1 right-1')}
        />
      )}

      <div
        ref={videoRef}
        className={mergeClassnames(
          'absolute inset-0 size-full overflow-hidden',
          isLocal ? 'rounded-[32px]' : 'rounded-3xl',
          isCameraOn ? 'block' : 'hidden',
        )}
      />

      {/* Name badge — primary blue for self, orange for the remote participant. */}
      <div className={mergeClassnames('absolute left-2 top-2 flex gap-2 font-medium', TILE_OVERLAY_Z)}>
        <div
          className={mergeClassnames(
            'rounded-[100px] bg-white backdrop-blur-[15px]',
            isLocal
              ? 'px-2 py-1 text-xs leading-5 text-primary-60 xl:px-4 xl:py-2 xl:text-base'
              : 'px-2 py-1 text-xs leading-5 text-[#F3C00C] xl:px-4 xl:py-2 xl:text-base',
          )}
        >
          {isLocal ? t('you') : participant.name}
        </div>
      </div>

      {/* Mic and camera state, bottom-left. */}
      <div
        className={mergeClassnames(
          'absolute bottom-2 left-2 flex items-center gap-2',
          TILE_OVERLAY_Z,
        )}
      >
        <IconButton
          variant="outline"
          size="lg"
          aria-label={isMicOn ? t('toggle_mic') : t('turn_on_mic')}
          className={mergeClassnames(
            'bg-white text-primary-60 backdrop-blur-[15px]',
            isCompact ? 'h-7 p-1.5' : 'h-11 p-2.5',
          )}
        >
          {isMicOn
            ? <Microphone size={badgeSize} />
            : <MicrophoneSlash size={badgeSize} />}
        </IconButton>

        <IconButton
          variant="outline"
          size="lg"
          aria-label={isCameraOn ? t('toggle_camera') : t('turn_on_camera')}
          className={mergeClassnames(
            'bg-white text-primary-60 backdrop-blur-[15px]',
            isCompact ? 'h-7 p-1.5' : 'h-11 p-2.5',
          )}
        >
          {isCameraOn
            ? <VideoCamera size={badgeSize} />
            : <VideoCameraSlash size={badgeSize} />}
        </IconButton>
      </div>

      {!isCameraOn && (
        <div className="absolute bottom-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 translate-y-1/2">
          <Avatar
            imageUrl={participant.avatarUrl}
            name={participant.name}
            className={mergeClassnames(isLocal && !isCompact ? 'size-40' : 'size-16')}
          />
          {isWaiting && (
            <h6 className="text-center text-xl font-medium text-white">
              {t('waiting')}
            </h6>
          )}
        </div>
      )}
    </div>
  );
}
