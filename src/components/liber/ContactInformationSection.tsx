/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { EditIcon } from '@/components/authorDetail/EditIcon';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import type { User } from '@/libs/services/modules/user/userType';

export const ContactInformationSection = ({
  liberDetail,
}: {
  liberDetail: User | undefined;
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [updateProfile, { isLoading: isSubmitting }] =
    useUpdateProfileMutation();

  const defaultValues = React.useMemo(
    () => ({
      fullName: liberDetail?.fullName || '',
      gender: liberDetail?.gender?.name || '',
      birthday: liberDetail?.birthday || '',
      address: liberDetail?.address || '',
      email: '', // Placeholder as email is not in User
      phoneNumber: liberDetail?.phoneNumber || '',
    }),
    [liberDetail],
  );

  type ContactInfoFormData = {
    fullName: string;
    gender: string;
    birthday: string;
    address: string;
    email: string;
    phoneNumber: string;
  };

  const { register, handleSubmit, reset, watch } = useForm<ContactInfoFormData>(
    { defaultValues },
  );

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
        gender: data.gender,
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
      <div className="flex flex-row items-center justify-between">
        <span>Contact Information</span>
        {!editMode && <EditIcon onClick={() => setEditMode(true)} />}
      </div>
      <div className="bg-white p-5">
        {editMode ? (
          <form
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {error && (
              <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="ci-fullName"
                className="block text-sm font-medium"
              >
                Full Name
              </label>
              <input
                id="ci-fullName"
                {...register('fullName')}
                className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
              />
            </div>
            <div>
              <label htmlFor="ci-gender" className="block text-sm font-medium">
                Gender
              </label>
              <input
                id="ci-gender"
                {...register('gender')}
                className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
              />
            </div>
            <div>
              <label
                htmlFor="ci-birthday"
                className="block text-sm font-medium"
              >
                Birthday
              </label>
              <input
                id="ci-birthday"
                {...register('birthday')}
                type="date"
                className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
              />
            </div>
            <div>
              <label htmlFor="ci-address" className="block text-sm font-medium">
                Address
              </label>
              <input
                id="ci-address"
                {...register('address')}
                className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
              />
            </div>
            <div>
              <label htmlFor="ci-email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="ci-email"
                {...register('email')}
                className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
                placeholder="Not available"
              />
            </div>
            <div>
              <label
                htmlFor="ci-phoneNumber"
                className="block text-sm font-medium"
              >
                Phone Number
              </label>
              <input
                id="ci-phoneNumber"
                {...register('phoneNumber')}
                className="mt-1 w-full rounded border border-[#C2C6CF] p-2"
              />
            </div>
            <div className="flex flex-row justify-end gap-x-2">
              <button
                type="button"
                className="rounded bg-neutral-90 px-4 py-2 text-sm text-neutral-40"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-primary-50 px-4 py-2 text-sm text-white disabled:bg-neutral-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-y-2">
            <div>
              <span className="font-medium">Full Name: </span>
              <span>{values.fullName || 'Not provided'}</span>
            </div>
            <div>
              <span className="font-medium">Gender: </span>
              <span>{values.gender || 'Not provided'}</span>
            </div>
            <div>
              <span className="font-medium">Birthday: </span>
              <span>{values.birthday || 'Not provided'}</span>
            </div>
            <div>
              <span className="font-medium">Address: </span>
              <span>{values.address || 'Not provided'}</span>
            </div>
            <div>
              <span className="font-medium">Email: </span>
              <span>{values.email || 'Not available'}</span>
            </div>
            <div>
              <span className="font-medium">Phone Number: </span>
              <span>{values.phoneNumber || 'Not provided'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformationSection;
