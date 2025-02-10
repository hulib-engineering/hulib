'use client';

import { CaretCircleDown } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import Story from '@/components/stories/Story';
import { useGetSimilarStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

type SimilarStoryProps = {
  humanBookId: string;
};

const SimilarStory = ({ humanBookId }: SimilarStoryProps) => {
  const t = useTranslations('ExporeStory');

  const { data: similarStoriesPages, isLoading: loadingSimilarStories } =
    useGetSimilarStoriesQuery({
      page: 1,
      limit: 5,
      humanBookId,
    });

  if (loadingSimilarStories) return <StoriesSkeleton />;

  return (
    <div
      className={mergeClassnames(
        'h-full w-full rounded-lg bg-white px-2 py-5',
        'md:px-5 md:py-5',
      )}
    >
      <h3 className="text-[2.5rem] font-bold leading-[3rem] text-neutral-20">
        {t('similar_stories')}
      </h3>
      <div
        className={mergeClassnames(
          'mt-6 grid grid-cols-1 gap-8',
          'md:grid-cols-2',
        )}
      >
        {similarStoriesPages?.data?.map((story: StoryType) => (
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

export default SimilarStory;
