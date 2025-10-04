// Need to rework as there still task in backup

'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import CustomSelect from './CustomSelect';

import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import type { User } from '@/features/users/types';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WorkAndEducationSection = ({ data }: { data?: User; editable?: boolean }) => {
  const t = useTranslations('Common');

  const [updateProfile] = useUpdateProfileMutation();

  const [editMode, setEditMode] = useState(false);

  const years = Array.from({ length: 50 }, (_, i) => (1980 + i).toString());

  // Helper function to convert numeric month-to-month name
  const numberToMonth = (monthNumber: string | undefined) => {
    if (!monthNumber) {
      return months[0];
    }
    const monthIndex = Number.parseInt(monthNumber, 10) - 1;
    return months[monthIndex] || months[0];
  };

  const methods = useForm<any>({
    defaultValues: {
      education: data?.education || '',
      educationStart: {
        fromMonth: numberToMonth(data?.educationStart?.split('-')[1]),
        fromYear: data?.educationStart?.split('-')[0] || years[0],
      },
      educationEnd: {
        toMonth: numberToMonth(data?.educationEnd?.split('-')[1]),
        toYear: data?.educationEnd?.split('-')[0] || years[0],
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;
  const formValues = watch();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Convert month names to numbers (1-12)
      const monthToNumber = (month: string) => {
        return (months.indexOf(month) + 1).toString().padStart(2, '0');
      };

      // Create ISO date strings
      const educationStart = new Date(
        `${formData.educationStart.fromYear}-${monthToNumber(
          formData.educationStart.fromMonth,
        )}-01T00:00:00.000Z`,
      ).toISOString();

      const educationEnd = new Date(
        `${formData.educationEnd.toYear}-${monthToNumber(
          formData.educationEnd.toMonth,
        )}-01T00:00:00.000Z`,
      ).toISOString();

      await updateProfile({
        education: formData.education,
        educationStart,
        educationEnd,
      }).unwrap();

      pushSuccess('Education information updated successfully');
      setEditMode(false);
    } catch (error: any) {
      pushError(t(error.message));
    }
  });

  return (
    <>
      <div className="flex flex-col gap-3 border-[0.5px] p-3 lg:border-none lg:p-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-black">Work Experience</span>
          {/* {editable && ( */}
          {/* <IconButton variant="secondary" size="sm" className="p-2">}> */}
          {/*   <PencilSimple weight="bold" /> */}
          {/* </IconButton> */}
          {/* )} */}
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-neutral-20">{data?.role?.name || ''}</h3>
          <span className="text-gray-500">as</span>
          <span className="font-medium text-neutral-20">Hulib</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-[0.5px] p-3 lg:border-none lg:p-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-black">Education</span>
          {/* {editable && ( */}
          {/*  <IconButton variant="secondary" size="sm" className="p-2" onClick={() => setEditMode(true)}> */}
          {/*    <PencilSimple weight="bold" /> */}
          {/*  </IconButton> */}
          {/* )} */}
        </div>
        {!editMode
          ? (
              <div>
                <div className="flex items-baseline">
                  <h3 className="text-neutral-20">{data?.education}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {`${formValues?.educationStart?.fromMonth} ${
                    formValues?.educationStart?.fromYear || ''
                  }`}
                  {' '}
                  -
                  {' '}
                  {`${formValues?.educationEnd?.toMonth} ${
                    formValues?.educationEnd?.toYear || ''
                  }`}
                </p>
              </div>
            )
          : (
              <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                <Form.Item>
                  <TextInput
                    id="education"
                    type="text"
                    inputSize="sm"
                    label=""
                    placeholder="Enter your education"
                    {...methods.register('education')}
                  />
                </Form.Item>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span>From</span>
                  <Controller
                    name="educationStart.fromMonth"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        name="fromMonth"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        options={months}
                      />
                    )}
                  />

                  <Controller
                    name="educationStart.fromYear"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        name="fromYear"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        options={years}
                      />
                    )}
                  />

                  <span>to</span>
                  <Controller
                    name="educationEnd.toMonth"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        name="toMonth"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        options={months}
                      />
                    )}
                  />

                  <Controller
                    name="educationEnd.toYear"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        name="toYear"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        options={years}
                      />
                    )}
                  />
                </div>

                {/* <Divider /> */}

                <div className="flex flex-row justify-end gap-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => {
                      methods.reset({
                        education: data?.education || '',
                        educationStart: {
                          fromMonth:
                        data?.educationStart?.split('-')[1] || months[0],
                          fromYear: data?.educationStart?.split('-')[0] || years[0],
                        },
                      });
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </Form>
            )}
      </div>
    </>
  );
};

export default WorkAndEducationSection;
