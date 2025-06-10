'use client';

import { Book, BookmarkSimple } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { useAppSelector } from '@/libs/hooks';
import type { Topic as TopicType } from '@/libs/services/modules/topics/topicType';

import CustomCoverBook from '../common/CustomCoverBook';
import IconButton from '../iconButton/IconButton';
import { mergeClassnames } from '../private/utils';

interface Props {
  humanBook: {
    id: number;
    fullName: string;
    rating: number;
    bio: string;
  };
  title: string;
  coverPath: string;
  // abstract: string;
  storyReview: {
    rating: number;
    numberOfReviews: number;
  };
  storyId: number;
  topics: TopicType[];
}

const HumanBookInfo = ({
  humanBook,
  title,
  coverPath,
  storyId,
  storyReview,
  topics,
}: Props) => {
  const [imgError, setImgError] = useState(false);
  const t = useTranslations('ExploreStory');
  const router = useRouter();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const handleImageError = () => {
    setImgError(true);
  };
  console.log('topics', topics);

  const handleNameClick = () => {
    router.push(`/profile?huberId=${humanBook.id}`);
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="px-6 py-4">
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
              <button
                type="button"
                className="cursor-pointer transition-colors hover:text-primary-50"
                onClick={handleNameClick}
              >
                {humanBook?.fullName || ''}
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-row items-center gap-1">
            <Image
              src="/assets/images/icons/heart-yellow.svg"
              width={16}
              height={16}
              className="size-4"
              alt="heart-icon"
            />
            <p
              className={mergeClassnames(
                'text-xs font-medium leading-4 text-neutral-20',
                'md:text-sm',
              )}
            >
              {storyReview?.rating || 0}
            </p>
            <p
              className={mergeClassnames(
                'text-[0.625rem] font-normal text-neutral-40',
                'md:text-xs',
              )}
            >
              {`(${storyReview?.numberOfReviews || 0} ${t('ratings')})`}
            </p>
          </div>
          <div className="mt-2 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-2 py-1">
            {(topics || []).map((topic) => (
              <div
                className="max-h-[32px] w-[107px] shrink-0 snap-start truncate rounded-2xl bg-primary-90 px-3 py-1 text-center text-xs font-normal text-primary-50"
                key={topic?.name}
                title={topic.name}
              >
                {topic.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center py-8">
          <CustomCoverBook
            titleStory={title}
            authorName={humanBook?.fullName || ''}
            // srcImage={data?.cover?.path}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <Link
            href={`/schedule-meeting/${humanBook?.id}?storyId=${storyId}`}
            className="w-full"
          >
            <IconButton
              icon={<Book size={16} />}
              className="w-full px-4 text-base text-white "
              disabled={Number(humanBook?.id) === Number(userInfo?.id)}
            >
              Schedule a Meeting
            </IconButton>
          </Link>
          <IconButton
            icon={<BookmarkSimple size={16} />}
            className="w-full border border-solid  border-neutral-variant-80 bg-transparent text-base text-primary-50"
          >
            Save to Later
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default HumanBookInfo;
