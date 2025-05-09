/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { FormControl, IconButton, MenuItem, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PencilSimple } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import * as React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import Form from '@/components/form/Form';
import TextInput from '@/components/textInput/TextInput';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import type { User } from '@/libs/services/modules/user/userType';

const genderOptions = [
  { name: 'Male', id: 1 },
  { name: 'Female', id: 2 },
  { name: 'Other', id: 3 },
];

export const ContactInformationSection = ({
  liberDetail,
}: {
  liberDetail: User | undefined;
}) => {
  const [editMode, setEditMode] = React.useState(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [error, setError] = React.useState<string | null>(null);
  const [updateProfile, { isLoading: isSubmitting }] =
    useUpdateProfileMutation();
  const defaultValues = React.useMemo(
    () => ({
      fullName: liberDetail?.fullName || '',
      gender: liberDetail?.gender || { name: '', id: 0 },
      birthday: liberDetail?.birthday || '',
      address: liberDetail?.address || '',
      email: liberDetail?.email || '',
      phoneNumber: liberDetail?.phoneNumber || '',
    }),
    [liberDetail],
  );

  type ContactInfoFormData = {
    fullName: string;
    gender: {
      name: string;
      id: number;
    };
    birthday: string;
    address: string;
    email: string;
    phoneNumber: string;
  };

  const methods = useForm<ContactInfoFormData>({ defaultValues });
  const { handleSubmit, reset, control, watch } = methods;

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCancel = () => {
    reset(defaultValues);
    setEditMode(false);
    setError(null);
  };

  const onSubmit = async (data: ContactInfoFormData) => {
    setError(null);
    try {
      await updateProfile({
        fullName: data.fullName,
        gender: { id: Number(data.gender.id) },
        birthday: data.birthday,
        address: data.address,
        phoneNumber: data.phoneNumber,
      }).unwrap();
      setEditMode(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update contact information',
      );
    }
  };

  const values = watch();

  return (
    <div className="flex flex-col gap-y-2 py-5">
      <div className="flex flex-row items-center justify-between py-2">
        <span>Contact Information</span>
        {!editMode && (
          <IconButton onClick={() => setEditMode(true)}>
            <PencilSimple size={20} />
          </IconButton>
        )}
      </div>
      {editMode ? (
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Form.Item>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    type="text"
                    id="ci-fullName"
                    className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
                    label="Full Name"
                    // isError={!!errors.fullName}
                    // hintText={errors.fullName?.message || (errors.fullName && 'Required')}
                  />
                )}
              />
            </Form.Item>
            <Form.Item className="flex flex-row gap-2 lg:flex-row">
              <fieldset className="w-1/2">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <p id="gender-label" className="text-sm text-neutral-10">
                        Gender
                      </p>
                      <Select
                        labelId="gender-select-label"
                        id="gender-select"
                        value={field?.value?.id || ''}
                        onChange={(e) => {
                          const selectedOption = genderOptions.find(
                            (option) => option.id === e.target.value,
                          );
                          field.onChange(selectedOption || null);
                        }}
                        sx={{
                          // borderRadius: '20px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          '& .MuiOutlinedInput-notchedOutline': {
                            height: '50px',
                          },
                        }}
                      >
                        {genderOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </fieldset>
              <fieldset className="w-1/2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="birthday"
                    control={control}
                    render={({ field }) => (
                      <>
                        <p
                          id="birthday-label"
                          className="text-sm text-neutral-10"
                        >
                          Birthday
                        </p>
                        <DatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? date.format('YYYY-MM-DD') : '',
                            )
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                borderRadius: '100px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  height: '50px',
                                },
                              },
                            },
                          }}
                        />
                      </>
                    )}
                  />
                </LocalizationProvider>
              </fieldset>
            </Form.Item>
            <Form.Item>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    id="ci-address"
                    type="text"
                    className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
                    label="Address"
                    // isError={!!errors.address}
                    // hintText={errors.address?.message || (errors.address && 'Required')}
                  />
                )}
              />
            </Form.Item>
            <Form.Item>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    id="ci-email"
                    type="email"
                    value={field.value || ''}
                    className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
                    label="Email"
                    placeholder=""
                    disabled
                    // isError={!!errors.email}
                    // hintText={errors.email?.message || (errors.email && 'Required')}
                  />
                )}
              />
            </Form.Item>
            <Form.Item>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    id="ci-phoneNumber"
                    type="tel"
                    className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
                    label="Phone Number"
                    // isError={!!errors.phoneNumber}
                    // hintText={errors.phoneNumber?.message || (errors.phoneNumber && 'Required')}
                  />
                )}
              />
            </Form.Item>
            <div className="flex flex-row justify-end gap-x-2">
              <button
                type="button"
                className="rounded-[100px] bg-neutral-90 px-4 py-2 text-sm text-neutral-40"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[100px] bg-primary-50 px-4 py-2 text-sm text-white disabled:bg-neutral-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className="flex flex-col gap-y-3">
          <div>
            <p className="font-medium">Full Name </p>
            <p className="font-light">{values.fullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Gender </p>
            <p className="font-light">{values.gender.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Birthday </p>
            <p className="font-light">{values.birthday || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Address </p>
            <p className="font-light">{values.address || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Email </p>
            <p className="font-light">{values.email || 'Not available'}</p>
          </div>
          <div>
            <p className="font-medium">Phone Number </p>
            <p className="font-light">{values.phoneNumber || 'Not provided'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInformationSection;
