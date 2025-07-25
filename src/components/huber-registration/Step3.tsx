'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown, X } from '@phosphor-icons/react';
import router from 'next/router';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '../button/Button';
import CustomCoverBook from '../common/CustomCoverBook';
import { pushError, pushSuccess } from '../CustomToastifyContainer';
import Form from '@/components/form/Form';
import TextArea from '@/components/textArea/TextArea';
import TextInput from '@/components/textInput/TextInput';
import { useAppSelector, useTopics } from '@/libs/hooks';
import { useCreateStoryMutation } from '@/libs/services/modules/stories';
import { StoriesValidation } from '@/validations/StoriesValidation';

type Topic = {
  id: number;
  name: string;
};

const Step3 = ({ next }: { next: () => void }) => {
  const t = useTranslations('Common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { topics, isLoading } = useTopics();
  const [createStory] = useCreateStoryMutation();
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
  const [isSelected, setIsSelected] = useState(coverImages[0].id);

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

  const handleSelectedCoverImage = (coverId: any) => {
    setIsSelected(coverId);
    setValue('cover', coverImages.find(cover => cover.id === coverId) || '');
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

  return (
    <FormProvider {...methods}>
      <div className="rounded-lg bg-white/100 p-5">
        <p className="text-[36px] leading-[44px] tracking-[-0.02em]">
          {t('create_first_story')}
        </p>
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
                  <div className="mt-2 flex justify-between gap-2 rounded-2xl bg-neutral-90 p-5">
                    <div className="flex cursor-pointer flex-col gap-4">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between gap-4 text-left lg:w-1/2">
            <button
              type="button"
              className="flex-1 rounded-full border border-neutral-80 bg-white px-6 py-2 text-center text-primary-50 transition-colors"
              onClick={() => {
                const userKey = `${userInfo.id}_huber_registration_step`;
                localStorage.setItem(userKey, '2');
                router.reload();
              }}
            >
              {t('back')}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary-50 px-6 py-2 text-center text-white transition-colors hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {t('submit')}
            </button>
          </div>
        </Form>
      </div>
    </FormProvider>
  );
};

export default Step3;
