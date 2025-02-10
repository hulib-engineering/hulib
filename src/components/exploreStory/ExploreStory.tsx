'use client';

import { CaretCircleDown } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import ListTopics from '@/components/stories/ListTopics';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import Story from '@/components/stories/Story';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

type ExporeStoryProps = {
  storiesPages?: StoryType[];
  isLoading: boolean;
};

const ExporeStory = ({ storiesPages, isLoading }: ExporeStoryProps) => {
  const t = useTranslations('ExporeStory');

  if (isLoading) return <StoriesSkeleton />;

  return (
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
        <p className="text-lg font-normal text-[#2E3032]">{t('description')}</p>
      </div>
      <ListTopics />
      <div
        className={mergeClassnames(
          'mt-6 grid grid-cols-1 gap-8',
          'md:grid-cols-2',
        )}
      >
        {storiesPages?.map((story: StoryType) => (
          <Story key={story?.id} data={story} />
        ))}
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
  );
};

export default ExporeStory;
