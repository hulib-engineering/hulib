import {
  Eye,
  NotePencil,
  ShareFat,
  ThumbsUp,
  Trash,
} from '@phosphor-icons/react';

import { useTranslations } from 'next-intl';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { Cover } from '@/features/stories/components/Cover';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { Chip } from '@/components/core/chip/Chip';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';

type BookInfoProps = {
  coverPath: string | undefined;
  topics?: Topic[];
  viewCount: number | undefined;
  likeCount: number | undefined;
  shareCount: number | undefined;
  isLiked?: boolean;
  isOwner?: boolean;
  handleClickShare?: () => void;
  clickLikeStory?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};
// TODO: continue refactoring (bring the functions here, share modal could be separated into a file in this same folder)
export default function BookInfo(props: BookInfoProps) {
  const t = useTranslations('ExploreStory');
  const tCommon = useTranslations('Common');
  return (
    <div
      className={mergeClassnames(
        'flex w-full flex-col items-center gap-y-4 overflow-hidden rounded-2xl bg-white px-4 py-6 shadow-sm',
      )}
    >
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex max-h-[340px] w-full items-center justify-center">
          <Cover src={props.coverPath ?? null} size="w-[226px] h-[340px]" />
        </div>
        {props.topics?.length ? (
          <div className="scrollbar-none hidden w-auto gap-2 overflow-x-auto scroll-smooth py-1 lg:flex">
            {props.topics.map((topic: Topic) => (
              <Chip
                key={topic.id}
                as="span"
                className={mergeClassnames(
                  'min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded border h-[22px] py-1 px-2',
                  'text-xs font-medium leading-[14px] ',
                  getTopicBadgeClasses(topic.color),
                )}
              >
                {topic.name}
              </Chip>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 lg:gap-x-8">
          <div className="flex items-center gap-x-1">
            <Eye className="text-primary-50" size={16} />
            <p className="text-[14px] font-medium leading-4 text-neutral-10">
              {props.viewCount ?? 0}
            </p>
          </div>
          <div className="flex items-center gap-x-1">
            <ThumbsUp className="text-pink-40" size={16} weight="fill" />
            <p className="text-[14px] font-medium leading-4 text-neutral-10">
              {props.likeCount}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ShareFat className="text-primary-50" size={16} />
            <p className="text-[14px] font-medium leading-4 text-neutral-20">
              {props.shareCount}
            </p>
          </div>
        </div>
      </div>
      {props.isOwner ? (
        <div className="flex w-full flex-col gap-2 max-lg:hidden">
          <div className="flex w-full gap-2">
            <Button
              iconLeft={<ShareFat className="text-white" size={20} weight="bold" />}
              onClick={props.handleClickShare}
              className="flex-1"
            >
              {t('share')}
            </Button>
            <Button
              variant="outline"
              iconLeft={<NotePencil className="text-primary-50" size={20} weight="bold" />}
              onClick={props.onEdit}
              className="flex-1"
            >
              {t('edit')}
            </Button>
          </div>
          <div className="flex w-full">
            <IconButton
              variant="outline"
              size="lg"
              className="w-full"
              aria-label={tCommon('delete') as string}
              onClick={props.onDelete}
            >
              <Trash className="text-[#2e3032]" size={20} weight="bold" />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2 max-lg:hidden">
          <Button
            iconLeft={<ShareFat className="text-white" size={20} weight="bold" />}
            onClick={props.handleClickShare}
          >
            {t('share')}
          </Button>
          <Button
            variant="outline"
            iconLeft={(
              <ThumbsUp
                className={props.isLiked ? 'text-pink-40' : 'text-primary-50'}
                size={20}
                weight={props.isLiked ? 'fill' : 'bold'}
              />
            )}
            onClick={props.clickLikeStory}
          >
            {t('like_button')}
          </Button>
        </div>
      )}
    </div>
  );
}
