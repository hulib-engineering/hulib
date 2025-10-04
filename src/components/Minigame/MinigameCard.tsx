'use client';

import Image from 'next/image';

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
  const guessedIds = useAppSelector(state => state.minigame.guessedIds);

  // const dispatch = useAppDispatch();

  // const [isPicked, setIsPicked] = useState(pickedId === props.id);
  // const [isGuessed, setIsGuessed] = useState(guessedIds.includes(props.id));

  // const [isGuessed, setIsGuessed] = useState(false);

  // const handleClick = () => {
  //   if (pickedId !== '') {
  //     if (pickedId === props.id) {
  //       // setIsPicked(false);
  //       dispatch(handleUnpick);
  //       // target.classList.remove('card--picked');
  //       // picked.classList.remove('card--picked');
  //       // setIsGuessed(true);
  //       dispatch(handleGuess(props.id));
  //       // target.classList.add('card--guessed');
  //       // picked.classList.add('card--guessed');
  //       // isPaused = false;
  //     } else {
  //       dispatch(handlePick(props.id));
  //       // setIsPicked(true);
  //       // target.classList.add('card--picked');
  //       setTimeout(() => {
  //         dispatch(handleUnpick);
  //         // setIsPicked(false);
  //         // picked.classList.remove('card--picked');
  //         // isPaused = false;
  //       }, 1500);
  //     }
  //     dispatch(handleMovement);
  //     // counter -= 1;
  //     // available.innerHTML = counter;
  //     // if (counter === 0) {
  //     //   lose();
  //     // }
  //   } else {
  //     dispatch(handlePick(props.id));
  //     // setIsPicked(true);
  //     // isPaused = false;
  //   }
  //   // Validate is already win
  //   // const isWin =
  //   //   cardContainer.querySelectorAll('card--guessed').length ===
  //   //   currentCards.length;
  //   // if (isWin) {
  //   //   win();
  //   // }
  // };

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
          alt="Thought"
          fill
          priority
        />
      </div>
    </button>
  );
};

export { MinigameCard };
