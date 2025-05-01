'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Form from '@/components/form/Form';
import TextArea from '@/components/textArea/TextArea';
import TextInput from '@/components/textInput/TextInput';
import { useAppSelector } from '@/libs/hooks';
import { useCreateStoryMutation } from '@/libs/services/modules/stories';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import { StoriesValidation } from '@/validations/StoriesValidation';

import CustomCoverBook from '../common/CustomCoverBook';
import { pushError, pushSuccess } from '../CustomToastifyContainer';

interface Topic {
  id: number;
  name: string;
}

const Step3 = ({ next }: { next: () => void }) => {
  const t = useTranslations('Common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const { data: topicsPages, isLoading } = useGetTopicsQuery();
  const [createStory] = useCreateStoryMutation();
  const [coverImages] = useState<any[]>([
    {
      path: 'https://hulib-services.onrender.com/api/v1/files/3a453887a11688d76b8ef.png',
      id: 'dadcbf14-0596-4a5a-8681-f6234cea30b6',
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

  const handleTopicToggle = (topicId: number) => {
    const currentTopics = selectedTopics || [];
    if (currentTopics.includes(topicId)) {
      setValue(
        'topicIds',
        currentTopics.filter((id) => id !== topicId),
      );
    } else {
      setValue('topicIds', [...currentTopics, topicId]);
    }
  };

  const handleTopicRemove = (topicId: number) => {
    setValue(
      'topicIds',
      selectedTopics.filter((id) => id !== topicId),
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
        cover: formValues.cover,
        publishStatus: 'draft',
      }).unwrap();
      localStorage.setItem('huber_registration_step', '4');
      pushSuccess('Story created successfully');
      next();
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
          Create First Story
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
                          Topics <span className="text-red-500">*</span>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <div className="flex flex-wrap gap-2">
                              {selectedTopics?.length > 0 ? (
                                selectedTopics?.map((topicId) => {
                                  const topic = (topicsPages?.data || []).find(
                                    (i: Topic) => i.id === topicId,
                                  );
                                  if (!topic) return null;
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
                                          handleTopicRemove(topic.id)
                                        }
                                      />
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-sm text-gray-700">
                                  Select Topics
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
                              <div className="p-2">
                                {(topicsPages?.data || []).map(
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
                                        handleTopicToggle(topic.id)
                                      }
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
                          placeholder="Please enter your story's name"
                          label={
                            <p className="text-sm text-neutral-10">
                              Title <span className="text-red-500">*</span>
                            </p>
                          }
                          isError={!!errors.title}
                          maxLength={32}
                          hintText={
                            errors.title?.message ||
                            (errors.title && 'Required')
                          }
                        />
                      )}
                    />
                  </fieldset>
                </Form.Item>
                <Form.Item className="flex flex-col gap-2 lg:flex-row">
                  <fieldset className="w-full">
                    <div className="text-sm font-medium text-black">
                      Abstract <span className="text-red-500">*</span>
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
                            placeholder="Please enter your story"
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
                  Cover picture <span className="text-red-500">*</span>
                  <div className="mt-2 flex justify-between gap-2 rounded-2xl bg-neutral-90 p-5">
                    <div className="flex cursor-pointer flex-col gap-4">
                      <CustomCoverBook
                        titleStory={title}
                        authorName={userInfo?.fullName}
                        widthImage={180}
                        heightImage={255}
                        srcImage={coverImages[0].path}
                      />

                      {/* <Button
                  onClick={() => handleSelectedCoverImage(indexCoverImage)}
                  className={`${
                    isSelected ? 'bg-primary-90' : 'border-neutral-80 bg-white'
                  } text-primary-50 hover:text-white`}
                >
                  {isSelected ? 'Custom' : `Style ${indexCoverImage + 1}`}
                </Button> */}
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
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary-50 px-6 py-2 text-center text-white transition-colors hover:bg-blue-700"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </FormProvider>
  );
};

export default Step3;
