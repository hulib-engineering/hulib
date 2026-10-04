'use client';

import { ArrowLeftIcon, XIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';

import Button from '@/components/core/button/Button';
import { redirect, useRouter } from '@/libs/i18nNavigation';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError } from '@/components/CustomToastifyContainer';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import { Cover } from '@/features/stories/components/Cover';
import { DEFAULT_STORY_COVER_ASSET } from '@/features/stories/constants';
import { DetailedStory } from '@/features/stories/components/DetailedStory';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import StoryForm from '@/features/stories/components/StoryForm';
import { useAppSelector } from '@/libs/hooks';
import {
  useDeleteStoryMutation,
  useGetRelatedTopicsQuery,
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { useDeleteDraft, useDraftStory } from '@/utils/loadDraft'; // TODO: rename the file 'loadDraft' to 'draftUtils' or something more fitting

function Default({ id }: { id: string }) {
  const router = useRouter();

  const t = useTranslations('ExploreStory');
  const tCommon = useTranslations('Common');

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
    } catch {
      pushError('Error deleting story');
    }
  };
  const handleCloseDeleteSuccessModal = () => {
    setIsDeleteSuccessModalOpen(false);
    router.push('/');
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
  // TODO: maybe clean the draft portions here if the Default component truly doesn't need draft codes
  return (
    <div className="mx-auto w-full max-w-screen-sm py-8 lg:max-w-screen-xl">
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size="lg"
          iconLeft={<ArrowLeftIcon />}
          className="w-fit text-black"
          onClick={() => router.back()}
        >
          {tCommon('back')}
        </Button>
        {!isEditing ? (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <DetailedStory
                title={data?.title || ''}
                cover={data?.humanBook?.photo?.path ?? '/assets/images/landing/half-title-illus.png'}
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
                      <p className="text-lg font-medium text-red-50">
                        (
                        {t('rejected')}
                        )
                      </p>
                    )}
                    {data?.publishStatus === PublishStatusEnum.DRAFT && (
                      <p className="font-medium text-primary-60">
                        (
                        {t('draft')}
                        )
                      </p>
                    )}
                  </div>
                  <div className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
                    {(relatedTopics ?? []).map((topic: Topic) => (
                      <Chip
                        key={topic.id}
                        className={mergeClassnames(
                          'h-fit snap-start overflow-visible rounded-2xl border p-2 text-xs leading-[14px]',
                          getTopicBadgeClasses(topic.color),
                        )}
                      >
                        {topic.name}
                      </Chip>
                    ))}
                  </div>
                </div>
                {data?.publishStatus === PublishStatusEnum.REJECTED && (
                  <div className="flex flex-col gap-2">
                    <Label>{t('reason')}</Label>
                    <div className="rounded-2xl border border-red-60 bg-neutral-98 p-3 text-sm leading-4 text-neutral-40">
                      {data?.rejectionReason}
                    </div>
                  </div>
                )}
                <Cover src={data?.cover?.path ?? DEFAULT_STORY_COVER_ASSET} />
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
                      {tCommon('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      disabled={isDeletingStory}
                      animation={isDeletingStory && 'progress'}
                      onClick={handleDelete}
                    >
                      {tCommon('delete')}
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
              <XIcon className="cursor-pointer text-2xl text-[#343330]" onClick={handleCloseDeleteSuccessModal} />
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
                {t('story')}
                {' '}
                “
                <span className="text-primary-60">{data?.title}</span>
                ”
                {' '}
                {t('is_deleted_successfully')}
              </h6>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
}

function Draft({ id }: { id: string }) {
  const router = useRouter();

  const t = useTranslations('ExploreStory');
  const tCommon = useTranslations('Common');

  const { draft: data, isLoading } = useDraftStory(id);
  const { deleteDraft, isLoading: isDeletingDraft } = useDeleteDraft();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDraft(id);
      setIsDeleteSuccessModalOpen(true);
    } catch {
      pushError('Error deleting story');
    }
  };
  const handleCloseDeleteSuccessModal = () => {
    setIsDeleteSuccessModalOpen(false);
    router.push(`/users/${userInfo.id}?tab=stories`);
  };

  if (isLoading || isDeletingDraft) {
    return (
      <div className="mx-auto w-full max-w-screen-sm py-8 lg:max-w-screen-xl">
        <StoryDetailSkeleton />
      </div>
    );
  }

  if (!data) {
    return redirect(`/users/${userInfo.id}?tab=stories`);
  }

  return (
    <div className="mx-auto w-full max-w-screen-sm py-8 lg:max-w-screen-xl">
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size="lg"
          iconLeft={<ArrowLeftIcon />}
          className="w-fit text-black"
          onClick={() => router.back()}
        >
          {tCommon('back')}
        </Button>
        {!isEditing ? (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <DetailedStory
                title={data?.title || ''}
                cover={data?.humanBook?.photo?.path ?? '/assets/images/landing/half-title-illus.png'}
                authorName={data?.humanBook?.fullName || ''}
                abstract={data?.abstract || ''}
              />
            </div>
            <div className="size-full overflow-hidden rounded-2xl bg-white p-6 lg:max-w-[268px]">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <h5 className="text-2xl font-medium leading-9 text-primary-10">{data?.title}</h5>
                    <p className="font-medium text-primary-60">
                      (
                      {t('draft')}
                      )
                    </p>
                  </div>
                  <div className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
                    {(data.topics ?? []).map((topic: Topic) => (
                      <Chip
                        key={topic.id}
                        className={mergeClassnames(
                          'h-fit snap-start overflow-visible rounded-2xl border p-2 text-xs leading-[14px]',
                          getTopicBadgeClasses(topic.color),
                        )}
                      >
                        {topic.name}
                      </Chip>
                    ))}
                  </div>
                </div>
                <Cover src={data?.cover?.path ?? DEFAULT_STORY_COVER_ASSET} />
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    fullWidth
                    onClick={() => setIsEditing(true)}
                  >
                    {tCommon('edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    disabled={isDeletingDraft}
                    animation={isDeletingDraft && 'progress'}
                    onClick={handleDelete}
                  >
                    {tCommon('delete')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] bg-white">
            <StoryForm
              type="edit-draft"
              story={data}
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
              <XIcon className="cursor-pointer text-2xl text-[#343330]" onClick={handleCloseDeleteSuccessModal} />
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
                {t('story')}
                {' '}
                “
                <span className="text-primary-60">{data?.title}</span>
                ”
                {' '}
                {t('is_deleted_successfully')}
              </h6>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
}

/* export default function Index() {
  const { id } = useParams<{ id: string }>();
  const rawId = String(id ?? '');

  if (rawId.startsWith('draft-')) {
    return <Draft id={rawId.slice('draft-'.length)} />;
  }

  return <Default id={rawId.slice('draft-'.length)} />;
} */

// Note: The following ancestor function/component is meant to be used as a temporary solution (or permanent) due to some publishStatus issue from the BE part
// what it resolved: waiting for approval stories can't be edited due to the draft flow
// If BE resolved the issue somehow (by making the newly created stories while waiting for approval having status 'Pending', instead of 'draft'):
// ...consider just using the commented out code above instead for reduced complexity

const INT_ID_REGEX = /^\d{1,10}$/;
const UUID_REGEX
  = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function Index() {
  const { id } = useParams<{ id: string }>();
  const rawId = String(id ?? '');
  const cleanId = rawId.replace(/^draft-/, '');

  if (UUID_REGEX.test(cleanId)) {
    return <Draft id={cleanId} />;
  }
  if (INT_ID_REGEX.test(cleanId)) {
    return <Default id={cleanId} />;
  }
  return notFound();
}
