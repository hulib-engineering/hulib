'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDown, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import CustomCoverBook from '@/components/common/CustomCoverBook';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Form from '@/components/form/Form';
import Modal from '@/components/Modal';
import TextArea from '@/components/textArea/TextArea';
import TextInput from '@/components/textInput/TextInput';
import { useAppSelector } from '@/libs/hooks';
import {
  useCreateStoryMutation,
  useUpdateStoryMutation,
} from '@/libs/services/modules/stories';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import { StoriesValidation } from '@/validations/StoriesValidation';

interface Topic {
  id: number;
  name: string;
}

interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
  editingStory?: any;
}

const CreateStoryModal = ({
  open,
  onClose,
  editingStory,
}: CreateStoryModalProps) => {
  const t = useTranslations('Common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const { data: topicsPages, isLoading } = useGetTopicsQuery();
  const [createStory] = useCreateStoryMutation();
  const [updateStory] = useUpdateStoryMutation();
  const [coverImages] = useState<any[]>([
    {
      path: '/assets/images/cover-book/story_background_yellow.png',
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
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  // Reset form when editingStory changes
  useEffect(() => {
    if (editingStory) {
      reset({
        title: editingStory.title,
        abstract: editingStory.abstract,
        topicIds: editingStory.topicIds || [],
        cover: editingStory.cover || coverImages[0],
      });
    } else {
      reset({
        title: '',
        abstract: '',
        topicIds: [],
        cover: coverImages[0],
      });
    }
  }, [editingStory, reset, coverImages]);

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
      if (editingStory) {
        await updateStory({
          id: editingStory.id,
          ...formValues,
          humanBook: {
            id: userInfo?.id,
          },
        }).unwrap();
        pushSuccess('Story updated successfully');
      } else {
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
        pushSuccess('Story created successfully');
      }
      onClose();
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
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-[90vw] max-w-[1200px]">
        <div className="rounded-lg bg-white/100 p-5">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[36px] leading-[44px] tracking-[-0.02em]">
              {editingStory ? 'Edit Story' : 'Create New Story'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-neutral-80"
            >
              <X size={24} />
            </button>
          </div>
          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-8 flex flex-col gap-4 lg:flex-row">
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
                                      ).find((i: Topic) => i.id === topicId);
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="min-w-[120px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {editingStory ? 'Save Changes' : 'Create'}
                </Button>
              </div>
            </Form>
          </FormProvider>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default CreateStoryModal;
