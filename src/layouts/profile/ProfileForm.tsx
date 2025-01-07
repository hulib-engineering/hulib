'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import ConfirmUpdatePopup from '@/components/confirmUpdatePopup/ConfirmUpdatePopup';
import { pushError } from '@/components/CustomToastifyContainer';
import Form from '@/components/form/Form';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ControlledSelect } from '@/components/Select';
import TextInput from '@/components/textInput-v1/TextInput';
import { genders } from '@/libs/constants';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import {
  useGetPersonalInfoQuery,
  useUpdateProfileMutation,
} from '@/libs/services/modules/auth';
import { setAvatarUrl } from '@/libs/store/authentication';
import { ProfileValidation } from '@/validations/ProfileValidation';

export const ProfileForm = () => {
  const { data, isLoading } = useGetPersonalInfoQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const avatarId = useAppSelector((state) => state.auth.avatarId);

  const dispatch = useAppDispatch();

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      isUnderGuard: false,
      fullname: '',
      birthday: '',
      email: '',
      gender: 3,
      phoneNumber: '',
      address: '',
      parentPhoneNumber: '',
    },
  });
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const onHandleClickUpdateBtn = handleSubmit(() => {
    if (isValid) {
      setIsOpen(!isOpen);
    }
  });

  useEffect(() => {
    reset({
      isUnderGuard: false,
      fullname: data?.fullName ?? '',
      birthday: data?.birthday ?? '',
      email: data?.email ?? '',
      gender: (data?.gender && data?.gender?.id) || 3,
      phoneNumber: data?.phoneNumber ?? '',
      address: data?.address ?? '',
      parentPhoneNumber: data?.parentPhoneNumber ?? '',
    });
    dispatch(setAvatarUrl(data?.photo ?? {}));
  }, [data]);

  const handleUpdate = handleSubmit(async (values) => {
    try {
      await updateProfile({
        ...values,
        gender: { id: values.gender },
        photo: avatarId !== '' ? { id: avatarId } : null,
      }).unwrap();
      return router.refresh();
    } catch (error: any) {
      if (error?.data) {
        return pushError(`Error: ${error?.data?.message}`);
      }
      return pushError(`Error: ${error?.message}`);
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <>
      <Form
        className="flex w-full flex-col gap-6"
        onSubmit={onHandleClickUpdateBtn}
      >
        <Form.Item className="flex gap-2">
          <fieldset className="w-full">
            <TextInput
              id="fullname"
              type="text"
              label="Name"
              {...register('fullname')}
              isError={!!errors.fullname}
              hintText={errors.fullname?.message}
            />
          </fieldset>
          <fieldset className="w-full">
            <TextInput
              type="date"
              label="Date of birth"
              {...register('birthday')}
              isError={!!errors.birthday}
              hintText={errors.birthday?.message}
            />
          </fieldset>
        </Form.Item>
        <Form.Item className="z-10 flex gap-2">
          <fieldset className="w-full">
            <TextInput
              id="email"
              type="email"
              label="Email"
              disabled
              {...register('email')}
              isError={!!errors.email}
              hintText={errors.email?.message}
            />
          </fieldset>
          <fieldset className="w-full">
            <ControlledSelect
              name="gender"
              control={control}
              label="Gender"
              options={genders}
            />
          </fieldset>
        </Form.Item>
        <Form.Item className="flex gap-2">
          <fieldset className="w-full">
            {watch('isUnderGuard') ? (
              <TextInput
                id="parentPhoneNumber"
                type="tel"
                label="Parent Phone Number"
                placeholder="+xxxxxxxxxxx"
                {...register('parentPhoneNumber')}
                isError={!!errors.parentPhoneNumber}
                // @ts-ignore
                hintText={errors.parentPhoneNumber?.message}
              />
            ) : (
              <TextInput
                type="text"
                label="Phone Number"
                {...register('phoneNumber')}
              />
            )}
          </fieldset>
          <fieldset className="w-full">
            <TextInput type="text" label="Address" {...register('address')} />
          </fieldset>
        </Form.Item>
        <p>
          <b>Note:</b> Human book will contact you via the above phone number in
          case of emergencies during the process of connecting with a mentor.
          For example, the advisor/recipient forgets to confirm the appointment
          or does not show up for the appointment...
        </p>
        <Form.Item className="py-4">
          <Button
            type="submit"
            value="Submit"
            className="w-full"
            disabled={isSubmitting}
            animation={isSubmitting && 'progress'}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
      <ConfirmUpdatePopup
        open={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        onSuccess={handleUpdate}
        title="Update Personal Information"
        description="Are you sure you want to change your personal information?"
        titleOfDiscardBtn="Cancel"
        titleOfConfirmBtn="Update"
      />
    </>
  );
};
