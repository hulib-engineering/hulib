'use client';

import { Eye, ShareFat, ThumbsUp } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoryBage } from '@/components/StoryBage';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import AnimatedCover from '@/features/stories/components/AnimatedCover';
import { useRouter } from '@/libs/i18nNavigation';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';

type MyStoryCardProps = {
  data: TStory;
};

export default function MyStoryCard({ data }: MyStoryCardProps) {
  const router = useRouter();
  const tExploreStory = useTranslations('ExploreStory');
  const tMyProfile = useTranslations('MyProfile');

  const isPublished = data.publishStatus === StoryPublishStatus.PUBLISHED;
  const visibleTopics = data.topics?.slice(0, 1) ?? [];
  const remainingTopicsCount = Math.max((data.topics?.length ?? 0) - visibleTopics.length, 0);

  const handleOpenStory = () => {
    router.push(`/explore-story/${data.id}${isPublished ? '' : '/preview'}`);
  };

  return (
    <article
      className={mergeClassnames(
        'relative flex min-h-[300px] w-full overflow-hidden rounded-[20px] border bg-white p-4 shadow-[0_8px_24px_rgba(76,62,124,0.08)]',
        isPublished
          ? 'border-lavender-80'
          : 'border-lavender-90 bg-gradient-to-br from-white via-[#FFF9FF] to-[#F7FBFF]',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col pr-4">
        {!isPublished && (
          <StoryBage
            status={data.publishStatus}
            rejectionReason={data.rejectionReason}
            className="mb-2"
          />
        )}

        <h3 className="line-clamp-2 min-h-[56px] text-xl font-semibold leading-7 text-primary-10">
          {data.title}
        </h3>

        {visibleTopics.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {visibleTopics.map(topic => (
              <Chip
                key={topic.id}
                as="span"
                className={mergeClassnames(
                  'h-auto rounded-md border px-2 py-1 text-xs font-medium leading-[14px]',
                  getTopicBadgeClasses(topic.color),
                )}
              >
                <span className="line-clamp-1">{topic.name}</span>
              </Chip>
            ))}
            {remainingTopicsCount > 0 && (
              <span className="inline-flex rounded-md border border-primary-80 bg-primary-60 px-2 py-1 text-xs font-semibold leading-[14px] text-white">
                +
                {remainingTopicsCount}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center gap-1.5">
          <Avatar
            imageUrl={data.humanBook?.photo?.path}
            name={data.humanBook?.fullName}
            className="size-4"
            size="xs"
          />
          <span className="line-clamp-1 text-xs font-medium text-neutral-50">
            {data.humanBook?.fullName}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-1">
            <ThumbsUp size={16} weight="fill" className="text-pink-40" />
            <span className="text-sm font-medium text-neutral-20">{data.likeCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} className="text-primary-50" />
            <span className="text-sm font-medium text-neutral-20">{data.viewCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShareFat size={16} className="text-primary-50" />
            <span className="text-sm font-medium text-neutral-20">{data.shareCount ?? 0}</span>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-4 rounded-full bg-primary-50 py-3 text-sm font-semibold"
          onClick={handleOpenStory}
        >
          {isPublished ? tExploreStory('read_all') : tMyProfile('continue_finish_story')}
        </Button>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenStory}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpenStory();
          }
        }}
        className="relative flex h-[260px] w-[184px] shrink-0 items-center justify-center overflow-visible rounded-2xl"
      >
        <AnimatedCover
          abstract={data.abstract ?? ''}
          title={data.title ?? ''}
          authorName={data.humanBook?.fullName ?? ''}
          coverUrl={data.cover?.path || ''}
          highlightTitle={data.highlightTitle}
          highlightAbstract={data.highlightAbstract}
          isPublished={isPublished}
          onClick={handleOpenStory}
        />
      </div>
    </article>
  );
}
