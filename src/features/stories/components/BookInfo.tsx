import {
  EyeIcon,
  NotePencilIcon,
  ShareFatIcon,
  ThumbsUpIcon,
  TrashIcon,
} from '@phosphor-icons/react';

import { useTranslations } from 'next-intl';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { Cover } from '@/features/stories/components/Cover';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { Chip } from '@/components/core/chip/Chip';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import type { Story } from '@/libs/services/modules/stories/storiesType';

type BottomButtonsProps = {
  isLiked?: boolean;
  isOwner?: boolean;
  handleClickShare?: () => void;
  clickLikeStory?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

type StatisticsProps = Pick<Story, 'viewCount' | 'likeCount' | 'shareCount'>;

type CornerButtonsProps = Pick<BottomButtonsProps, 'onDelete'>;

type CoverDetailProps = Pick<Story, 'cover' | 'topics'> &
  CornerButtonsProps & {
    children?: React.ReactNode;
  };

type BookInfoProps = BottomButtonsProps & StatisticsProps & CoverDetailProps;

function CornerButtons({ onDelete }: CornerButtonsProps) {
  // TODO: add buttons and their conditions
  // e.g. mode = 'default' means there will be 2 edit and delete buttons
  // mode = 'storypagemobile' or something like that will have the bookmark button
  // Add 'lg' back to 'lg:hidden' when there's a clear flow of the bookmark feature

  return (
    <Button
      variant="outline"
      className="right-1 top-1 size-[44px] rounded-full"
      onClick={onDelete}
    >
      <TrashIcon className="shrink-0 text-[#2e3032]" size={20} weight="bold" />
    </Button>
  );
}

function CoverDetail({ cover, topics, onDelete }: CoverDetailProps) {
  return (
    <div className="relative flex w-full flex-col gap-y-4">
      <div className="flex max-h-[340px] w-full items-center justify-center">
        <Cover src={cover?.path ?? null} size="w-[226px] h-[340px]" />
      </div>
      {onDelete ? (
        <div className="absolute right-0 top-0 -translate-y-5 translate-x-5">
          <CornerButtons onDelete={onDelete} />
        </div>
      ) : null}
      {topics?.length ? (
        <div className="flex flex-wrap gap-2 py-1 max-lg:hidden">
          {topics.map((topic: Topic) => (
            <Chip
              key={topic.id}
              as="span"
              className={mergeClassnames(
                'min-w-0 shrink-0 rounded border h-[22px] py-1 px-2',
                'text-xs font-medium leading-[14px]',
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

function Statistics({ viewCount, likeCount, shareCount }: StatisticsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 gap-x-8">
      <div className="flex items-center gap-x-1">
        <EyeIcon className="text-primary-50" size={16} weight="bold" />
        <p className="text-[14px] leading-4 text-neutral-10">
          {viewCount ?? 0}
        </p>
      </div>

      <div className="flex items-center gap-x-1">
        <ThumbsUpIcon className="text-pink-40" size={16} weight="bold" />
        <p className="text-[14px] leading-4 text-neutral-10">
          {likeCount ?? 0}
        </p>
      </div>

      <div className="flex items-center gap-x-1">
        <ShareFatIcon className="text-primary-50" size={16} weight="bold" />
        <p className="text-[14px] leading-4 text-neutral-20">
          {shareCount ?? 0}
        </p>
      </div>
    </div>
  );
}

function BottomButtons({
  handleClickShare,
  isLiked,
  clickLikeStory,
  isOwner,
  onEdit,
}: BottomButtonsProps) {
  // TODO: change it to 'BookInfo', migrate the lines from it on the locale files to 'BookInfo'
  const t = useTranslations('ExploreStory');

  if (isOwner) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button
            iconLeft={<ShareFatIcon className="text-white" size={20} weight="bold" />}
            onClick={handleClickShare}
            className="flex-1"
          >
            {t('share')}
          </Button>
          <Button
            variant="outline"
            iconLeft={<NotePencilIcon className="text-primary-50" size={20} weight="bold" />}
            onClick={onEdit}
            className="flex-1"
          >
            {t('edit')}
          </Button>
        </div>
      </div>
    );
  }

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
        cover={props.cover}
        topics={props.topics}
        onDelete={props.onDelete}
      />
      <Statistics
        viewCount={props.viewCount}
        likeCount={props.likeCount}
        shareCount={props.shareCount}
      />
      <BottomButtons
        isLiked={props.isLiked}
        isOwner={props.isOwner}
        handleClickShare={props.handleClickShare}
        clickLikeStory={props.clickLikeStory}
        onEdit={props.onEdit}
      />
    </div>
  );
}
