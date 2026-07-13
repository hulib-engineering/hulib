'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown, PencilSimple } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { z } from 'zod';

import { useRouter } from 'next/navigation';
import { CustomCoverModal } from './CustomCoverModal';
import Button from '@/components/core/button/Button';
import Combobox, { getChipColor } from '@/components/core/combobox/Combobox';
import Form from '@/components/core/form/Form';
// import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import TextArea from '@/components/core/textArea/TextArea';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Label from '@/components/Label';
import type { TFilter } from '@/layouts/scheduling/BigCalendar';
import { useAppSelector } from '@/libs/hooks';
import { useUploadMutation } from '@/libs/services/modules/files';
// import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import {
  useCreateStoryMutation,
  useGetRelatedTopicsQuery,
  useUpdateStoryMutation,
} from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
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

export default function StoryForm(props: IStoryFormProps) {
  let swiperRef: any = null;
  const router = useRouter();
  const t = useTranslations('Common');
  // const tProfile = useTranslations('MyProfile');

  const userInfo = useAppSelector(state => state.auth.userInfo);

  // const { data: me } = useGetPersonalInfoQuery(undefined, {
  //   skip: !userInfo?.id,
  // });
  const { data: relatedTopics } = useGetRelatedTopicsQuery(
    Number(props.type === 'edit' && props.story.id),
    { skip: props.type !== 'edit' || props.story.topics?.length > 0 },
  );
  const [uploadCover] = useUploadMutation();
  const [createStory] = useCreateStoryMutation();
  const [editStory] = useUpdateStoryMutation();

  // const topicOptions = useMemo(
  //   () =>
  //     (me?.sharingTopics ?? []).map((topic: Topic) => ({
  //       label: topic.name,
  //       value: topic.id.toString(),
  //       id: topic.id,
  //     })),
  //   [me],
  // );

  const [topicQuery, setTopicQuery] = useState('');

  const { data: topicsData } = useGetTopicsQuery({
    name: topicQuery || undefined, // search theo query nếu có
    limit: 50,
  });

  const topicOptions = useMemo(
    () =>
      (topicsData?.data ?? []).map((topic: Topic) => ({
        label: topic.name,
        value: topic.id.toString(),
        id: topic.id,
      })),
    [topicsData],
  );

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
  // const queriedTopicOptions = filter(topicQuery, topicOptions || []);
  const queriedTopicOptions = topicOptions;

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

  const handleRemoveTopic = useCallback(
    (index: unknown) => {
      setSelectedTopics(selectedTopics.filter(({ id }) => id !== index));
    },
    [selectedTopics],
  );

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

        pushSuccess('Story created successfully');
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
        pushSuccess('Story edited successfully');
        props.onSucceed();
      }
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    }
  };
  // CHANGE: Changed 'xl' and 'lg' breakpoints to 'sm' or 'md'.
  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-white
      max-[955px]:mt-2 min-[955px]:p-5"
    >
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 min-[955px]:flex-row
          min-[955px]:items-stretch min-[955px]:gap-6"
        >
          {/* Cột trái */}
          <div className="flex flex-1 flex-col max-[955px]:hidden">
            <p className="mb-2 text-sm font-medium text-black">
              {t('cover_picture')}
              {' '}
              <span className="text-red-50">*</span>
            </p>

            <div className="flex flex-1 rounded-2xl
            border border-neutral-90 bg-neutral-98 p-5"
            >
              {/* Desktop */}
              <div className="hidden w-full cursor-pointer flex-col gap-4 sm:flex">
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
                          iconRight={<PencilSimple size={16} />}
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
          <div className="flex flex-1 flex-col gap-6">
            <Form.Item className="max-[955px]:px-4">
              <TextInput
                {...register('title')}
                type="text"
                placeholder={t('placeholder_title')}
                label={(
                  <p className="text-sm leading-4 text-neutral-10">
                    {t('title')}
                    <span className="text-red-50">*</span>
                  </p>
                )}
                isError={!!errors.title}
                maxLength={32}
                hintText={errors.title?.message || (errors.title && 'Required')}
              />
            </Form.Item>

            <Form.Item className="max-[955px]:px-4">
              <Combobox
                // @ts-ignore
                by="id"
                value={selectedTopics}
                onChange={value => setSelectedTopics(value as TFilter[])}
                onQueryChange={setTopicQuery}
                onClear={handleRemoveTopic}
                className="w-full"
                multiple
                size="lg"
              >
                {({ open }) => (
                  <>
                    <Combobox.VisualMultiSelect
                      open={open}
                      label={(
                        <p className="text-sm leading-4 text-neutral-10">
                          {t('topics')}
                          <span className="text-red-50">*</span>
                        </p>
                      )}
                      placeholder={selectedTopics.length > 0 ? undefined : 'Select topics'}
                      className="border-neutral-90"
                      inputClassname="px-0 font-normal leading-4"
                      displayValue={({ label }) => label}
                    >
                      <CaretDown />
                    </Combobox.VisualMultiSelect>
                    <Combobox.Transition>
                      <Combobox.Options className="flex flex-wrap gap-2 p-1">
                        {queriedTopicOptions.length === 0 && topicQuery !== '' ? (
                          <div className="relative cursor-default select-none text-neutral-40">
                            Nothing found.
                          </div>
                        ) : (
                          queriedTopicOptions.map((filter: any) => {
                            const color = getChipColor(filter.id);
                            return (
                              <Combobox.Option value={filter} key={filter.id}>
                                {({ selected, active }) => (
                                  <span
                                    className={mergeClassnames(
                                      'inline-flex cursor-pointer select-none items-center rounded-full border px-4 py-2 text-sm font-semibold transition-opacity',
                                      selected && 'opacity-100',
                                      active && 'opacity-90',
                                    )}
                                    style={{
                                      backgroundColor: color.bg,
                                      color: color.text,
                                      borderColor: color.border,
                                    }}
                                  >
                                    {filter.label}
                                  </span>
                                )}
                              </Combobox.Option>
                            );
                          })
                        )}
                      </Combobox.Options>
                    </Combobox.Transition>
                  </>
                )}
              </Combobox>
            </Form.Item>

            <Form.Item className="max-[955px]:px-4">
              <Label className="mb-2">
                {t('abstract')}
                <span className="text-red-50">*</span>
              </Label>
              <TextArea
                {...register('abstract')}
                rows={9}
                error={!!errors.abstract}
                placeholder={t('placeholder_abstract')}
                size="sm"
              />
              {errors.abstract && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.abstract.message || 'Required'}
                </p>
              )}
            </Form.Item>
            {/* Gần dưới cùng */}
            <div className="flex flex-1 flex-col px-4 pb-24 min-[955px]:hidden">
              <p className="mb-2 text-sm font-medium text-black">
                {t('cover_picture')}
                {' '}
                <span className="text-red-50">*</span>
              </p>

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
                    iconRight={<PencilSimple size={16} />}
                    onClick={() => setIsCustomCoverModalOpen(true)}
                  >
                    {t('custom')}
                  </Button>
                </div>
              </div>
            </div>
            <div className="z-40 flex
            w-full
            bg-white
            max-[955px]:fixed max-[955px]:bottom-0 max-[955px]:rounded-t-2xl
            max-[955px]:p-4 max-[955px]:shadow-[0_0_4px_rgba(15,15,16,0.06)]
            min-[955px]:mt-auto
            min-[955px]:justify-end"
            >
              <Button
                type="submit"
                size="lg"
                className="w-full min-[955px]:w-[300px]"
                animation={isSubmitting && 'progress'}
                disabled={isSubmitting}
              >
                {t('submit')}
              </Button>
            </div>
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
