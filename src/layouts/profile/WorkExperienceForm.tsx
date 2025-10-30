// TO - DO: common it with EducationForm

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PencilSimple } from '@phosphor-icons/react';
import { isEmpty } from 'lodash';
import { useTranslations } from 'next-intl';
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
import { useAddWorkExperienceMutation, useEditWorkExperienceMutation } from '@/libs/services/modules/auth';
import { WorkExperienceValidation } from '@/validations/ProfileValidation';

type IWorkExperienceFormProps = | {
  editable: true;
  id: number;
  data: z.infer<typeof WorkExperienceValidation>;
  onCancel: () => void;
} | {
  editable?: false;
  onCancel: () => void;
};

const WorkExperienceForm = ({ onCancel, ...rest }: IWorkExperienceFormProps) => {
  const t = useTranslations('Common');

  const [addWork, { isLoading: isAddingWork }] = useAddWorkExperienceMutation();
  const [editWork, { isLoading: isEditingWork }] = useEditWorkExperienceMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof WorkExperienceValidation>>({
    resolver: zodResolver(WorkExperienceValidation),
    defaultValues: {
      position: rest.editable ? rest.data?.position : '',
      company: rest.editable ? rest.data?.company : '',
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

  const handleSubmitWorkExpForm = handleSubmit(async (data) => {
    try {
      if (!rest.editable) {
        await addWork(data).unwrap();
        pushSuccess('Work experience information added successfully');
      } else {
        await editWork({ ...data, id: rest.id }).unwrap();
        pushSuccess('Work experience information edited successfully');
      }
      onCancel();
    } catch (error: any) {
      pushError(t(error.message));
    }
  });

  return (
    <div ref={ref} className="flex flex-col gap-4 rounded-[20px] bg-primary-98 p-4">
      <p className="font-medium">{!rest.editable ? 'Add work experience' : 'Edit'}</p>
      <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmitWorkExpForm}>
        <fieldset className="flex items-center gap-3">
          <Form.Item>
            <InsetInput id="position" placeholder="Ex: Graphic Designer" {...register('position')}>
              <InsetInput.Label>Position</InsetInput.Label>
            </InsetInput>
          </Form.Item>
          <Form.Item>
            <InsetInput id="company" placeholder="Ex: Amazon" {...register('company')}>
              <InsetInput.Label>Company</InsetInput.Label>
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
            disabled={!isEmpty(errors) || isSubmitting || isAddingWork || isEditingWork || (rest.editable && !isDirty)}
            animation={isSubmitting || isAddingWork || isEditingWork}
            className="w-[114px]"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WorkExperienceForm;

type IWorkExperienceItemProps = {
  data: { id: number } & z.infer<typeof WorkExperienceValidation>;
  editable?: boolean;
};

const WorkExperienceItem = ({ data, editable = false }: IWorkExperienceItemProps) => {
  const { id, ...rest } = data;

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <WorkExperienceForm editable id={id} data={rest} onCancel={() => setIsEditing(false)} />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 flex-col gap-1 text-neutral-20">
        <p className="text-sm font-medium leading-5">
          {data.position}
          <span className="font-light"> at </span>
          {data.company}
        </p>
        <p className="text-xs leading-[14px]">{`${data.startedAt} - ${!data.endedAt ? 'Present' : data.endedAt}`}</p>
      </div>
      {editable && (
        <IconButton variant="secondary" size="sm" className="p-2" onClick={() => setIsEditing(true)}>
          <PencilSimple weight="bold" />
        </IconButton>
      )}
    </div>
  );
};

export { WorkExperienceItem };
