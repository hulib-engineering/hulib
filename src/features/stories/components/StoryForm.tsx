'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { z } from 'zod';
import { set } from 'idb-keyval';

import { CustomCoverModal } from './CustomCoverModal';
import { StoryContentField, SubmitAndDraftButton, TitleField, TopicsField } from './_StoryForm/FieldsAndButton';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import Form from '@/components/core/form/Form';
// import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import type { TFilter } from '@/layouts/scheduling/BigCalendar'; // TODO: check again to see why some topics state/lists use this type - which is very weird
import { useAppSelector } from '@/libs/hooks';
import { useUploadMutation } from '@/libs/services/modules/files';
// import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import {
  useCreateStoryMutation,
  useGetRelatedTopicsQuery,
  useUpdateStoryMutation,
} from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { StoriesValidation } from '@/validations/StoriesValidation';
import { CustomCoverBuilder } from '@/features/stories/components/CustomCoverBuilder';
import type { CoverCustomization } from '@/features/stories/types';
import type { CoverPresetAsset } from '@/features/stories/constants';
import {
  COVER_EXPORT_ELEMENT_ID,
  COVER_PRESET_ASSETS,
} from '@/features/stories/constants';
import {
  getDefaultCustomization,
  rasterizeCoverElement,
  uploadCoverBlob,
} from '@/features/stories/utils';
import { useDraftId } from '@/libs/hooks/useDraftId';

// const filter = (
//   query: string,
//   filters: { id: number; label: string; value: string }[],
// ) => {
//   return query === ''
//     ? filters
//     : filters.filter(({ label }) =>
//       label
//         .toLowerCase()
//         .replace(/\s+/g, '')
//         .includes(query.toLowerCase().replace(/\s+/g, '')),
//     );
// };

type IStoryFormProps = | {
  type: 'create';
  onCancel: () => void;
  onSucceed: () => void;
} | {
  type: 'create-first';
  onBack: () => void;
  onSucceed: () => void;
} | {
  type: 'edit';
  story: Story;
  onCancel: () => void;
  onSucceed: () => void;
};

function CoverPickerTitle() {
  const t = useTranslations('Common');

  return (
    <p className="mb-2 text-sm">
      {t('cover_picture')}
      {' '}
      <span className="text-red-50">*</span>
    </p>
  );
}

export default function StoryForm(props: IStoryFormProps) {
  let swiperRef: any = null;
  const router = useRouter();
  const t = useTranslations('Common');

  const pathname = usePathname();
  const draftId = useDraftId();
  const userInfo = useAppSelector(state => state.auth.userInfo);

  const { data: relatedTopics } = useGetRelatedTopicsQuery(
    Number(props.type === 'edit' && props.story.id),
    { skip: props.type !== 'edit' || (props.story.topics?.length ?? 0) > 0 },
  );
  const [uploadCover] = useUploadMutation();
  const [createStory] = useCreateStoryMutation();
  const [editStory] = useUpdateStoryMutation();

  const storyTopicsFromProps = props.type === 'edit' ? props.story.topics : undefined;
  const storyRelatedTopics = useMemo(() => {
    if (props.type === 'edit') {
      const storyTopics: Topic[] = storyTopicsFromProps && storyTopicsFromProps.length > 0
        ? storyTopicsFromProps : (relatedTopics ?? []);
      return storyTopics?.map(topic => ({
        label: topic.name,
        value: topic.id.toString(),
        id: topic.id,
      }));
    }
    return [];
  }, [props.type, relatedTopics, storyTopicsFromProps]);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof StoriesValidation>>({
    resolver: zodResolver(StoriesValidation),
    defaultValues: {
      title: props.type === 'edit' ? props.story.title : '',
      abstract: props.type === 'edit' ? props.story.abstract : '',
      topics: (props.type === 'edit' && storyRelatedTopics?.length > 0)
        ? storyRelatedTopics?.map(topic => ({ id: topic.id.toString() })) : [],
      cover: { id: '' },
    },
  });
  const title = watch('title') || '';
  const abstract = watch('abstract') || '';

  const [selectedCoverSample, setSelectedCoverSample] = useState<CoverPresetAsset>(
    COVER_PRESET_ASSETS[0],
  );
  const [isCustomCoverActive, setIsCustomCoverActive] = useState(false);
  const [coverCustomization, setCoverCustomization] = useState<CoverCustomization>(
    () => getDefaultCustomization(COVER_PRESET_ASSETS[0]!),
  );
  const [isCustomCoverModalOpen, setIsCustomCoverModalOpen] = useState(false);
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<TFilter[]>(storyRelatedTopics);
  const isFormValid = Boolean(
    title.trim() && abstract.trim() && selectedTopics.length > 0,
  );
  // const queriedTopicOptions = filter(topicQuery, topicOptions || []);
  // const queriedTopicOptions = topicOptions;

  useEffect(() => {
    setValue('topics', selectedTopics.map(topic => ({ id: topic.id.toString() })));
  }, [selectedTopics, setValue]);

  const handleSelectPreset = useCallback((cover: CoverPresetAsset) => {
    setSelectedCoverSample(cover);
    setIsCustomCoverActive(false);
    setCoverCustomization(getDefaultCustomization(cover));
    setValue('cover', { id: '' }, { shouldDirty: true });
  }, [setValue]);

  const handleSwipeAndSelectCover = (swiper: any) => {
    const index = swiper.activeIndex;
    setCurrentCoverIndex(index);
    const cover = COVER_PRESET_ASSETS[index];
    if (cover) {
      handleSelectPreset(cover);
    }
  };

  const handleCustomCoverDone = useCallback((payload: {
    customization: CoverCustomization;
  }) => {
    setCoverCustomization(payload.customization);
    setIsCustomCoverActive(true);
    setValue('cover', { id: '' }, { shouldDirty: true });
  }, [setValue]);

  const getThumbnailCustomization = useCallback((cover: string) => {
    if (selectedCoverSample === cover) {
      return coverCustomization;
    }
    return getDefaultCustomization(cover);
  }, [coverCustomization, selectedCoverSample]);

  const rasterizeAndUploadCover = async (): Promise<string | undefined> => {
    try {
      const blob = await rasterizeCoverElement(COVER_EXPORT_ELEMENT_ID);
      const extension = blob.type.split('/')[1] || 'png';
      const fileName = `${title.trim() || 'story-cover'}-${Date.now()}.${extension}`;
      return uploadCoverBlob(blob, fileName, uploadCover);
    } catch (err) {
      console.error('Cover upload failed', err);
      pushError(t('error_contact_admin'));
      return undefined;
    }
  };

  const onSubmit = async (formValues: z.infer<typeof StoriesValidation>) => {
    try {
      const selectedTopicIds = formValues.topics.map(topic => Number(topic.id));

      if (props.type !== 'edit') {
        const uploadedCoverId = await rasterizeAndUploadCover();
        if (!uploadedCoverId || uploadedCoverId === '') {
          return;
        }

        const result = await createStory({
          ...formValues,
          humanBook: { id: userInfo?.id },
          cover: { id: uploadedCoverId },
          publishStatus: 'draft',
        }).unwrap();

        pushSuccess(t('story_create_success'));
        router.push(`/register-huber/success?storyId=${result.id}`);
        props.onSucceed();
      } else {
        const uploadedCoverId = await rasterizeAndUploadCover();
        if (!uploadedCoverId || uploadedCoverId === '') {
          return;
        }

        await editStory({
          title: formValues.title,
          abstract: formValues.abstract,
          topics: selectedTopicIds,
          id: props.story.id,
          cover: { id: uploadedCoverId },
          publishStatus: 'draft',
        }).unwrap();
        pushSuccess(t('edit_book_success'));
        props.onSucceed();
      }
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    }
  };

  async function saveDraft() {
    /*
      CAUTIONARY NOTES:
      Since making changes to schema of indexdb could make users who already stored keys to encounter errors, do...

      1. LEAVE IT INTACT. Don't change the DB name, store name, or key prefix ('draft-').
         Renaming any of them orphans every draft users already have.

      2. DON'T CHANGE THE SHAPE OF A DRAFT (add, remove, rename, retype a field) unless
         you also handle old records. There is NO migration layer yet, so existing
         'draft-*' records in users' browsers keep their old shape forever.
         If you must change it, pick one:
         a. Backward compatible: make every reader tolerate missing or old fields
            (optional chaining, defaults). Prefer additive changes only.
         b. Add migrations: introduce a schemaVersion on records, upgrade old ones on read,
            and skip or delete records that fail validation.

      3. If users could get stuck because of old records, consider adding a button in the
         frontend that calls useDeleteAllDrafts so they can wipe their drafts themselves.
    */
    try {
      const coverBlob = await rasterizeCoverElement(COVER_EXPORT_ELEMENT_ID);

      await set(`draft-${draftId}`, {
        id: draftId,
        abstract,
        title,
        coverBlob,
        topics: selectedTopics.map(topic => ({ id: topic.id, name: topic.label })),
        humanBook: { fullName: userInfo.fullName, photo: { path: '' } },
        rating: 0,
        storyReview: {},
        publishStatus: 'draft',
      });
    } catch (err) {
      console.error('Draft save failed', err);
      pushError(t('error_contact_admin'));
      return;
    }
    pushSuccess(t('draft_create_success'), t('draft_create_success_title'));

    const userProfile = `/users/${userInfo.id}?tab=stories`;
    if (!pathname.includes(userProfile)) {
      router.push(userProfile);
    }
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-white
      max-[955px]:mt-2 min-[955px]:p-5"
    >
      {props.type === 'edit' && (
        <div className="flex items-center gap-3 px-4 pt-2 min-[955px]:px-0 min-[955px]:pt-0">
          <IconButton variant="ghost" size="lg" onClick={props.onCancel} aria-label={t('back') as string}>
            <ArrowLeftIcon size={20} />
          </IconButton>
          <h2 className="text-2xl font-medium leading-9 text-black">{t('edit_book_title')}</h2>
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 min-[955px]:flex-row
          min-[955px]:items-start min-[955px]:gap-6"
        >
          {/* Cột trái */}
          <div className="flex max-w-[600px] flex-1 flex-col max-[955px]:hidden">
            <CoverPickerTitle />
            <div className="flex flex-1 rounded-2xl
              border border-neutral-90 bg-neutral-98 p-5"
            >
              {/* Desktop */}
              <div className="hidden w-full cursor-pointer flex-col gap-4 min-[955px]:flex">
                <div className="flex justify-between gap-2">
                  {COVER_PRESET_ASSETS.map((cover, index) => (
                    <div key={cover} className="flex flex-col gap-2">
                      <CustomCoverBuilder
                        storyTitle={title.trim() || t('placeholder_title')}
                        authorName={userInfo?.fullName}
                        coverImgSrc={
                          isCustomCoverActive && selectedCoverSample === cover
                            ? ''
                            : cover
                        }
                        customization={getThumbnailCustomization(cover)}
                        active={selectedCoverSample === cover}
                        onClick={() => handleSelectPreset(cover)}
                      />
                      {selectedCoverSample === cover ? (
                        <Button
                          onClick={() => setIsCustomCoverModalOpen(true)}
                          className="bg-primary-90 text-primary-50 hover:text-white"
                          iconRight={<PencilSimpleIcon size={16} />}
                        >
                          {t('custom')}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSelectPreset(cover)}
                          className="border-neutral-80 bg-white text-primary-50 hover:border-primary-50 hover:bg-primary-50 hover:text-white"
                        >
                          {`${t('style')} ${index + 1}`}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <TitleField register={register} errors={errors} />
            <TopicsField selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />
            <StoryContentField register={register} errors={errors} />

            <div className="flex flex-1 flex-col px-4 pb-24 min-[955px]:hidden">
              <CoverPickerTitle />
              <div className="flex flex-1 rounded-2xl
                border border-neutral-90 bg-neutral-98 p-5"
              >
                {/* Mobile */}
                <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={16}
                    loop={false}
                    className="w-full"
                    onSwiper={swiper => (swiperRef = swiper)}
                    onSlideChange={handleSwipeAndSelectCover}
                  >
                    {COVER_PRESET_ASSETS.map(cover => (
                      <SwiperSlide key={cover}>
                        <div className="flex items-center justify-center">
                          <CustomCoverBuilder
                            storyTitle={title.trim() || t('placeholder_title')}
                            authorName={userInfo?.fullName}
                            coverImgSrc={
                              isCustomCoverActive && selectedCoverSample === cover
                                ? ''
                                : cover
                            }
                            customization={getThumbnailCustomization(cover)}
                            active={selectedCoverSample === cover}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="mt-3 flex justify-center space-x-2">
                    {COVER_PRESET_ASSETS.map((cover, idx) => (
                      <button
                        key={cover}
                        type="button"
                        className={mergeClassnames(
                          'size-2 rounded-full transition-all duration-300',
                          currentCoverIndex === idx ? 'w-10 bg-neutral-80' : 'bg-neutral-90',
                        )}
                        onClick={() => swiperRef?.slideTo(idx)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="soft"
                    size="sm"
                    className="w-[180px]"
                    iconRight={<PencilSimpleIcon size={16} />}
                    onClick={() => setIsCustomCoverModalOpen(true)}
                  >
                    {t('custom')}
                  </Button>
                </div>
              </div>
            </div>
            <SubmitAndDraftButton isSubmitting={isSubmitting} isFormValid={isFormValid} type={props.type} saveDraft={saveDraft} />
          </div>

        </div>
      </Form>

      <div
        className="pointer-events-none fixed left-[-10000px] top-0"
        aria-hidden
      >
        <CustomCoverBuilder
          previewId={COVER_EXPORT_ELEMENT_ID}
          storyTitle={title.trim() || t('placeholder_title')}
          authorName={userInfo?.fullName ?? ''}
          customization={coverCustomization}
        />
      </div>

      <CustomCoverModal
        open={isCustomCoverModalOpen}
        onClose={() => setIsCustomCoverModalOpen(false)}
        title={title}
        authorName={userInfo?.fullName ?? ''}
        initialCustomization={coverCustomization}
        onDoneClick={handleCustomCoverDone}
      />
    </div>
  );
}
