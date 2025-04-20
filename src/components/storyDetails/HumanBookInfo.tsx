'use client';

import { Book, BookmarkSimple, Brain } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import type { Topic } from '@/libs/services/modules/topics/topicType';

import IconButton from '../iconButton/IconButton';
import { mergeClassnames } from '../private/utils';

interface Props {
  humanBook: {
    id: number;
    fullName: string;
    topics: Topic[];
    rating: number;
    bio: string;
  };
  title: string;
  coverPath: string;
  abstract: string;
  storyReview: {
    rating: number;
    numberOfReviews: number;
  };
  storyId: number;
}

const HumanBookInfo = ({
  humanBook,
  title,
  coverPath,
  abstract,
  storyReview,
  storyId,
}: Props) => {
  const [imgError, setImgError] = useState(false);
  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className="h-full w-full overflow-hidden rounded bg-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex w-full flex-col items-center gap-2">
          <Link href={`/schedule-meeting/${humanBook?.id}?storyId=${storyId}`}>
            <IconButton
              icon={<Book size={16} />}
              className="w-full px-4 text-base text-white"
            >
              Schedule a Meeting
            </IconButton>
          </Link>
          <IconButton
            icon={<BookmarkSimple size={16} />}
            className="bg-transparent text-base text-primary-50"
          >
            Save to Later
          </IconButton>
        </div>
        <div className="flex flex-col items-start justify-between px-3 py-1">
          <h2 className="mb-2 text-xl font-bold">{title}</h2>
          <div className="flex items-center justify-between gap-2 text-sm">
            <Image
              alt="Avatar Human Book"
              src={
                imgError
                  ? '/assets/images/Avatar.png'
                  : coverPath || '/assets/images/Avatar.png'
              }
              width={24}
              height={24}
              className="size-6 rounded-full"
              onError={handleImageError}
            />
            <div>
              <p>{humanBook?.fullName || ''}</p>
            </div>
            {humanBook?.topics && (
              <p>{`${humanBook?.topics?.length || 0} topics`}</p>
            )}
          </div>
          <div className="flex items-center gap-1 py-2 text-sm">
            <span>⭐️ {storyReview?.rating || 0}</span>
            <span className="ml-1 text-base text-gray-500">{`(${
              storyReview?.numberOfReviews || 0
            } reviews)`}</span>
          </div>
          <div>
            {humanBook?.topics?.map((topic) => (
              <IconButton
                key={topic?.id}
                icon={<Brain size={12} />}
                className="w-full bg-neutral-98 px-4 text-xs text-gray-400"
              >
                {topic?.name}
              </IconButton>
            ))}
          </div>

          <p
            className={mergeClassnames(
              'mt-2 line-clamp-3 text-sm font-normal leading-6 text-gray-700',
              'md:text-base md:line-clamp-5',
            )}
          >
            {abstract || ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HumanBookInfo;
