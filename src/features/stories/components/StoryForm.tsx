'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { z } from 'zod';

import { CustomCoverModal } from './CustomCoverModal';
import Button from '@/components/core/button/Button';
import Combobox from '@/components/core/combobox/Combobox';
import Form from '@/components/core/form/Form';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import TextArea from '@/components/core/textArea/TextArea';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Label from '@/components/Label';
import type { TFilter } from '@/layouts/scheduling/BigCalendar';
import { useAppSelector } from '@/libs/hooks';
import { selectUserId, selectUserInfo } from '@/libs/store/authentication';
import { useUploadMutation } from '@/libs/services/modules/files';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
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

const filter = (
  query: string,
  filters: { id: number; label: string; value: string }[],
) => {
  return query === ''
    ? filters
    : filters.filter(({ label }) =>
        label
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, '')),
      );
};

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

  const t = useTranslations('Common');
  const tProfile = useTranslations('MyProfile');

  const formTitle = props.type === 'create-first'
    ? t('create_first_story')
    : props.type === 'create' ? tProfile('create_story') : tProfile('edit_story');

  const userId = useAppSelector(selectUserId);
  const userInfo = useAppSelector(selectUserInfo);

  const { data: me } = useGetPersonalInfoQuery(undefined, {
    skip: !userId,
  });
  const { data: relatedTopics } = useGetRelatedTopicsQuery(
    Number(props.type === 'edit' && props.story.id),
    { skip: props.type !== 'edit' || props.story.topics?.length > 0 },
  );
  const [uploadCover] = useUploadMutation();
  const [createStory] = useCreateStoryMutation();
  const [editStory] = useUpdateStoryMutation();

  const topicOptions = useMemo(
    () =>
      (me?.sharingTopics ?? []).map((topic: Topic) => ({
        label: topic.name,
        value: topic.id.toString(),
        id: topic.id,
      })),
    [me],
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
  const [topicQuery, setTopicQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<TFilter[]>(storyRelatedTopics);
  const queriedTopicOptions = filter(topicQuery, topicOptions || []);

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

  const resolveCoverIdForSubmit = async (): Promise<string | undefined> =>
    rasterizeAndUploadCover();

  const onSubmit = async (formValues: z.infer<typeof StoriesValidation>) => {
    try {
      if (props.type !== 'edit') {
        const uploadedCoverId = await resolveCoverIdForSubmit();
        if (!uploadedCoverId || uploadedCoverId === '') {
          return;
        }

        await createStory({
          ...formValues,
          humanBook: {
            id: userInfo?.id,
          },
          cover: { id: uploadedCoverId },
          publishStatus: 'draft',
        }).unwrap();
        pushSuccess('Story created successfully');
        props.onSucceed();
      } else {
        const uploadedCoverId = await resolveCoverIdForSubmit();
        if (!uploadedCoverId || uploadedCoverId === '') {
          return;
        }
        await editStory({
          ...formValues,
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

  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-white p-5">
      <h2 className="text-2xl font-medium tracking-[-0.02em] lg:text-4xl lg:leading-[44px]">
        {formTitle}
      </h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <div className="flex-1">
            <div className="flex flex-col gap-6">
              <Form.Item>
                <Combobox
                  // @ts-ignore
                  by="id" // TO-DO: modify combobox wrapper props
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
                        placeholder="Select topics"
                        className="border-neutral-90"
                        inputClassname="px-0 font-normal leading-4"
                        displayValue={({ label }) => label}
                      >
                        <CaretDown />
                      </Combobox.VisualMultiSelect>
                      <Combobox.Transition>
                        <Combobox.Options className="flex flex-col gap-2">
                          {queriedTopicOptions.length === 0 && topicQuery !== '' ? (
                            <div className="relative cursor-default select-none text-neutral-40">
                              Nothing found.
                            </div>
                          ) : (
                            queriedTopicOptions.map(filter => (
                              <Combobox.Option value={filter} key={filter.id}>
                                {({ selected, active }) => (
                                  <MenuItem isActive={active} isSelected={selected} className="gap-0.5">
                                    {filter.label}
                                  </MenuItem>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Combobox.Transition>
                    </>
                  )}
                </Combobox>
              </Form.Item>
              <Form.Item>
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
                  hintText={
                    errors.title?.message
                    || (errors.title && 'Required')
                  }
                />
              </Form.Item>
              <Form.Item>
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
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-black">
                {t('cover_picture')}
                {' '}
                <span className="text-red-50">*</span>
                <div className="mt-2 flex justify-between gap-2 rounded-2xl border border-neutral-90 bg-neutral-98 p-5">
                  <div className="hidden cursor-pointer flex-col gap-4 xl:flex">
                    <div className="flex gap-2">
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
                            >
                              {t('custom')}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleSelectPreset(cover)}
                              className="border-neutral-80 bg-white text-primary-50 hover:text-white"
                            >
                              {`${t('style')} ${index + 1}`}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 xl:hidden">
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
                    {/* Custom Pagination */}
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
                      onClick={() => setIsCustomCoverModalOpen(true)}
                    >
                      {t('custom')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-4 text-left lg:w-1/2">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={props.type === 'create-first' ? props.onBack : props.onCancel}
          >
            {props.type === 'create-first' ? t('back') : t('cancel')}
          </Button>
          <Button
            type="submit"
            size="lg"
            fullWidth
            animation={isSubmitting && 'progress'}
            disabled={isSubmitting}
          >
            {t('submit')}
          </Button>
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
};
