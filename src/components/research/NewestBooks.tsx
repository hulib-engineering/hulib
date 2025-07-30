'use client';

import { Bookmarks } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';

import Button from '../button/Button';
import { mergeClassnames } from '../private/utils';
import StoriesSkeleton from '../stories/StoriesSkeleton';
import { FlipBook } from '@/components/flipBook/FlipBook';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAddToFavorites = useCallback(() => {
    // TODO: Implement add to favorites
  }, []);

  const renderActions = useCallback(
    (storyId: number) => {
      return (
        <div
          className={mergeClassnames(
            'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px]',
            'md:flex-row md:mt-2 md:px-3 md:pl-0',
          )}
        >
          <Button
            variant="primary"
            className={mergeClassnames(
              'text-base h-8 max-h-8 w-[120px] flex-none rounded-full px-[12px] py-[12px]',
              'md:h-[44px] md:max-h-[44px] md:w-[105px]',
            )}
            onClick={() => router.push(`/explore-story/${storyId}`)}
          >
            {t('stories.read_all')}
          </Button>
          <Button
            variant="outline"
            className={mergeClassnames(
              'w-full h-8',
              'md:size-10 md:min-h-10 md:min-w-10',
            )}
            iconOnly
            onClick={handleAddToFavorites}
          >
            <Bookmarks size={20} />
          </Button>
        </div>
      );
    },
    [router, handleAddToFavorites, t],
  );

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
                  <FlipBook
                    key={item.id}
                    data={item}
                    renderActions={() => renderActions(item.id)}
                    refetch={() => {}}
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
