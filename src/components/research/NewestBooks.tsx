'use client';

import { Bookmarks, CaretCircleRight } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { FlipBook } from '@/components/flipBook/FlipBook';
import { useGetSearchByKeywordQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import { mergeClassnames } from '../private/utils';
import StoriesSkeleton from '../stories/StoriesSkeleton';

const NewestBooks = () => {
  const t = useTranslations('Home');
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading: loadingStories } = useGetSearchByKeywordQuery({
    keyword: searchParams.get('keyword') || '',
  });

  const handleAddToFavorites = () => {
    // TODO: Implement add to favorites
  };

  const renderActions = (storyId: number) => {
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
          Read all
        </Button>
        <Button
          variant="outline"
          className={mergeClassnames(
            'w-full h-8',
            'md:size-10 md:min-h-10 md:min-w-10',
          )}
          iconOnly
          onClick={() => handleAddToFavorites()}
        >
          <Bookmarks size={20} />
        </Button>
      </div>
    );
  };

  React.useEffect(() => {
    const element = document.getElementById('books-title');

    const easeInOutQuad = (v: number) =>
      v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2;
    if (element) {
      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('keyword')]);

  return (
    <div className="mt-8 items-center justify-center rounded-lg bg-white sm:p-5 ">
      <h3
        className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10"
        id="books-title"
      >
        {t('newest_books.title')}
      </h3>
      {loadingStories ? (
        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
          <StoriesSkeleton />
        </div>
      ) : data?.length > 0 ? (
        <div className="relative mt-4 flex flex-wrap items-center justify-center gap-8 xl:justify-start 2xl:gap-12">
          {data?.map((item: StoryType) => (
            <FlipBook
              key={item.id}
              data={item}
              renderActions={() => renderActions(item?.id)}
            />
          ))}
        </div>
      ) : (
        <p className="w-full text-center">{t('no_data')}</p>
      )}
      {data?.length > 0 && (
        <div className="mt-8 flex w-full items-center justify-center">
          <Button variant="outline" onClick={() => router.push('explore-book')}>
            <CaretCircleRight />
            <p className="text-base font-medium leading-5 text-primary-50">
              {t('newest_books.btn1')}
            </p>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewestBooks;
