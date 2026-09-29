import { CaretDownIcon, InfoIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import React, { useCallback, useMemo, useState } from 'react';
import type { z } from 'zod';

import Combobox, { getChipColor } from '@/components/core/combobox/Combobox';
import TextArea from '@/components/core/textArea/TextArea';
import TextInput from '@/components/core/textInput-v1/TextInput';
import Label from '@/components/Label';
import Form from '@/components/core/form/Form';
import Tooltip from '@/components/core/tooltip/Tooltip';
import Button from '@/components/core/button/Button';

import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import { PRIORITY_TOPIC_KEYWORD } from '@/features/stories/constants';
import type { StoriesValidation } from '@/validations/StoriesValidation';
import { mergeClassnames } from '@/components/core/private/utils';

import type { TFilter } from '@/layouts/scheduling/BigCalendar'; // Note: What? how come this type is in this sort of place?
import type { Topic } from '@/libs/services/modules/topics/topicType';

type CommonFieldProps = {
  register: UseFormRegister<z.infer<typeof StoriesValidation>>;
  errors: FieldErrors<z.infer<typeof StoriesValidation>>;
};
// Note: the above Props type is being used for both TitleField and StoryContentField
// if something added that make the passed-in props for both no longer identical => separate the props type into 2 separate ones

export function TitleField({ register, errors }: CommonFieldProps) {
  const t = useTranslations('Common');

  return (
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
  );
}

export function StoryContentField({ register, errors }: CommonFieldProps) {
  const t = useTranslations('Common');

  return (
    <Form.Item className="max-[955px]:px-4">
      <Label className="mb-2">
        {t('content')}
        <span className="text-red-50">*</span>
      </Label>
      <TextArea
        {...register('abstract')}
        rows={9}
        error={!!errors.abstract}
        placeholder={t('placeholder_content')}
        size="sm"
      />
      {errors.abstract && (
        <p className="mt-1 text-xs text-red-500">
          {errors.abstract.message || 'Required'}
        </p>
      )}
    </Form.Item>
  );
}

type TopicsFieldProps = {
  selectedTopics: TFilter[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<TFilter[]>>;
};

export function TopicsField(props: TopicsFieldProps) {
  const t = useTranslations('Common');
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

  const handleRemoveTopic = useCallback(
    (index: unknown) => {
      props.setSelectedTopics(props.selectedTopics.filter(({ id }) => id !== index));
    },
    [props.selectedTopics],
  );

  const sortTopicsByPriority = (topics: { label: string; value: string; id: number }[]) => {
    return [...topics].sort((a, b) => {
      const aIsPriority = a.label.toLowerCase().startsWith(PRIORITY_TOPIC_KEYWORD);
      const bIsPriority = b.label.toLowerCase().startsWith(PRIORITY_TOPIC_KEYWORD);
      if (aIsPriority && !bIsPriority) {
        return -1;
      }
      if (!aIsPriority && bIsPriority) {
        return 1;
      }
      return 0;
    });
  };
  const queriedTopicOptions = sortTopicsByPriority(topicOptions);

  return (
    <Form.Item className="max-[955px]:px-4">
      <Combobox
        // @ts-ignore
        by="id"
        value={props.selectedTopics}
        onChange={value => props.setSelectedTopics(value as TFilter[])}
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
              placeholder={props.selectedTopics.length > 0 ? undefined : t('select_topics')}
              className="border-neutral-90"
              inputClassname="px-0 font-normal leading-4"
              displayValue={({ label }) => label}
            >
              <CaretDownIcon />
            </Combobox.VisualMultiSelect>
            <Combobox.Transition>
              <Combobox.Options className="z-50 flex flex-wrap gap-2 p-1">
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
  );
}

type SubmitAndDraftButtonProps = {
  isSubmitting: boolean;
  isFormValid: boolean;
  type: 'create' | 'create-first' | 'edit';
  saveDraft: () => void;
};

function DraftTooltip() {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <InfoIcon className="relative max-[955px]:hidden" size={24} />
      </Tooltip.Trigger>
      <Tooltip.Content
        position="top-center"
        className="z-[99] max-w-[300px] rounded-lg bg-neutral-10 p-2"
      >
        <div className="flex flex-col gap-1 text-neutral-98">
          Nếu chưa thể hoàn thành câu chuyện ngay, bạn có thể lưu bản nháp và quay lại hoàn thành sau
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
}

export function SubmitAndDraftButton({ isSubmitting, isFormValid, type, saveDraft }: SubmitAndDraftButtonProps) {
  const t = useTranslations('Common');

  return (

    <div className="z-40 flex w-full flex-row gap-2 bg-white
        max-[955px]:fixed max-[955px]:bottom-0 max-[955px]:rounded-t-2xl
        max-[955px]:p-4 max-[955px]:shadow-[0_0_4px_rgba(15,15,16,0.06)]
        min-[955px]:justify-between"
    >
      {/* Draft saving */}
      <div className="flex flex-row items-center gap-2">
        <Button variant="outline" className="px-6" onClick={saveDraft}>Lưu bản nháp</Button>
        <DraftTooltip />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full min-[955px]:w-[300px]"
        animation={isSubmitting && 'progress'}
        disabled={isSubmitting || !isFormValid}
      >
        {type === 'edit' ? t('confirm') : (
          <>
            <span className="min-[955px]:hidden">
              {t('submit_create_book_mobile')}
            </span>
            <span className="hidden min-[955px]:inline">
              {t('submit_create_book_desktop')}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
