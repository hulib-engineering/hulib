'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown, X } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Form from '@/components/form/Form';
import TextArea from '@/components/textArea/TextArea';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import { StoriesValidation } from '@/validations/StoriesValidation';

import TextInput from '../textInput/TextInput';

interface Topic {
  id: string;
  name: string;
}

const Step3 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: topicsPages, isLoading } = useGetTopicsQuery();

  const methods = useForm<z.infer<typeof StoriesValidation>>({
    resolver: zodResolver(StoriesValidation),
    defaultValues: {
      title: '',
      abstract: '',
      topics: [],
    },
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = methods;

  const selectedTopics = watch('topics') || [];

  const handleTopicToggle = (topicId: string) => {
    const currentTopics = selectedTopics || [];
    if (currentTopics.includes(topicId)) {
      setValue(
        'topics',
        currentTopics.filter((id) => id !== topicId),
      );
    } else {
      setValue('topics', [...currentTopics, topicId]);
    }
  };

  const handleTopicRemove = (topicId: string) => {
    setValue(
      'topics',
      selectedTopics.filter((id) => id !== topicId),
    );
  };

  const onSubmit = (data: z.infer<typeof StoriesValidation>) => {
    console.log(data);
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
      <div className="mx-auto w-full px-4 lg:max-w-screen-2xl lg:px-28">
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
                                    const topic = (
                                      topicsPages?.data || []
                                    ).find((t: Topic) => t.id === topicId);
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
                                        className={`cursor-pointer rounded px-3 py-2 text-sm transition-colors ${
                                          selectedTopics.includes(topic.id)
                                            ? 'bg-primary-90 text-primary-50'
                                            : 'text-gray-700 hover:bg-neutral-10'
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
                        {errors.topics && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.topics.message}
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
              <div className="flex-1">cover</div>
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
                disabled={!isValid || isSubmitting}
              >
                Submit
              </button>
            </div>
          </Form>
        </div>
      </div>
    </FormProvider>
  );
};

export default Step3;
