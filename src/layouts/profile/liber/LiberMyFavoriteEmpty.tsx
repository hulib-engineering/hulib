'use client';

import React from 'react';
import Image from 'next/image';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { StoryCard } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/StoryCard';
import { useGetSimilarStoriesQuery } from '@/libs/services/modules/stories';

type LiberMyFavoriteEmptyProps = {
  className?: string;
  title: string;
  description: string;
};

export const LiberMyFavoriteEmpty = ({ className, title, description }: LiberMyFavoriteEmptyProps) => {
  const { data: stories, isLoading } = useGetSimilarStoriesQuery({
    page: 1,
    limit: 4,
  });

  return (
    <div className={className}>
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <Image
          src="/assets/images/landing/favorite_book.png"
          className="object-contain"
          width={120}
          height={120}
          quality={100}
          alt="no-results"
        />
        <div className="flex flex-col gap-2 text-center">
          <h5 className="text-2xl font-medium text-primary-50">
            {title}
          </h5>
          <p className="mt-4 font-normal text-neutral-10">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {isLoading && <StoriesSkeleton />}
        {!isLoading && stories?.data?.length > 0 && (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {stories?.data?.map((story: TStory) => (
              <StoryCard key={story.id} data={story} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
