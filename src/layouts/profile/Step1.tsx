// Deprecated, need to refactor using reusable components
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { isEmpty } from 'lodash';
import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import TermAndCondition from '@/layouts/profile/TermAndCondition';
import { useAppSelector, useTopics } from '@/libs/hooks';
import { useRegisterHuberMutation } from '@/libs/services/modules/auth';
import {
  usePostTopicsMutation,
} from '@/libs/services/modules/topics';
import { HuberStep1Validation } from '@/validations/HuberValidation';

type Topic = {
  id: number;
  name: string;
};

type FormData = z.infer<ReturnType<typeof HuberStep1Validation>>;

const Step1 = ({ next }: { next: () => void }) => {
  const router = useRouter();

  const t = useTranslations('HumanBookRegister');
  const tCommon = useTranslations('Common');

  const [registerHuber, { isLoading }] = useRegisterHuberMutation();
  const [createTopic, { isLoading: isCreatingTopic }] = usePostTopicsMutation();
  const { topics, isLoading: isTopicsLoading } = useTopics();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(HuberStep1Validation(t)),
    mode: 'onChange',
    defaultValues: {
      bio: '',
      videoUrl: '',
      topics: [],
      isConfirmed: false,
    },
  });
  const selectedTopics = watch('topics') || [];
  const isFormDisabled = isLoading || isSubmitting;

  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState('');
  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const topicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0] as keyof FormData;
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicDropdownRef.current
        && !topicDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTopicDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTopicToggle = (topicId: number) => {
    const currentTopics: { id: number }[] = selectedTopics || [];
    const topicIds = currentTopics.map((topic: any) => topic.id);

    if (topicIds.includes(topicId)) {
      setValue(
        'topics',
        currentTopics.filter(topic => topic.id !== topicId),
      );
    } else {
      setValue('topics', [...currentTopics, { id: topicId }]);
    }

    setTopicSearchQuery('');
    setTimeout(() => {
      if (topicInputRef.current) {
        topicInputRef.current.focus();
      }
    }, 0);
  };
  const handleTopicRemove = (topicId: number) => {
    setValue(
      'topics',
      selectedTopics.filter((topic: any) => topic.id !== topicId),
    );
  };
  const handleCreateNewTopic = async () => {
    const trimmedQuery = topicSearchQuery.trim();
    if (!trimmedQuery || trimmedQuery.length > 30) {
      return;
    }

    try {
      const newTopic = await createTopic({ name: trimmedQuery }).unwrap();
      setValue('topics', [...selectedTopics, { id: newTopic.id }]);
      setTopicSearchQuery('');
      setIsTopicDropdownOpen(false);
      setTimeout(() => topicInputRef.current?.focus(), 0);
      pushSuccess('Topic created successfully!');
    } catch (error: any) {
      pushError(tCommon(error?.message || 'error_contact_admin'));
    }
  };
  const filteredTopics = (topics || []).filter((topic: Topic) => {
    const isAlreadySelected = selectedTopics.some(
      (selectedTopic: any) => selectedTopic.id === topic.id,
    );
    const matchesSearch = topic.name
      .toLowerCase()
      .includes(topicSearchQuery.toLowerCase());
    return !isAlreadySelected && matchesSearch;
  });
  const hasExactMatch = filteredTopics.some(
    (topic: Topic) =>
      topic.name.toLowerCase() === topicSearchQuery.toLowerCase(),
  );
  const showAddNewOption
    = topicSearchQuery.trim()
      && !hasExactMatch
      && topicSearchQuery.trim().length <= 30;
  const handleTopicInputFocus = () => {
    setIsTopicDropdownOpen(true);
  };
  const handleTopicInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopicSearchQuery(e.target.value);
    setIsTopicDropdownOpen(true);
  };
  const onSubmit = async (formData: FormData) => {
    try {
      await registerHuber(formData).unwrap();
      const userKey = `${userInfo.id}_huber_registration_step`;
      localStorage.setItem(userKey, '2');
      pushSuccess('Registration successful!');
      next();
    } catch (error: any) {
      pushError(tCommon(error?.message || 'error_contact_admin'));
    }
  };
  const getInputClassName = (fieldName: keyof FormData) => {
    const baseClass
      = 'rounded-lg border border-solid p-3 text-sm leading-4 text-neutral-40 outline-none';
    const errorClass = errors[fieldName]
      ? 'border-red-500'
      : 'border-neutral-90';
    const disabledClass = isLoading ? 'opacity-50 cursor-not-allowed' : '';
    return `${baseClass} ${errorClass} ${disabledClass}`;
  };

  return (
    <form
      id="step-1"
      className="flex flex-col items-center justify-center rounded-3xl bg-white p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="self-start text-xl font-medium leading-[2.75rem] text-neutral-10 xl:text-4xl">
        {t('step_1_title')}
      </h2>

      <label className="mt-6 flex w-full flex-col gap-2" htmlFor="bio">
        <span className="text-sm leading-4 text-neutral-10">
          {t('bio.text')}
          {' '}
          <span className="text-red-50">*</span>
        </span>
        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <textarea
                id="bio"
                placeholder={t('bio.placeholder')}
                className={`h-[8.5rem] resize-none bg-neutral-98 ${getInputClassName(
                  'bio',
                )}`}
                disabled={isFormDisabled}
                {...field}
              />
              {error && (
                <span className="text-sm text-red-500">{error.message}</span>
              )}
            </>
          )}
        />
      </label>

      <label className="mt-6 flex w-full flex-col gap-2" htmlFor="videoUrl">
        <span className="text-sm leading-4 text-neutral-10">
          {t('intro_video.text')}
        </span>
        <Controller
          name="videoUrl"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                id="videoUrl"
                placeholder={t('intro_video.placeholder')}
                className={`h-10 bg-neutral-98 ${getInputClassName(
                  'videoUrl',
                )}`}
                disabled={isFormDisabled}
                {...field}
              />
              {error && (
                <span className="text-sm text-red-500">
                  {error.type === 'url'
                    ? t('validation.invalid_url')
                    : error.message}
                </span>
              )}
            </>
          )}
        />
      </label>

      <div className="mt-6 flex w-full flex-col gap-2">
        <span className="text-sm leading-4 text-neutral-10">
          {t('select_topics')}
        </span>
        <div className="relative" ref={topicDropdownRef}>
          <div className="flex min-h-[40px] w-full flex-wrap items-center gap-2 rounded-lg border bg-neutral-98 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            {selectedTopics?.map((selectedTopic: any) => {
              const topic = (topics || []).find(
                (i: Topic) => i.id === selectedTopic.id,
              );
              if (!topic) {
                return null;
              }
              return (
                <div
                  key={topic.id}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-90 px-3 py-1 text-sm text-primary-40"
                >
                  {topic.name}
                  <X
                    size={14}
                    className="cursor-pointer text-primary-40 hover:text-primary-30"
                    onClick={() => handleTopicRemove(topic.id)}
                  />
                </div>
              );
            })}

            <input
              ref={topicInputRef}
              type="text"
              value={topicSearchQuery}
              onChange={handleTopicInputChange}
              onFocus={handleTopicInputFocus}
              placeholder={
                selectedTopics?.length > 0
                  ? t('add_more_topics')
                  : t('placeholder_topics')
              }
              className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
              disabled={isFormDisabled}
              maxLength={30}
            />
          </div>

          {isTopicDropdownOpen && !isTopicsLoading && (
            <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
              <div className="p-2">
                {showAddNewOption && (
                  <div
                    className={`flex items-center gap-2 px-3 py-1 ${
                      filteredTopics.length > 0 ? 'border-b pb-2' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                      onClick={handleCreateNewTopic}
                      disabled={isCreatingTopic}
                    >
                      {isCreatingTopic ? t('creating') : t('add_new')}
                    </button>
                    <span className="text-sm text-blue-700">
                      {topicSearchQuery}
                    </span>
                  </div>
                )}

                {filteredTopics.map((topic: Topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="mb-1 w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-primary-90 hover:text-primary-50"
                    onClick={() => handleTopicToggle(topic.id)}
                  >
                    {topic.name}
                  </button>
                ))}

                {filteredTopics.length === 0 && !showAddNewOption && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {t('all_topics_selected')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {errors?.topics && (
          <span className="text-sm text-red-500">
            {errors?.topics?.message}
          </span>
        )}
      </div>

      <div className="mt-6 flex w-full flex-col gap-2 rounded-lg bg-neutral-98 p-5">
        <span className="text-sm leading-4 text-neutral-10">
          {`${t('read_community')} `}
          <span className="text-red-50">*</span>
        </span>
        <div className="rounded-xl bg-neutral-90 p-4">
          <span className="text-sm uppercase leading-5 text-primary-40">
            {t('general')}
          </span>
          <TermAndCondition />
        </div>
        <Controller
          name="isConfirmed"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="mt-3 flex flex-row items-start gap-2">
                <input
                  id="isConfirmed"
                  type="checkbox"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  className="mt-0.5 size-4 cursor-pointer border border-solid border-neutral-40"
                  disabled={isFormDisabled}
                />
                <span className="text-sm leading-5 text-neutral-10">
                  {t('confirm')}
                </span>
              </div>
              {error && (
                <span className="text-sm text-red-500">{error.message}</span>
              )}
            </>
          )}
        />
      </div>

      <div className="mt-6 flex w-full items-center gap-3">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push('/home')}
          disabled={isFormDisabled}
        >
          {t('cancel')}
        </Button>
        <Button
          className="w-full"
          type="submit"
          animation={isFormDisabled && 'progress'}
          disabled={!isEmpty(errors) || isFormDisabled}
        >
          {t('next')}
        </Button>
      </div>
    </form>
  );
};

export default Step1;
