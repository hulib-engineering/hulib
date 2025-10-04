'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { StoriesSkeleton } from '../stories/StoriesSkeleton';
import { StoryCard } from '@/components/stories/StoryCard';
import NoResultFound from '@/components/research/NoResultFound';
import type { Story } from '@/libs/services/modules/stories/storiesType';

type NewestBooksProps = {
  stories: Story[];
  loadingStories: boolean;
};

const NewestBooks: React.FC<NewestBooksProps> = ({
  stories,
  loadingStories,
}) => {
  const t = useTranslations('Research');

  const searchParams = useSearchParams();

  React.useEffect(() => {
    const element = document.getElementById('books-title');
    const easeInOutQuad = (v: number) =>
      v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2;

    if (element) {
      const targetPosition
        = element.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime;
        }
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }, [searchParams.get('keyword')]);

  return (
    <div className="mt-8 items-center justify-center rounded-lg bg-white">
      <h3
        className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10"
        id="books-title"
      >
        {t('stories.title')}
      </h3>
      {loadingStories
        ? (
            <StoriesSkeleton />
          )
        : stories?.length > 0
          ? (
              <div className="relative mt-4 flex flex-wrap items-center justify-center gap-8 xl:justify-start 2xl:gap-12">
                {stories.map(item => (
                  <StoryCard
                    key={item.id}
                    data={item}
                  />
                ))}
              </div>
            )
          : (
              <NoResultFound className="mt-4" />
            )}
    </div>
  );
};

export default NewestBooks;
