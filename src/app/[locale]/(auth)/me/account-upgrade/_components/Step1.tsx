// Deprecated, need to refactor using reusable components
'use client';

import { CaretDown } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import Button from '@/components/core/button/Button';
import Combobox from '@/components/core/combobox/Combobox';
import Form from '@/components/core/form/Form';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import TermAndCondition from '@/layouts/profile/TermAndCondition';
import type { TFilter } from '@/layouts/scheduling/BigCalendar';
import { useAppSelector } from '@/libs/hooks';
import { useRegisterHuberMutation } from '@/libs/services/modules/auth';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import type { AccountUpgradeValidationType } from '@/validations/AccountUpgradeValidation';

type Topic = {
  id: number;
  name: string;
};

const Step1 = ({ next }: { next: () => void }) => {
  const router = useRouter();

  const t = useTranslations('HumanBookRegister');
  const tCommon = useTranslations('Common');

  const [registerHuber, { isLoading }] = useRegisterHuberMutation();
  const { data: topicsResponse, isLoading: isTopicsLoading } = useGetTopicsQuery();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext<AccountUpgradeValidationType>();

  const watchedTopics = useWatch({ control, name: 'topics' });

  const [topicQuery, setTopicQuery] = useState('');

  useEffect(() => {
    clearErrors('timeSlots');
  }, [clearErrors]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(
        errors,
      )[0] as keyof AccountUpgradeValidationType;
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  const topicOptions = useMemo(
    () =>
      (topicsResponse?.data ?? []).map((topic: Topic) => ({
        id: topic.id,
        label: topic.name,
        value: topic.id.toString(),
      })),
    [topicsResponse],
  );
  const queriedTopicOptions = useMemo(
    () =>
      topicOptions.filter(
        (t: TFilter) => !(watchedTopics || []).some((wt: any) => wt.id === t.id),
      ),
    [topicOptions, watchedTopics],
  );
  const filteredTopicOptions = useMemo(() => {
    if (!topicQuery) {
      return queriedTopicOptions;
    }
    const query = topicQuery.toLowerCase().replace(/\s+/g, '');
    return queriedTopicOptions.filter((t: TFilter) =>
      t.label.toLowerCase().replace(/\s+/g, '').includes(query),
    );
  }, [queriedTopicOptions, topicQuery]);
  const isFormDisabled = isLoading || isSubmitting;

  const onSubmit = async (formData: AccountUpgradeValidationType) => {
    const { timeSlots: _timeSlots, ...huberPayload } = formData;
    try {
      await registerHuber(huberPayload).unwrap();
      const userKey = `${userInfo.id}_huber_registration_step`;
      localStorage.setItem(userKey, '2');
      pushSuccess(tCommon('account_upgrade.registration_successful'));
      next();
    } catch (error: any) {
      pushError(error?.message || tCommon('error_contact_admin'));
    }
  };
  const getInputClassName = (
    fieldName: keyof Pick<AccountUpgradeValidationType, 'bio' | 'videoUrl'>,
  ) => {
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

      <Form.Field
        control={control}
        name="topics"
        render={({ field, fieldState: { error } }) => {
          const selectedTopics = (field.value || [])
            .map((selectedTopic) => {
              const topic = (topicsResponse?.data ?? []).find(
                (tp: Topic) => tp.id === selectedTopic.id,
              );
              return topic
                ? {
                    id: topic.id,
                    label: topic.name,
                    value: topic.id.toString(),
                  }
                : null;
            })
            .filter((t): t is TFilter => t !== null);

          return (
            <Form.Item className="mt-6 flex w-full flex-col gap-2">
              <Combobox
                value={selectedTopics}
                onChange={(value) => {
                  field.onChange(
                    (value as TFilter[]).map(v => ({ id: v.id })),
                  );
                }}
                onQueryChange={setTopicQuery}
                onClear={(index) => {
                  const current = (field.value || []) as { id: number }[];
                  field.onChange(current.filter(t => t.id !== index));
                }}
                isError={!!error}
                disabled={isFormDisabled || isTopicsLoading}
                multiple
                size="lg"
                className="w-full"
              >
                {({ open }) => (
                  <>
                    <Combobox.VisualMultiSelect
                      open={open}
                      label={(
                        <p className="text-sm leading-4 text-neutral-10">
                          {t('select_topics')}
                          <span className="text-red-50">*</span>
                        </p>
                      )}
                      placeholder={
                        selectedTopics?.length > 0
                          ? t('add_more_topics')
                          : t('placeholder_topics')
                      }
                      className="border-neutral-90"
                      inputClassname="px-0 font-normal leading-4"
                      displayValue={({ label }) => label}
                    >
                      <CaretDown />
                    </Combobox.VisualMultiSelect>
                    <Combobox.Transition>
                      <Combobox.Options className="flex flex-col gap-2">
                        {filteredTopicOptions.length === 0
                        && topicQuery !== '' ? (
                              <div className="relative cursor-default select-none text-neutral-40">
                                {t('all_topics_selected')}
                              </div>
                            ) : (
                              filteredTopicOptions.map((option: TFilter) => (
                                <Combobox.Option value={option} key={option.id}>
                                  {({ selected, active }) => (
                                    <MenuItem
                                      isActive={active}
                                      isSelected={selected}
                                      className="gap-0.5"
                                    >
                                      {option.label}
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
              <Form.Message />
            </Form.Item>
          );
        }}
      />

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

      <div className="mt-6 flex w-full flex-col gap-2 rounded-lg bg-neutral-98 p-5">
        <span className="text-sm leading-4 text-neutral-10">
          {`${t('read_community')} `}
          <span className="text-red-50">*</span>
        </span>
        <div className="h-40 rounded-xl bg-neutral-90 p-4">
          <div className="account-upgrade-guidelines-scrollbar max-h-full overflow-auto pr-3">
            <span className="text-sm uppercase leading-5 text-primary-40">
              {t('general')}
            </span>
            <TermAndCondition />
          </div>
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
          onClick={() => router.push('/')}
          disabled={isFormDisabled}
        >
          {t('cancel')}
        </Button>
        <Button
          className="w-full"
          type="submit"
          animation={isFormDisabled && 'progress'}
          disabled={!isValid || isFormDisabled}
        >
          {t('next')}
        </Button>
      </div>
    </form>
  );
};

export default Step1;
