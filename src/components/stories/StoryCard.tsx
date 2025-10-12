// TO DO: optimise rendering action buttons logic

import { BookOpen, BookmarkSimple, Bookmarks, CaretCircleRight, Heart, Trash } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { pushError, pushSuccess } from '../CustomToastifyContainer';

import AnimatedCover from './AnimatedCover';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import Modal from '@/components/Modal';
import { CustomCover } from '@/components/stories/CustomCover';
import StoryForm from '@/layouts/stories/StoryForm';
import { useDeleteStoryMutation } from '@/libs/services/modules/stories';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';
import { useAddStoryToMyFavoritesMutation, useRemoveStoryFromMyFavoritesMutation } from '@/libs/services/modules/user';

function renderHighlightedText(text: string, highlightClass = 'bg-green-70/50') {
  if (!text) {
    return null;
  }

  // Split by <b> and </b>, keep track of highlighted segments
  const parts = text.split(/(<b>|<\/b>)/g);

  let isBold = false;
  return parts.map((part, index) => {
    if (part === '<b>') {
      isBold = true;
      return null;
    }
    if (part === '</b>') {
      isBold = false;
      return null;
    }
    if (isBold) {
      return (
        <span key={index} className={highlightClass}>
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

type IStoryCardProps = {
  data: TStory;
  editable?: boolean;
  forceConfirm?: boolean;
  className?: string;
  showAdminControls?: boolean;
  withoutActions?: boolean;
};

export const StoryCard = ({
  data,
  editable = false,
  forceConfirm = false,
  showAdminControls = false,
  withoutActions = false,
  className,
}: IStoryCardProps) => {
  const router = useRouter();

  const t = useTranslations('ExploreStory');

  const [addToMyFavorites] = useAddStoryToMyFavoritesMutation();
  const [removeFromFavorite, { isLoading: isRemovingFromFavorites }] = useRemoveStoryFromMyFavoritesMutation();
  const [deleteStory, { isLoading: isDeletingStory }] = useDeleteStoryMutation();

  const dummyRef = useRef<HTMLDivElement>(null);

  const [isFavorite, setIsFavorite] = useState(data.isFavorite);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRemovalFromFavoritesConfirmationModalOpen, setIsRemovalFromFavoritesConfirmationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCloseModal = () => {
    if (isDeleteModalOpen) {
      setIsDeleteModalOpen(false);
    }
    if (isRemovalFromFavoritesConfirmationModalOpen) {
      setIsRemovalFromFavoritesConfirmationModalOpen(false);
    }
  };
  const handleDelete = async () => {
    try {
      await deleteStory(data.id).unwrap();
      setIsDeleteModalOpen(false);
      pushSuccess('Story deleted successfully');
    } catch (error) {
      pushError('Error deleting story');
    }
  };
  const handleManageFavoriteList = async () => {
    try {
      if (isFavorite) {
        if (forceConfirm && !isRemovalFromFavoritesConfirmationModalOpen) {
          setIsRemovalFromFavoritesConfirmationModalOpen(true);
          return;
        } else {
          const response = await removeFromFavorite(!forceConfirm ? data.id : data?.storyId).unwrap();
          pushSuccess(response?.message || t('story_removed_from_favorites'));
          setIsRemovalFromFavoritesConfirmationModalOpen(false);
        }
      } else {
        const response = await addToMyFavorites(data.id).unwrap();
        pushSuccess(response?.message || t('story_added_to_favorites'));
      }
      setIsFavorite(!isFavorite);
    } catch (err: any) {
      setIsFavorite(isFavorite);
      pushError(err?.data?.message || t('error_contact_admin'));
    }
  };
  const renderActionButtons = () => {
    if (withoutActions) {
      return null;
    }
    if (editable && data.publishStatus !== StoryPublishStatus.REJECTED) {
      return (
        <div className="flex w-full items-center gap-2">
          <Button
            size="lg"
            fullWidth
            className="grow"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            disabled={isDeletingStory}
            className="w-12 flex-none"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash weight="bold" width={20} height={20} />
          </Button>
        </div>
      );
    } else {
      if (showAdminControls) {
        return (
          <Button
            size="lg"
            iconLeft={<CaretCircleRight size={20} />}
            onClick={() => router.push(`/admin/stories/approval/${data.id}`)}
          >
            View Detail
          </Button>
        );
      }
      if (data.publishStatus === StoryPublishStatus.REJECTED) {
        return (
          <Button
            size="lg"
            onClick={() => router.push(`/explore-story/${data.id}/preview`)}
          >
            Preview
          </Button>
        );
      }
      return (
        <div className="hidden w-full items-center gap-2 lg:flex">
          <Button
            size="lg"
            className="grow"
            onClick={() => router.push(`/explore-story/${data.id}`)}
          >
            {t('read_story')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-12 flex-none p-0"
            onClick={handleManageFavoriteList}
          >
            {isFavorite ? (
              <BookmarkSimple weight="fill" className="text-4xl text-yellow-60" />
            ) : (
              <Bookmarks className="text-xl text-primary-50" />
            )}
          </Button>
        </div>
      );
    }
  };

  return (
    <>
      {/* Mobile version */}
      {data.publishStatus === StoryPublishStatus.PUBLISHED && !editable && (
        <div
          className={mergeClassnames(
            'w-full flex items-stretch gap-2.5 max-w-[392px] rounded-xl bg-white p-4 shadow-sm md:hidden',
            className,
          )}
        >
          <div className={mergeClassnames(
            'relative flex flex-1 shrink flex-col justify-between md:h-full md:w-1/2 min-w-0',
            !withoutActions && 'h-[260px]',
          )}
          >
            <div className="flex flex-col justify-between">
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex flex-col">
                  <h6 className="line-clamp-2 min-h-14 text-xl font-medium capitalize text-primary-10">
                    {data?.title.toLowerCase()}
                  </h6>
                </div>
                {data.topics && data.topics?.length > 0 && (
                  <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto py-2">
                    {data.topics?.map(topic => (
                      <Chip
                        key={topic.id}
                        className="h-full min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded-2xl bg-primary-90 px-2 py-1 text-[10px] leading-3 text-primary-50"
                      >
                        {topic.name}
                      </Chip>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Avatar imageUrl={data.humanBook.photo?.path} size="xs" />
                  <span className="line-clamp-1 flex-1 text-xs font-medium leading-[14px] text-[#73787C]">
                    {data?.humanBook?.fullName}
                  </span>
                  <div className="ml-1 flex items-center gap-1">
                    <Heart className="text-xs text-yellow-50" weight="fill" />
                    <p className="text-xs font-medium leading-[14px] text-neutral-20">
                      {data?.storyReview?.rating || 0}
                    </p>
                    <p className="ml-1 line-clamp-1 text-[10px] font-normal leading-[14px] text-neutral-40">
                      {`${data?.storyReview?.numberOfReviews || 0} ${t('ratings')}`}
                    </p>
                  </div>
                </div>
                <div className="mt-0.5 flex flex-1 flex-col">
                  <p className="line-clamp-3 text-xs leading-5 text-neutral-30">
                    {data?.highlightAbstract
                      ? renderHighlightedText(data?.highlightAbstract)
                      : data?.abstract}
                  </p>
                </div>
              </div>
            </div>
            {!withoutActions && (
              <Button
                size="lg"
                iconLeft={<BookOpen />}
                onClick={() => router.push(`/explore-story/${data.id}`)}
              >
                Read all
              </Button>
            )}
          </div>
          <div className="relative flex w-[140px] flex-col justify-between md:w-1/2">
            <div className="h-[198px] rounded-2xl md:h-[255px]">
              <CustomCover
                titleStory={data?.title ?? ''}
                authorName={data?.humanBook?.fullName || ''}
                srcImage={data?.cover?.path || ''}
              />
            </div>
            {!withoutActions && (
              <Button size="lg" variant="outline" iconLeft={<Bookmarks />} onClick={handleManageFavoriteList}>
                Favorite
              </Button>
            )}
          </div>
        </div>
      )}

      {/* PC version */}
      <div
        className={mergeClassnames(
          'w-full items-stretch max-w-[392px] rounded-xl bg-white p-4 shadow-sm flex',
          data.publishStatus === StoryPublishStatus.PUBLISHED && !editable && 'hidden md:flex',
          className,
        )}
      >
        <div className="relative flex w-1/2 flex-1 flex-col justify-between pr-4 pt-2">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col">
              <h6 className="line-clamp-2 min-h-14 text-xl font-medium capitalize text-primary-10">
                {data?.title.toLowerCase()}
              </h6>
              {data.publishStatus === 'rejected' && (
                <p className="font-medium text-red-50">(Rejected)</p>
              )}
            </div>
            {data.topics && data.topics?.length > 0 && (
              <div className="flex w-full items-center gap-2 overflow-x-auto">
                {data.topics?.map(topic => (
                  <Chip
                    key={topic.id}
                    className="h-full overflow-visible rounded-2xl bg-primary-90 px-2 py-1 text-xs leading-[14px] text-primary-50"
                  >
                    {topic.name}
                  </Chip>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Avatar imageUrl={data.humanBook.photo?.path} className="size-6" />
              <span className="line-clamp-1 text-sm font-medium leading-4 text-[#73787C]">
                {data?.humanBook?.fullName}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Heart className="text-yellow-50" weight="fill" />
              <p className="text-sm font-medium leading-4 text-neutral-20">
                {data?.storyReview?.rating || 0}
              </p>
              <p className="ml-1 text-xs font-normal leading-[14px] text-neutral-40">
                {`${data?.storyReview?.numberOfReviews || 0} ${t('ratings')}`}
              </p>
            </div>
          </div>
          {renderActionButtons()}
        </div>
        <div className="relative h-[255px] w-1/2 rounded-2xl">
          <AnimatedCover
            abstract={data?.abstract ?? ''}
            title={data?.title ?? ''}
            authorName={data?.humanBook?.fullName || ''}
            coverUrl={data?.cover?.path || ''}
            highlightTitle={data?.highlightTitle}
            highlightAbstract={data?.highlightAbstract}
            isPublished={data.publishStatus === 'published'}
            onClick={() => router.push(`/explore-story/${data?.id}${data.publishStatus !== 'published' ? '/preview' : ''}`)}
          />
        </div>
      </div>

      {/* Delete Story/Remove Story From My Favorites Modal */}
      <Modal
        open={isDeleteModalOpen || isRemovalFromFavoritesConfirmationModalOpen}
        initialFocus={dummyRef}
        onClose={handleCloseModal}
      >
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl px-1 py-5 shadow-none lg:px-5">
          <div tabIndex={-1} ref={dummyRef} aria-hidden="true" />

          <div className="flex flex-col items-center justify-center gap-8">
            {/* Title */}
            <h4 className="px-4 text-center text-[28px] font-medium leading-9 text-black lg:px-0">
              {isDeleteModalOpen
                ? 'Are you sure you want to delete story?'
                : 'Are you sure you want to remove this story from your favorite list?'}
            </h4>

            {/* Story Card */}
            <StoryCard
              data={data}
              withoutActions={isRemovalFromFavoritesConfirmationModalOpen}
              // editable={isDeleteModalOpen}
            />

            {/* Extra description only for delete */}
            {isDeleteModalOpen && (
              <p className="px-4 text-center text-red-50 lg:px-0">
                This story will be deleted immediately.
                <br />
                <span className="text-black">You can&apos;t undo this action.</span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex w-full gap-3 px-4 lg:px-0">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                fullWidth
                disabled={isDeleteModalOpen ? isDeletingStory : isRemovingFromFavorites}
                animation={
                  ((isDeleteModalOpen && isDeletingStory)
                    || (isRemovalFromFavoritesConfirmationModalOpen
                      && isRemovingFromFavorites))
                    && 'progress'
                }
                onClick={
                  isDeleteModalOpen ? handleDelete : handleManageFavoriteList
                }
              >
                {isDeleteModalOpen ? 'Delete' : 'Confirm'}
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
      {/* Edit Story */}
      <Modal
        open={isEditModalOpen}
        disableClosingTrigger
        onClose={() => setIsEditModalOpen(false)}
      >
        <Modal.Backdrop />
        <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
          <StoryForm
            type="edit"
            story={data}
            onSucceed={() => setIsEditModalOpen(false)}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal.Panel>
      </Modal>
    </>
  );
};
