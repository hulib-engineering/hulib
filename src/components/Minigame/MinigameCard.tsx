'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

// import { useState } from 'react';
import { mergeClassnames } from '@/components/core/private/utils';
import { useAppSelector } from '@/libs/hooks';
// import {
//   handleGuess,
//   handleMovement,
//   handlePick,
//   handleUnpick,
// } from '@/libs/store/minigame';

type IGameCardProps = {
  id: number;
  name: string;
  imgUrl: string;
};

type IMinigameCardProps = IGameCardProps & {
  isPicked: boolean;
  flippable: boolean;
  onPick: (item: IGameCardProps) => void;
};

const MinigameCard = (props: IMinigameCardProps) => {
  const t = useTranslations('Accessibility');
  const guessedIds = useAppSelector(state => state.minigame.guessedIds);

  return (
    <button
      className={mergeClassnames(
        'h-48 w-full cursor-pointer rounded border-[0.2rem] border-solid border-gray-700 bg-[#fffbf6]',
        'transition-transform duration-500 transform-style-3d',
        props.isPicked && 'rotate-y-180',
        guessedIds.includes(props.imgUrl)
        && 'bg-[#f5f5f5] rotate-y-180 scale-90',
      )}
      data-id={props.id}
      onClick={() =>
        props.flippable
        && props.onPick({ id: props.id, name: props.name, imgUrl: props.imgUrl })}
      type="button"
    >
      <div
        className={mergeClassnames(
          'pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center p-4 transition-transform duration-300 backface-hidden',
          'flex-col gap-2 -rotate-y-180',
        )}
      >
        <Image
          className="w-28"
          src={`/assets/images/minigame/${props.imgUrl}`}
          alt={props.name}
          loading="lazy"
          fill
        />
      </div>
      <div
        className={mergeClassnames(
          'pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center p-4 transition-transform duration-300 backface-hidden',
          'bg-[#f4eac0] rotate-0',
        )}
      >
        <Image
          className="w-24 object-center"
          src="/assets/images/minigame/back-side.jpeg"
          alt={t('thought')}
          fill
          priority
        />
      </div>
    </button>
  );
};

export { MinigameCard };
