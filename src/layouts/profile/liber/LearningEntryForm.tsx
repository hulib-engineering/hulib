'use client';

import { CircleNotch } from '@phosphor-icons/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { LearningEntryFormValues, LearningType } from './type';
import Button from '@/components/core/button/Button';
import Checkbox from '@/components/core/checkbox/Checkbox';
import Dropdown from '@/components/core/dropdown/Dropdown';
import Form from '@/components/core/form/Form';
import InsetInput from '@/components/core/insetInput/InsetInput';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { CustomDatePicker } from '@/components/CustomDatePicker';

type LearningEntryFormProps = {
  defaultValues?: Partial<LearningEntryFormValues>;
  onSave: (values: LearningEntryFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const LearningEntryForm = ({ defaultValues, onSave, onCancel }: LearningEntryFormProps) => {
  const t = useTranslations('MyProfile');
  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<LearningEntryFormValues>({
    defaultValues: {
      type: defaultValues?.type ?? 'university',
      name: defaultValues?.name ?? '',
      organization: defaultValues?.organization ?? '',
      startedAt: defaultValues?.startedAt ?? new Date().toISOString().slice(0, 10),
      endedAt: defaultValues?.endedAt,
      isPublic: defaultValues?.isPublic ?? false,
    },
  });

  const TYPE_LABELS: Record<LearningType, string> = {
    vocational: t('liber_about.education_type_vocational'),
    university: t('liber_about.education_type_university'),
    life_experience: t('liber_about.education_type_life_experience'),
  };
  const TYPE_ENTRIES = Object.entries(TYPE_LABELS) as [LearningType, string][];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4">
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
        <Controller
          name="type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Dropdown value={value} onChange={onChange}>
              {({ open }) => (
                <>
                  <Dropdown.Select open={open} label={t('liber_about.education_type_label')} className="rounded-md">
                    <span className="text-neutral-20">{TYPE_LABELS[value as LearningType]}</span>
                  </Dropdown.Select>
                  <Dropdown.Options>
                    {TYPE_ENTRIES.map(([val, label]) => (
                      <Dropdown.Option key={val} value={val}>
                        {({ selected, active }) => (
                          <MenuItem isActive={active} isSelected={selected}>
                            <MenuItem.Title>{label}</MenuItem.Title>
                          </MenuItem>
                        )}
                      </Dropdown.Option>
                    ))}
                  </Dropdown.Options>
                </>
              )}
            </Dropdown>
          )}
        />

        <Form.Item>
          <InsetInput
            id="learning-name"
            placeholder={t('liber_about.education_name_placeholder')}
            {...register('name')}
          >
            <InsetInput.Label>{t('liber_about.education_name_label')}</InsetInput.Label>
          </InsetInput>
        </Form.Item>

        <Form.Item>
          <InsetInput
            id="learning-organization"
            placeholder={t('liber_about.education_org_placeholder')}
            {...register('organization')}
          >
            <InsetInput.Label>{t('liber_about.education_org_label')}</InsetInput.Label>
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

        <Controller
          name="isPublic"
          control={control}
          render={({ field: { onChange, value } }) => (
            <label htmlFor="learning-is-public" className="flex cursor-pointer items-center gap-2">
              <Checkbox id="learning-is-public" checked={value} onChange={e => onChange(e.target.checked)} />
              <span className="text-sm text-neutral-10">{t('liber_about.is_public_label')}</span>
            </label>
          )}
        />

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

export type { LearningEntryFormProps };
export default LearningEntryForm;
