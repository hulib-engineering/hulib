'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Button from '@/components/button/Button';
import ConfirmUpdatePopup from '@/components/confirmUpdatePopup/ConfirmUpdatePopup';
import { pushError } from '@/components/CustomToastifyContainer';
import Form from '@/components/form/Form';
import { ControlledSelect } from '@/components/Select';
import TextInput from '@/components/textInput-v1/TextInput';
import { genders } from '@/libs/constants';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import { setUserInfo } from '@/libs/store/authentication';

export const ProfileForm = ({
  setEditMode,
  methods,
}: {
  setEditMode: (open: boolean) => void;
  methods: any;
}) => {
  const t = useTranslations('Common');
  const [updateProfile] = useUpdateProfileMutation();

  const avatarId = useAppSelector((state) => state.auth.avatarId);

  const dispatch = useAppDispatch();

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = handleSubmit(async (values: any) => {
    try {
      const response = await updateProfile({
        ...values,
        gender: { id: values.gender },
        photo: avatarId !== '' ? { id: avatarId } : null,
      }).unwrap();
      dispatch(setUserInfo(response));
      setEditMode(false);
    } catch (error: any) {
      pushError(t(error.message));
    }
  });

  return (
    <>
      <Form className="flex w-full flex-col gap-6" onSubmit={handleUpdate}>
        <Form.Item className="flex flex-col gap-2 lg:flex-row">
          <fieldset className="w-full">
            <TextInput
              id="fullName"
              type="text"
              label="Name"
              {...register('fullName')}
              isError={!!errors.fullName}
              hintText={errors.fullName?.message}
              required
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
        <Form.Item className="z-10 flex flex-col gap-2 lg:flex-row">
          <fieldset className="w-full">
            <TextInput
              type="date"
              label="Date of birth"
              {...register('birthday')}
              isError={!!errors.birthday}
              hintText={errors.birthday?.message}
              required
            />
          </fieldset>
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
        </Form.Item>
        <Form.Item className="flex flex-col gap-2 lg:flex-row">
          <fieldset className="w-full">
            <TextInput
              type="text"
              label="Address"
              placeholder="Enter your address"
              {...register('address')}
            />
          </fieldset>
          <fieldset className="w-full">
            {watch('isUnderGuard') ? (
              <TextInput
                id="parentPhoneNumber"
                type="number"
                pattern="^[0-9-+\s()]*$"
                label="Your Guardian Phone Number"
                className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                {...register('parentPhoneNumber')}
                style={{
                  MozAppearance: 'textfield',
                }}
                disabled
                isError={!!errors.parentPhoneNumber}
                // @ts-ignore
                hintText={errors.parentPhoneNumber?.message}
              />
            ) : (
              <TextInput
                type="number"
                pattern="^[0-9-+\s()]*$"
                className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                label="Phone Number"
                {...register('phoneNumber')}
                style={{
                  MozAppearance: 'textfield',
                }}
              />
            )}
          </fieldset>
        </Form.Item>
        <div className="flex flex-row justify-end gap-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => {
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
            animation={isSubmitting && 'progress'}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
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
