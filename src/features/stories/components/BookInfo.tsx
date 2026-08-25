import {
  BookmarkIcon,
  EyeIcon,
  HeartIcon,
  ShareFatIcon,
  ThumbsUpIcon,
} from '@phosphor-icons/react';

import { useTranslations } from 'next-intl';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { Cover } from '@/features/stories/components/Cover';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { Chip } from '@/components/core/chip/Chip';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';

type BottomButtonsProps = {
  isLiked?: boolean;
  handleClickShare?: () => void;
  clickLikeStory?: () => void;
};

type StatisticsProps = {
  viewCount: number | undefined;
  likeCount: number | undefined;
  shareCount: number | undefined;
  rating: number | undefined;
};

type CoverDetailProps = {
  coverPath: string | undefined;
  topics?: Topic[];
  children?: React.ReactNode;
  // userId: any;
};

type BookInfoProps = BottomButtonsProps & StatisticsProps & CoverDetailProps;

function CornerButtons() {
  // TODO: add buttons and their conditions
  // e.g. mode = 'default' means there will be 2 edit and delete buttons
  // mode = 'storypagemobile' or something like that will have the bookmark button
  return (
    <Button variant="outline" className="hidden w-fit rounded-full">
      {' '}
      {/* Add 'lg' back to 'lg:hidden' when there's a clear flow of the bookmark feature */}
      <BookmarkIcon />
    </Button>
  );
}

function CoverDetail({ coverPath, topics }: CoverDetailProps) {
  const SORTED = true;
  // DEV NOTE: Change the flag to false if sorting the topic chips isn't worth the trade off.

  return (
    <div className="relative flex w-full flex-col gap-y-4">
      <div className="flex max-h-[340px] w-full items-center justify-center">
        <Cover src={coverPath ?? null} size="w-[226px] h-[340px]" />
      </div>
      <div className="absolute right-0 top-0 -translate-y-5 translate-x-5">
        <CornerButtons />
      </div>
      {topics?.length ? (
        <div className="flex flex-wrap gap-2 py-1 max-lg:hidden">
          {(SORTED ? [...topics].sort((a: Topic, b: Topic) => a.name.length - b.name.length) : topics)
            .map((topic: Topic) => (
              <Chip
                key={topic.id}
                as="span"
                className={mergeClassnames(
                  'min-w-0 shrink-0 rounded border h-[22px] py-1 px-2',
                  'text-xs font-medium leading-[14px] ',
                  getTopicBadgeClasses(topic.color),
                )}
              >
                {topic.name}
              </Chip>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function Statistics({ viewCount, rating, likeCount, shareCount }: StatisticsProps) {
  const t = useTranslations('BookInfo');
  return (
    <div className="flex flex-wrap items-center gap-2 max-lg:justify-between lg:gap-x-8">

      <div className="flex items-center gap-x-1">
        <EyeIcon className="text-primary-50" size={16} weight="bold" />
        <p className="text-[14px] leading-4 text-neutral-10">
          {viewCount ?? 0}
          {' '}
          <span className="lg:hidden">
            {t('viewCount', { plural: viewCount ? 's' : '' })}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-x-1 lg:hidden">
        <HeartIcon className="text-yellow-40" size={16} weight="fill" />
        <p className="text-[14px] leading-4 text-neutral-10">
          {rating ?? 0}
          {' '}
          <span className="lg:hidden">
            {t('rating', { plural: rating ? 's' : '' })}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-x-1 max-lg:hidden">
        <ThumbsUpIcon className="text-pink-40" size={16} weight="bold" />
        <p className="text-[14px] leading-4 text-neutral-10">
          {likeCount ?? 0}
        </p>
      </div>

      <div className="flex items-center gap-1 max-lg:hidden">
        <ShareFatIcon className="text-primary-50" size={16} weight="bold" />
        <p className="text-[14px] leading-4 text-neutral-20">
          {shareCount ?? 0}
        </p>
      </div>

    </div>
  );
}

function BottomButtons({ handleClickShare, isLiked, clickLikeStory }: BottomButtonsProps) {
  const t = useTranslations('ExploreStory'); // TODO: change it to 'BookInfo', migrate the lines from it on the locale files to 'BookInfo'
  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        iconLeft={<ShareFatIcon className="text-white" size={20} weight="bold" />}
        onClick={handleClickShare}
      >
        {t('share')}
      </Button>
      <Button
        variant="outline"
        iconLeft={(
          <ThumbsUpIcon
            className={isLiked ? 'text-pink-40' : 'text-primary-50'}
            size={20}
            weight={isLiked ? 'fill' : 'bold'}
          />
        )}
        onClick={clickLikeStory}
      >
        {t('like_button')}
      </Button>
    </div>
  );
}

// TODO: continue refactoring (bring the functions here, share modal could be separated into a file in this same folder)
export default function BookInfo(props: BookInfoProps) {
  return (
    <div
      className={mergeClassnames(
        'flex w-full flex-col lg:items-start gap-y-4 overflow-hidden rounded-2xl bg-white px-4 p-5 shadow-sm',
      )}
    >
      <CoverDetail
        coverPath={props.coverPath}
        topics={props.topics}
        children={props.children}
      />
      <Statistics
        viewCount={props.viewCount}
        likeCount={props.likeCount}
        shareCount={props.shareCount}
        rating={props.rating}
      />
      <BottomButtons
        isLiked={props.isLiked}
        handleClickShare={props.handleClickShare}
        clickLikeStory={props.clickLikeStory}
      />
    </div>
  );
}
