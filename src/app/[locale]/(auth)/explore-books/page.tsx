'use client';

import { CaretCircleDown } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import ListTopics from '@/components/stories/ListTopics';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import Story from '@/components/stories/Story';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/getStories';

const Page = () => {
  const t = useTranslations('ExporeBooks');

  const { data: storiesPages, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 5,
  });

  return (
    <div
      className={mergeClassnames(
        `flex min-h-screen flex-col items-center bg-neutral-98 pb-4 mt-[-5rem]`,
      )}
    >
      <div
        className={mergeClassnames(
          'flex flex-col gap-8 pt-[3rem] w-screen relative px-2',
          'md:px-28',
        )}
      >
        <div
          className={mergeClassnames(
            'h-full w-full rounded-lg bg-white px-2 py-5',
            'md:px-5 md:py-5',
          )}
        >
          <div>
            <h3 className="text-[2.5rem] font-bold leading-[3rem] text-neutral-20">
              {t('title')}
            </h3>
            <p className="text-lg font-normal text-[#2E3032]">
              {t('description')}
            </p>
          </div>
          <ListTopics />
          <div
            className={mergeClassnames(
              'mt-6 grid grid-cols-1 gap-8',
              'md:grid-cols-2',
            )}
          >
            {isLoading ? (
              <StoriesSkeleton />
            ) : (
              storiesPages?.data?.map((story: StoryType) => (
                <Story key={story?.id} data={story} />
              ))
            )}
          </div>

          <div className="mt-6 flex w-full items-center justify-center">
            <Button
              variant="outline"
              iconLeft={<CaretCircleDown size={16} color="#0442BF" />}
            >
              {t('view_more')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
