'use client';

import React, { useEffect, useState } from 'react';

import { MinigameCard } from '@/components/Minigame/MinigameCard';
import { useAppDispatch } from '@/libs/hooks';
import {
  handleGuess,
  handleMovement,
  initMinigame,
} from '@/libs/store/minigame';

export const GameCards = [
  {
    name: 'Shenron',
    imgUrl: 'shenron.jpeg',
  },
  {
    name: 'Porunga',
    imgUrl: 'porunga.jpeg',
  },
  {
    name: 'Ultimate shenron',
    imgUrl: 'ultimate-shenron.jpeg',
  },
  {
    name: 'Super shenron',
    imgUrl: 'super-shenron.jpeg',
  },
  {
    name: 'Toronbo',
    imgUrl: 'toronbo.jpeg',
  },
  // {
  //   name: 'Black smoke shenron',
  //   imgUrl: 'black-smoke-shenron.jpeg',
  // },
  {
    name: 'Syn shenron',
    imgUrl: 'syn-shenron.jpeg',
  },
  {
    name: 'Haze shenron',
    imgUrl: 'haze-shenron.jpeg',
  },
  {
    name: 'Eis shenron',
    imgUrl: 'eis-shenron.jpeg',
  },
  {
    name: 'Nuova shenron',
    imgUrl: 'nuova-shenron.jpeg',
  },
  {
    name: 'Rage shenron',
    imgUrl: 'rage-shenron.jpeg',
  },
  {
    name: 'Oceanus shenron',
    imgUrl: 'oceanus-shenron.jpeg',
  },
  {
    name: 'Naturon shenron',
    imgUrl: 'naturon-shenron.jpeg',
  },
  // {
  //   name: 'Chappiru',
  //   imgUrl: 'chappiru.jpeg',
  // },
  // {
  //   name: 'Dark shenron',
  //   imgUrl: 'dark-shenron.jpeg',
  // },
];

type IGameCardProps = {
  id: number;
  name: string;
  imgUrl: string;
};

const MinigameSection = () => {
  const dispatch = useAppDispatch();

  // const [cardList, setCardList] = useState(
  //   [...GameCards, ...GameCards].map((card, index) => ({ ...card, id: index })),
  // );
  const [cardList, setCardList] = useState<IGameCardProps[]>([]);
  const [firstCard, setFirstCard] = useState<IGameCardProps | null>(null);
  const [secondCard, setSecondCard] = useState<IGameCardProps | null>(null);
  const [flippable, setFlippable] = useState(true);

  useEffect(() => {
    const drawCards = () => {
      setTimeout(() => {
        const randomList = [...GameCards, ...GameCards]
          .map((card, index) => ({ ...card, id: index }))
          .sort(() => 0.5 - Math.random());
        setCardList(randomList);
        dispatch(initMinigame());
        setFirstCard(null);
        setSecondCard(null);
        // setWon(0);
      }, 1200);
    };

    drawCards();
  }, []);
  useEffect(() => {
    const removeSelection = () => {
      setFirstCard(null);
      setSecondCard(null);
      setFlippable(true);
      dispatch(handleMovement());
    };

    if (firstCard && secondCard) {
      setFlippable(false);
      if (firstCard.imgUrl === secondCard.imgUrl) {
        dispatch(handleGuess(firstCard.imgUrl));
        removeSelection();
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const handlePick = (item: IGameCardProps) => {
    if (firstCard && firstCard.id !== item.id) {
      setSecondCard(item);
    } else {
      setFirstCard(item);
    }
  };

  return (
    <section className="grid grid-cols-4 gap-4 sm:grid-cols-6">
      {cardList.map((each) => (
        <MinigameCard
          key={each.id}
          id={each.id}
          name={each.name}
          imgUrl={each.imgUrl}
          onPick={handlePick}
          isPicked={each.id === firstCard?.id || each.id === secondCard?.id}
          flippable={flippable}
        />
      ))}
    </section>
  );
};

export { MinigameSection };
