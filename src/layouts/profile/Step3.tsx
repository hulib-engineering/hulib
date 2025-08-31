// deprecated, need to refactor using reusable components
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown, X } from '@phosphor-icons/react';
import router from 'next/router';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button from '@/components/button/Button';
import CustomCoverBook from '@/components/common/CustomCoverBook';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Form from '@/components/form/Form';
import TextArea from '@/components/textArea/TextArea';
import TextInput from '@/components/textInput/TextInput';
import { useAppSelector, useTopics } from '@/libs/hooks';
import { useCreateStoryMutation } from '@/libs/services/modules/stories';
import { StoriesValidation } from '@/validations/StoriesValidation';
import { mergeClassnames } from '@/components/private/utils';

type Topic = {
  id: number;
  name: string;
};

const Step3 = ({ next }: { next: () => void }) => {
  let swiperRef: any = null;

  const t = useTranslations('Common');

  const [createStory] = useCreateStoryMutation();
  const { topics, isLoading } = useTopics();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [coverImages] = useState<any[]>([
    {
      path: '/assets/images/cover-book/story_background_yellow.png',
      id: 1,
    },
    {
      path: '/assets/images/cover-book/story_background_red.png',
      id: 2,
    },
    {
      path: '/assets/images/cover-book/story_background_blue.png',
      id: 3,
    },
  ]);
  const methods = useForm<z.infer<typeof StoriesValidation>>({
    resolver: zodResolver(StoriesValidation),
    defaultValues: {
      title: '',
      abstract: '',
      topicIds: [],
      cover: coverImages[0],
    },
  });
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const selectedTopics = watch('topicIds') || [];
  const title = watch('title') || '';

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(coverImages[0].id);
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectedCoverImage = (coverId: any) => {
    setIsSelected(coverId);
    setValue('cover', coverImages.find(cover => cover.id === coverId) || '');
  };
  const handleSwipeAndSelectCover = (swiper: any) => {
    setCurrentCoverIndex(swiper.activeIndex);
    console.log('Active index', coverImages[swiper.activeIndex + 1]?.id ?? 1);
    handleSelectedCoverImage(coverImages[swiper.activeIndex]?.id ?? 1);
  };
  const handleTopicToggle = (topicId: number) => {
    const currentTopics = selectedTopics || [];
    if (currentTopics.includes(topicId)) {
      setValue(
        'topicIds',
        currentTopics.filter(id => id !== topicId),
      );
    } else {
      setValue('topicIds', [...currentTopics, topicId]);
    }
  };
  const handleTopicRemove = (topicId: number) => {
    setValue(
      'topicIds',
      selectedTopics.filter(id => id !== topicId),
    );
  };
  const onSubmit = async (formValues: z.infer<typeof StoriesValidation>) => {
    try {
      await createStory({
        title: formValues.title,
        abstract: formValues.abstract,
        topicIds: formValues.topicIds,
        humanBook: {
          id: userInfo?.id,
        },
        // cover: formValues.cover,
        cover: undefined,
        publishStatus: 'draft',
      }).unwrap();
      const userKey = `${userInfo.id}_huber_registration_step`;
      localStorage.setItem(userKey, '4');
      pushSuccess('Story created successfully');
      next();
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="rounded-[20px] bg-white/100 p-5">
        <h2 className="text-2xl font-medium tracking-[-0.02em] xl:text-4xl">
          {t('create_first_story')}
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-8 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="flex flex-col gap-6">
                <Form.Item className="flex flex-col gap-2">
                  <fieldset className="w-full">
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <div className="mb-2 block text-sm font-medium text-black">
                          {t('topics')}
                          {' '}
                          <span className="text-red-500">*</span>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <div className="flex flex-wrap gap-2">
                              {selectedTopics?.length > 0
                                ? (
                                    selectedTopics?.map((topicId) => {
                                      const topic = (topics || []).find(
                                        (i: Topic) => i.id === topicId,
                                      );
                                      if (!topic) {
                                        return null;
                                      }
                                      return (
                                        <div
                                          key={topic.id}
                                          className="inline-flex items-center gap-2 rounded-full bg-primary-90 px-4 py-2 text-sm text-primary-40"
                                        >
                                          {topic.name}
                                          <X
                                            size={16}
                                            className="cursor-pointer text-primary-40"
                                            onClick={() =>
                                              handleTopicRemove(topic.id)}
                                          />
                                        </div>
                                      );
                                    })
                                  )
                                : (
                                    <span className="text-sm text-gray-700">
                                      {t('select_topics')}
                                    </span>
                                  )}
                            </div>
                            <CaretDown
                              className={`transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              size={20}
                            />
                          </button>
                          {isOpen && !isLoading && (
                            <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                              <div className="max-h-60 overflow-y-auto p-2">
                                {(topics || []).map(
                                  (topic: Topic) => (
                                    <button
                                      key={topic.id}
                                      type="button"
                                      className={`mb-1 w-full cursor-pointer rounded px-3 py-2 text-left text-sm transition-colors ${
                                        selectedTopics.includes(topic.id)
                                          ? 'bg-primary-90 text-primary-50'
                                          : 'text-gray-700 hover:bg-primary-90'
                                      }`}
                                      onClick={() =>
                                        handleTopicToggle(topic.id)}
                                    >
                                      {topic.name}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {errors?.topicIds && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors?.topicIds?.message}
                        </p>
                      )}
                    </div>
                  </fieldset>
                </Form.Item>
                <Form.Item className="flex flex-col gap-2 lg:flex-row">
                  <fieldset className="w-full">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          type="text"
                          className="text-sm"
                          placeholder={t('placeholder_title')}
                          label={(
                            <p className="text-sm text-neutral-10">
                              {t('title')}
                              {' '}
                              <span className="text-red-500">*</span>
                            </p>
                          )}
                          isError={!!errors.title}
                          maxLength={32}
                          hintText={
                            errors.title?.message
                            || (errors.title && 'Required')
                          }
                        />
                      )}
                    />
                  </fieldset>
                </Form.Item>
                <Form.Item className="flex flex-col gap-2 lg:flex-row">
                  <fieldset className="w-full">
                    <div className="text-sm font-medium text-black">
                      {t('abstract')}
                      {' '}
                      <span className="text-red-500">*</span>
                    </div>
                    <Controller
                      name="abstract"
                      control={control}
                      render={({ field }) => (
                        <>
                          <TextArea
                            {...field}
                            rows={7}
                            error={!!errors.abstract}
                            placeholder={t('placeholder_abstract')}
                            className="text-sm"
                          />
                          {errors.abstract && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.abstract.message || 'Required'}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </fieldset>
                </Form.Item>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-black">
                  {t('cover_picture')}
                  {' '}
                  <span className="text-red-500">*</span>
                  <div className="mt-2 flex justify-between gap-2 rounded-2xl border border-neutral-90 bg-neutral-98 p-5">
                    <div className="hidden cursor-pointer flex-col gap-4 xl:flex">
                      <div className="flex gap-2">
                        {coverImages.map((cover, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            <CustomCoverBook
                              titleStory={title}
                              authorName={userInfo?.fullName}
                              widthImage={180}
                              heightImage={255}
                              srcImage={cover.path}
                              active={isSelected === cover.id}
                            />
                            <Button
                              disabled={isSelected === cover.id}
                              onClick={() => handleSelectedCoverImage(cover.id)}
                              className={`${
                                isSelected === cover.id
                                  ? 'bg-primary-90'
                                  : 'border-neutral-80 bg-white'
                              } text-primary-50 hover:text-white`}
                            >
                              {isSelected === cover.id
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
                        {coverImages.map((cover, index) => (
                          <SwiperSlide key={index}>
                            <div className="flex items-center justify-center">
                              <CustomCoverBook
                                titleStory={title}
                                authorName={userInfo?.fullName}
                                widthImage={180}
                                heightImage={255}
                                srcImage={cover.path}
                                active={isSelected === cover.id}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {/* Custom Pagination */}
                      <div className="mt-3 flex justify-center space-x-2">
                        {coverImages.map((_, idx) => (
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
              onClick={() => router.reload()}
            >
              {t('back')}
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
    </FormProvider>
  );
};

export default Step3;
