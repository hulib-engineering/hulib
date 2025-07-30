'use client';

import React from 'react';

import { useAppSelector } from '@/libs/hooks';

const NumberOfMovements = () => {
  const numberOfAvailableMovements = useAppSelector(
    state => state.minigame.numOfAvailableMovements,
  );

  return (
    <div className="flex flex-col items-center text-white">
      <h6 className="mb-1 text-base font-light capitalize">movements</h6>
      <div className="rounded px-2 py-4 text-[2rem] font-semibold shadow-inner">
        {numberOfAvailableMovements}
      </div>
    </div>
  );
};

export { NumberOfMovements };
