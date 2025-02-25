'use client';

import { CaretCircleRight } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useGetSearchByKeywordQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import StoriesSkeleton from '../stories/StoriesSkeleton';
import Story from '../stories/Story';

const NewestBooks = () => {
  const t = useTranslations('Home');
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading: loadingStories } = useGetSearchByKeywordQuery({
    keyword: searchParams.get('keyword') || '',
  });

  return (
    <div className="mt-8 items-center justify-center rounded-lg bg-white p-5">
      <h3 className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10">
        {t('newest_books.title')}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {loadingStories ? (
          <StoriesSkeleton />
        ) : (
          data?.map((item: StoryType) => <Story key={item.id} data={item} />)
        )}
      </div>
      <div className="mt-8 flex w-full items-center justify-center">
        <Button variant="outline" onClick={() => router.push('explore-book')}>
          <CaretCircleRight />
          <p className="text-base font-medium leading-5 text-primary-50">
            {t('newest_books.btn1')}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default NewestBooks;
