// deprecated, need to refactor using reusable components
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown } from '@phosphor-icons/react';
import { omit } from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { z } from 'zod';

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
import { useUploadMutation } from '@/libs/services/modules/files';
import {
  useCreateStoryMutation,
  useGetRelatedTopicsQuery,
  useUpdateStoryMutation,
} from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { StoriesValidation } from '@/validations/StoriesValidation';
import { CustomCover } from '@/components/stories/CustomCover';

const CoverAssets = [
  '/assets/images/cover-book/story_background_yellow.png',
  '/assets/images/cover-book/story_background_red.png',
  '/assets/images/cover-book/story_background_blue.png',
];

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

  const { data: topics } = useGetTopicsQuery();
  const { data: relatedTopics } = useGetRelatedTopicsQuery(
    Number(props.type === 'edit' && props.story.id),
    { skip: props.type !== 'edit' || props.story.topics?.length > 0 },
  );
  const [uploadCover] = useUploadMutation();
  const [createStory] = useCreateStoryMutation();
  const [editStory] = useUpdateStoryMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const topicOptions = useMemo(
    () =>
      topics?.data?.map((topic: Topic) => ({
        label: topic.name,
        value: topic.id.toString(),
        id: topic.id,
      })) ?? [],
    [topics],
  );
  const storyRelatedTopics = useMemo(() => {
    if (props.type === 'edit') {
      const storyTopics: Topic[] = props.story.topics && props.story.topics?.length > 0
        ? props.story.topics : (relatedTopics ?? []);
      return storyTopics?.map(topic => ({
        label: topic.name,
        value: topic.id.toString(),
        id: topic.id,
      }));
    }
    return [];
  }, [props.type, relatedTopics]);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
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

  const [selectedCoverSample, setSelectedCoverSample] = useState(CoverAssets[0]);
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
  const [topicQuery, setTopicQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<TFilter[]>(storyRelatedTopics);
  const queriedTopicOptions = filter(topicQuery, topicOptions || []);

  useEffect(() => {
    setValue('topics', selectedTopics.map(topic => ({ id: topic.id.toString() })));
  }, [selectedTopics, setValue]);

  const handleSwipeAndSelectCover = (swiper: any) => {
    setCurrentCoverIndex(swiper.activeIndex);
    setSelectedCoverSample(CoverAssets[swiper.activeIndex] ?? '');
  };
  const handleRemoveTopic = useCallback(
    (index: unknown) => {
      setSelectedTopics(selectedTopics.filter(({ id }) => id !== index));
    },
    [selectedTopics],
  );
  const handlePresignS3Url = async () => {
    try {
      const res = await fetch(`${selectedCoverSample}`);
      if (!res.ok) {
        pushError(`Failed to fetch ${selectedCoverSample}`);
      };

      const blob = await res.blob();
      const fileName = `${title}-${new Date().getTime()}.${blob.type.split('/')[1]}`;
      const uploadResult = await uploadCover({
        fileName,
        fileSize: blob.size,
      });
      await fetch(uploadResult.data?.uploadSignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': blob.type },
        body: blob,
      });
      setValue('cover', { id: uploadResult.data?.file.id });
      return uploadResult.data?.file.id;
    } catch (err) {
      console.error('Upload failed', err);
    }
  };
  const onSubmit = async (formValues: z.infer<typeof StoriesValidation>) => {
    try {
      if (props.type !== 'edit') {
        const uploadedCoverId = await handlePresignS3Url();
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
        const hasUploadedNew = dirtyFields.cover;
        let uploadedCoverId = '';
        if (hasUploadedNew) {
          uploadedCoverId = await handlePresignS3Url();
          if (!uploadedCoverId || uploadedCoverId === '') {
            return;
          }
        }
        if (hasUploadedNew && props.story.cover?.id !== uploadedCoverId) {
          await editStory({
            ...formValues,
            id: props.story.id,
            cover: { id: uploadedCoverId },
            publishStatus: 'draft',
          }).unwrap();
        } else {
          await editStory({
            ...omit(formValues, 'cover'),
            id: props.story.id,
            publishStatus: 'draft',
          }).unwrap();
        }
        pushSuccess('Story edited successfully');
        props.onSucceed();
      }
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5">
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
                            {' '}
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
                      {' '}
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
                <Label>
                  {t('abstract')}
                  {' '}
                  <span className="text-red-50">*</span>
                </Label>
                <TextArea
                  {...register('abstract')}
                  rows={7}
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
                      {CoverAssets.map((cover, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <CustomCover
                            titleStory={title}
                            authorName={userInfo?.fullName}
                            srcImage={cover}
                            active={selectedCoverSample === cover}
                          />
                          <Button
                            disabled={selectedCoverSample === cover}
                            onClick={() => setSelectedCoverSample(cover)}
                            className={`${
                              selectedCoverSample === cover
                                ? 'bg-primary-90'
                                : 'border-neutral-80 bg-white'
                            } text-primary-50 hover:text-white`}
                          >
                            {selectedCoverSample === cover
                              ? t('custom')
                              : `${t('style')} ${index + 1}`}
                          </Button>
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
                      {CoverAssets.map((cover, index) => (
                        <SwiperSlide key={index}>
                          <div className="flex items-center justify-center">
                            <CustomCover
                              titleStory={title}
                              authorName={userInfo?.fullName}
                              srcImage={cover}
                              active={selectedCoverSample === cover}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    {/* Custom Pagination */}
                    <div className="mt-3 flex justify-center space-x-2">
                      {CoverAssets.map((_, idx) => (
                        <button
                          key={idx}
                          className={mergeClassnames(
                            'size-2 rounded-full transition-all duration-300',
                            currentCoverIndex === idx ? 'w-10 bg-neutral-80' : 'bg-neutral-90',
                          )}
                          onClick={() => swiperRef?.slideTo(idx)}
                        />
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-[180px]"
                      disabled
                      onClick={() => {}}
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
    </div>
  );
};
