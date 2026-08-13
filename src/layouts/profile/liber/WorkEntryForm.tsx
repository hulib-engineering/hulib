'use client';

import { CircleNotch } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { WorkEntryFormValues } from './type';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import InsetInput from '@/components/core/insetInput/InsetInput';
import { CustomDatePicker } from '@/components/CustomDatePicker';

type WorkEntryFormProps = {
  defaultValues?: Partial<WorkEntryFormValues>;
  onSave: (values: WorkEntryFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const WorkEntryForm = ({ defaultValues, onSave, onCancel }: WorkEntryFormProps) => {
  const t = useTranslations('MyProfile');
  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<WorkEntryFormValues>({
    defaultValues: {
      position: defaultValues?.position ?? '',
      company: defaultValues?.company ?? '',
      startedAt: defaultValues?.startedAt ?? new Date().toISOString().slice(0, 10),
      endedAt: defaultValues?.endedAt,
    },
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4">
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
        <Form.Item>
          <InsetInput
            id="work-position"
            placeholder={t('liber_about.work_position_placeholder')}
            {...register('position')}
          >
            <InsetInput.Label>{t('liber_about.work_position_label')}</InsetInput.Label>
          </InsetInput>
        </Form.Item>

        <Form.Item>
          <InsetInput
            id="work-company"
            placeholder={t('liber_about.work_company_placeholder')}
            {...register('company')}
          >
            <InsetInput.Label>{t('liber_about.work_company_label')}</InsetInput.Label>
          </InsetInput>
        </Form.Item>

        <fieldset className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-neutral-10">{t('liber_about.date_from')}</span>
          <Form.Item className="relative min-h-10 w-fit overflow-visible">
            <Controller
              name="startedAt"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker excludeDay className="w-fit" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>
          <span className="text-sm text-neutral-10">{t('liber_about.date_to')}</span>
          <Form.Item className="relative min-h-10 w-fit overflow-visible">
            <Controller
              name="endedAt"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker excludeDay className="w-fit" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>
        </fieldset>

        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" type="button" onClick={onCancel} disabled={isSubmitting}>
            {t('liber_about.cancel')}
          </Button>
          <Button size="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? <CircleNotch weight="bold" size={16} className="animate-spin" />
              : t('liber_about.save')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export type { WorkEntryFormProps };
export default WorkEntryForm;
