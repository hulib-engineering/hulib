// TO - DO: common it with WorkExperienceForm

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PencilSimple } from '@phosphor-icons/react';
import { isEmpty } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import IconButton from '@/components/core/iconButton/IconButton';
import InsetInput from '@/components/core/insetInput/InsetInput';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import useClickOutside from '@/libs/hooks/useClickOutside';
import {
  useAddEducationMutation,
  useEditEducationMutation,
} from '@/libs/services/modules/auth';
import { EducationValidation } from '@/validations/ProfileValidation';

type IEducationFormProps = | {
  editable: true;
  id: number;
  data: z.infer<typeof EducationValidation>;
  onCancel: () => void;
} | {
  editable?: false;
  onCancel: () => void;
};

const EducationForm = ({ onCancel, ...rest }: IEducationFormProps) => {
  const t = useTranslations('Common');

  const [addEducation, { isLoading: isAddingEducation }] = useAddEducationMutation();
  const [editEducation, { isLoading: isEditingEducation }] = useEditEducationMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof EducationValidation>>({
    resolver: zodResolver(EducationValidation),
    defaultValues: {
      major: rest.editable ? rest.data?.major : '',
      institution: rest.editable ? rest.data?.institution : '',
      startedAt: rest.editable ? rest.data?.startedAt : new Date().toLocaleDateString(),
      endedAt: rest.editable ? rest.data?.endedAt : undefined,
    },
  });

  const [ref, hasClickedOutside] = useClickOutside();

  useEffect(() => {
    if (hasClickedOutside) {
      onCancel();
    }
  }, [hasClickedOutside, onCancel]);

  const handleSubmitEducationForm = handleSubmit(async (data) => {
    try {
      if (!rest.editable) {
        await addEducation(data).unwrap();
        pushSuccess('Education information added successfully');
      } else {
        await editEducation({ ...data, id: rest.id }).unwrap();
        pushSuccess('Education information edited successfully');
      }
      onCancel();
    } catch (error: any) {
      pushError(t(error.message));
    }
  });

  return (
    <div ref={ref} className="flex flex-col gap-4 rounded-[20px] bg-primary-98 p-4">
      <p className="font-medium">{!rest.editable ? 'Add education' : 'Edit'}</p>
      <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmitEducationForm}>
        <fieldset className="flex items-center gap-3">
          <Form.Item>
            <InsetInput id="major" placeholder="Ex: Software Engineering" {...register('major')}>
              <InsetInput.Label>Major</InsetInput.Label>
            </InsetInput>
          </Form.Item>
          <Form.Item>
            <InsetInput id="institution" placeholder="Ex: Ho Chi Minh University of Science" {...register('institution')}>
              <InsetInput.Label>School/University</InsetInput.Label>
            </InsetInput>
          </Form.Item>
        </fieldset>
        <fieldset className="flex items-center gap-3">
          <span>From</span>
          <Form.Item className="relative min-h-10 w-fit overflow-visible">
            <Controller
              name="startedAt"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker
                  excludeDay
                  className="w-fit"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Form.Item>
          <span>to</span>
          <Form.Item className="relative min-h-10 w-fit overflow-visible">
            <Controller
              name="endedAt"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker
                  excludeDay
                  className="w-fit"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Form.Item>
        </fieldset>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="lg" className="w-[114px]">Cancel</Button>
          <Button
            type="submit"
            size="lg"
            disabled={!isEmpty(errors) || isSubmitting || isAddingEducation || isEditingEducation || (rest.editable && !isDirty)}
            animation={isSubmitting || isAddingEducation || isEditingEducation}
            className="w-[114px]"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EducationForm;

type IEducationItemProps = {
  data: { id: number } & z.infer<typeof EducationValidation>;
  editable?: boolean;
};

const EducationItem = ({ data, editable = false }: IEducationItemProps) => {
  const locale = useLocale();

  const { id, ...rest } = data;
  const startedAtDateString = new Date(rest.startedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });
  const endedAtDateString = rest.endedAt && new Date(rest.endedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EducationForm editable id={id} data={rest} onCancel={() => setIsEditing(false)} />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 flex-col gap-1 text-neutral-20">
        <p className="text-sm font-medium leading-5">
          {data.major}
          <span className="font-light"> at </span>
          {data.institution}
        </p>
        <p className="text-xs capitalize leading-[14px]">
          {`${startedAtDateString} - ${!data.endedAt ? 'Present' : endedAtDateString}`}
        </p>
      </div>
      {editable && (
        <IconButton variant="secondary" size="sm" className="p-2" onClick={() => setIsEditing(true)}>
          <PencilSimple weight="bold" />
        </IconButton>
      )}
    </div>
  );
};

export { EducationItem };
