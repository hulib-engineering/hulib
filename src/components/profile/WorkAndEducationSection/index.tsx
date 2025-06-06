'use client';

import { Divider, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Form from '@/components/form/Form';
import TextInput from '@/components/textInput-v1/TextInput';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import type { User } from '@/libs/services/modules/user/userType';

import IconButtonEdit from '../IconButtonEdit';
import CustomSelect from './CustomSelect';

type Props = {
  data: User | undefined;
};

const WorkAndEducationSection = ({ data }: Props) => {
  const t = useTranslations('Common');
  const [updateProfile] = useUpdateProfileMutation();
  const [editMode, setEditMode] = useState(false);

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

  const years = Array.from({ length: 50 }, (_, i) => (1980 + i).toString());

  // Helper function to convert numeric month to month name
  const numberToMonth = (monthNumber: string | undefined) => {
    if (!monthNumber) return months[0];
    const monthIndex = parseInt(monthNumber, 10) - 1;
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
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <span>Work Experience</span>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline">
            <h3 className="text-neutral-20">{data?.role?.name || ''}</h3>
            <span className="mx-2 text-gray-500">as</span>
            <span className="font-medium text-neutral-20">Hulib</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <span>Education</span>
          <IconButtonEdit onClick={() => setEditMode(true)} />
        </div>

        {!editMode ? (
          <div className="mb-4">
            <div className="flex items-baseline">
              <h3 className="text-neutral-20">{data?.education}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {`${formValues?.educationStart?.fromMonth} ${
                formValues?.educationStart?.fromYear || ''
              }`}{' '}
              -{' '}
              {`${formValues?.educationEnd?.toMonth} ${
                formValues?.educationEnd?.toYear || ''
              }`}
            </p>
          </div>
        ) : (
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

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{
                '& > span': {
                  fontSize: '16px',
                  minWidth: { xs: '100%', sm: 'auto' },
                  mb: { xs: 1, sm: 0 },
                },
              }}
            >
              <span>From</span>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Controller
                  name="educationStart.fromMonth"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      name="fromMonth"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
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
                      onChange={(e) => onChange(e.target.value)}
                      options={years}
                    />
                  )}
                />
              </Stack>

              <span>to</span>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Controller
                  name="educationEnd.toMonth"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      name="toMonth"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
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
                      onChange={(e) => onChange(e.target.value)}
                      options={years}
                    />
                  )}
                />
              </Stack>
            </Stack>

            <Divider />

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
    </div>
  );
};

export default WorkAndEducationSection;
