'use client';

import { ArrowLeft, X } from '@phosphor-icons/react';
import Image from 'next/image';
import { notFound, redirect, useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';

import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { pushError } from '@/components/CustomToastifyContainer';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import { CustomCover } from '@/components/stories/CustomCover';
import { DetailedStory } from '@/components/stories/DetailedStory';
import StoryForm from '@/layouts/stories/StoryForm';
import { useAppSelector } from '@/libs/hooks';
import {
  useDeleteStoryMutation,
  useGetRelatedTopicsQuery,
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';
import type { Topic } from '@/libs/services/modules/topics/topicType';

export default function Index() {
  const { id } = useParams();
  const router = useRouter();

  const t = useTranslations('ExploreStory');

  const { data, isLoading } = useGetStoryDetailQuery(Number(id));
  const { data: relatedTopics } = useGetRelatedTopicsQuery(Number(id));
  const [deleteStory, { isLoading: isDeletingStory }] = useDeleteStoryMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteStory(data.id).unwrap();
      setIsDeleteSuccessModalOpen(true);
    } catch (error) {
      pushError('Error deleting story');
    }
  };
  const handleCloseDeleteSuccessModal = () => {
    setIsDeleteSuccessModalOpen(false);
    router.back();
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-sm py-8 lg:max-w-screen-xl">
        <StoryDetailSkeleton />
      </div>
    );
  }

  if (data && userInfo && userInfo.id && userInfo.id !== data?.humanBookId) {
    return redirect(`/users/${userInfo.id}?tab=stories`);
  }

  if (data && data?.publishStatus === PublishStatusEnum.PUBLISHED) {
    return redirect(`/explore-story/${data.id}`);
  }

  if (data && data?.publishStatus === PublishStatusEnum.DELETED) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-screen-sm py-8 lg:max-w-screen-xl">
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size="lg"
          iconLeft={<ArrowLeft />}
          className="w-fit text-black"
          onClick={() => router.back()}
        >
          Back
        </Button>
        {!isEditing ? (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <DetailedStory
                title={data?.title || ''}
                cover={data?.humanBook?.photo?.path ?? '/assets/images/half-title-illus.png'}
                authorName={data?.humanBook?.fullName || ''}
                abstract={data?.abstract || ''}
              />
            </div>
            <div className="size-full overflow-hidden rounded-2xl bg-white p-6 lg:max-w-[268px]">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <h5 className="text-2xl font-medium leading-9 text-primary-10">{data?.title}</h5>
                    {data?.publishStatus === PublishStatusEnum.REJECTED && (
                      <p className="text-lg font-medium text-red-50">(Rejected)</p>
                    )}
                    {data?.publishStatus === PublishStatusEnum.DRAFT && (
                      <p className="font-medium text-primary-60">(Draft)</p>
                    )}
                  </div>
                  <div className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
                    {(relatedTopics ?? []).map((topic: Topic) => (
                      <Chip
                        className="h-fit w-full snap-start overflow-visible rounded-2xl bg-blue-90 p-2 text-xs leading-[14px] text-primary-50"
                        key={topic.id}
                        disabled
                      >
                        {topic.name}
                      </Chip>
                    ))}
                  </div>
                </div>
                {data?.publishStatus === PublishStatusEnum.REJECTED && (
                  <div className="flex flex-col gap-2">
                    <Label>Reason</Label>
                    <div className="rounded-2xl border border-red-60 bg-neutral-98 p-3 text-sm leading-4 text-neutral-40">
                      {data?.rejectionReason}
                    </div>
                  </div>
                )}
                <CustomCover
                  titleStory={data?.title}
                  authorName={data?.humanBook?.fullName ?? ''}
                  srcImage={
                    data?.cover?.path
                    ?? '/assets/images/cover-book/story_background_yellow.png'
                  }
                />
                {data?.publishStatus === PublishStatusEnum.REJECTED ? (
                  <Button
                    size="lg"
                    fullWidth
                    onClick={() => router.push(`/users/${userInfo.id}?tab=stories`)}
                  >
                    {t('share_story')}
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      fullWidth
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      disabled={isDeletingStory}
                      animation={isDeletingStory && 'progress'}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] bg-white">
            <StoryForm
              type="edit"
              story={{ ...data, topics: relatedTopics }}
              onSucceed={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>
      {/* Delete Story/Remove Story From My Favorites Modal */}
      <Modal
        open={isDeleteSuccessModalOpen}
        onClose={handleCloseDeleteSuccessModal}
      >
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl bg-neutral-98 shadow-none">
          <div className="flex flex-col items-center justify-center">
            {/* Modal Header */}
            <div className="flex w-full items-center justify-end px-4 pt-4">
              <X className="cursor-pointer text-2xl text-[#343330]" onClick={handleCloseDeleteSuccessModal} />
            </div>

            {/* Modal Body */}
            <div className="flex flex-col items-center justify-center gap-5 px-6 pb-6">
              <div className="rounded-full bg-[#D9FDEE] p-1 text-[#32D583]">
                <Image
                  alt="Check icon"
                  src="/assets/icons/check-fill-circle.svg"
                  width={48}
                  height={48}
                  className="size-12 object-cover"
                />
              </div>
              <h6 className="text-center text-xl font-bold text-neutral-10">
                Story “
                <span className="text-primary-60">{data?.title}</span>
                ” is deleted successfully
              </h6>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
}
