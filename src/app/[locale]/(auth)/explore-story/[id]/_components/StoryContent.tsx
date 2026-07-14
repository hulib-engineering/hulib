'use client';

import { mergeClassnames } from '@/components/core/private/utils';
import { DetailedStory } from '@/features/stories/components/DetailedStory';
import StoryReviews from '@/app/[locale]/(auth)/explore-story/[id]/_components/StoryReviews';
import CommentInput from '@/app/[locale]/(auth)/explore-story/[id]/_components/CommentInput';

type StoryContentProps = {
  abstract: string;
  bookWidth?: number;
  storyId: number;
};

export default function StoryContent({ abstract, bookWidth, storyId }: StoryContentProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-y-8 xxl:w-[888px] xxl:max-w-[888px]">
      <DetailedStory
        abstract={abstract}
        bookWidth={bookWidth}
      />
      <div
        className={mergeClassnames(
          'flex w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm',
        )}
        style={{ height: 'auto' }}
      >
        <h6 className="text-xl font-medium leading-7 text-neutral-20">
          Cảm nghĩ từ người đọc
        </h6>
        <CommentInput storyId={storyId} />
        <StoryReviews />
      </div>
    </div>
  );
}
