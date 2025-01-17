'use client';

import { Book, BookmarkSimple, Brain } from '@phosphor-icons/react';
import React from 'react';

import IconButton from '../iconButton/IconButton';

const HumanBookInfo = () => {
  return (
    <div className="w-full overflow-hidden rounded bg-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex w-full flex-col items-center gap-2">
          <IconButton
            icon={<Book size={16} />}
            className="w-full px-4 text-base text-white"
          >
            Schedule a Meeting
          </IconButton>
          <IconButton
            icon={<BookmarkSimple size={16} />}
            className="bg-transparent text-base text-primary-50"
          >
            Save for later
          </IconButton>
        </div>
        <div className="flex flex-col items-start justify-between px-3 py-1">
          <h2 className="mb-2 text-xl font-bold">Story of my life</h2>
          <div className="flex items-center justify-between gap-2 text-sm">
            <div>
              <p>Author name</p>
            </div>
            <p>20 Sessions</p>
          </div>
          <div className="flex items-center gap-1 py-2 text-sm">
            <span className="text-yellow-100">⭐️ 4.2</span>
            <span className="ml-1 text-gray-500">(404 ratings)</span>
          </div>
          <div>
            <IconButton
              icon={<Brain size={12} />}
              className="w-full bg-[#F9F9F9] px-4 text-xs text-gray-400"
            >
              Productivity
            </IconButton>
          </div>
          <p className="text-sm text-gray-700">
            Short description about the book. Lorem ipsum dolor sit amet
            consectetur. Eget magna vel platea pulvinar tempor dui massa ut.
            Egestas nunc mi tristique ornare commodo vitae dignissim commodo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HumanBookInfo;
