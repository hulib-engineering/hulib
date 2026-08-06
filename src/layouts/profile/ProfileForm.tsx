'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { isEmpty } from 'lodash';
import Button from '@/components/core/button/Button';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { pushError } from '@/components/CustomToastifyContainer';
import Dropdown from '@/components/core/dropdown/Dropdown';
import Form from '@/components/core/form/Form';
import MenuItem from '@/components/core/menuItem/MenuItem';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { genders } from '@/libs/constants';
import { useAppDispatch } from '@/libs/hooks';
import type { User } from '@/libs/services/modules/auth';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import { setUserInfo } from '@/libs/store/authentication';
import { PHONE_NUMBER_MESSAGE, PHONE_NUMBER_REGEX, ProfileValidation } from '@/validations/ProfileValidation';
import { calculateAge } from '@/utils/dateUtils';

type IProfileFormProps = {
  data: User;
  onCancel: () => void;
  onSucceed: () => void;
};

export default function ProfileForm({ data, onCancel, onSucceed }: IProfileFormProps) {
  const t = useTranslations('Common');

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const dispatch = useAppDispatch();

  const {
    control,
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      isUnderGuard: data?.birthday ? calculateAge(data.birthday) < 18 : false,
      fullName: data?.fullName ?? '',
      email: data?.email ?? '',
      gender: data?.gender && data?.gender?.id
        ? { id: data.gender.id, name: genders[data.gender.id - 1]?.label }
        : { id: 3, name: 'Other' },
      birthday: data?.birthday ?? new Date().toLocaleDateString(),
      phoneNumber: data?.phoneNumber,
      address: data?.address ?? '',
      parentPhoneNumber: data?.parentPhoneNumber,
      parentFullname: data?.parentFullname ?? '',
    },
  });

  useEffect(() => {
    if (watch('birthday')) {
      const age = calculateAge(watch('birthday'));
      // if age < 18 -> under guard
      setValue('isUnderGuard', age < 18);
    }
  }, [setValue, watch('birthday')]);

  const handleUpdate = handleSubmit(async (values: any) => {
    try {
      const { isUnderGuard, ...profilePatch } = values;

      if (!profilePatch.phoneNumber) {
        profilePatch.phoneNumber = null;
      }
      if (!profilePatch.parentPhoneNumber) {
        profilePatch.parentPhoneNumber = null;
      }

      const response = await updateProfile({ ...profilePatch, gender: { id: values.gender?.id } }).unwrap();
      dispatch(setUserInfo(response));
      onSucceed();
    } catch (error: any) {
      const fieldErrors = error?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        Object.keys(fieldErrors).forEach((field) => {
          setError(field as keyof z.infer<typeof ProfileValidation>, {
            type: 'server',
            message: PHONE_NUMBER_MESSAGE,
          });
        });
      } else {
        pushError(t(error.message));
      }
    }
  });

  const phoneHintText = (fieldError: typeof errors.phoneNumber) =>
    fieldError?.message ? t(fieldError.message as any) : undefined;

  return (
    <Form className="flex w-full flex-col gap-3" onSubmit={handleUpdate}>
      <Form.Item>
        <TextInput
          id="fullName"
          type="text"
          label={t('full_name')}
          {...register('fullName')}
          isError={!!errors.fullName}
          hintText={errors.fullName?.message}
          required
        />
      </Form.Item>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Form.Item className="flex-1">
          <Controller
            name="gender"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Dropdown
                value={value}
                onChange={onChange}
                isError={!!error}
              >
                {({ open }) => (
                  <>
                    <Dropdown.Select open={open} label={t('gender')}>
                      {value?.name}
                    </Dropdown.Select>
                    <Dropdown.Options>
                      {genders
                        .map(({ value, label }) => ({ id: value, name: label }))
                        .map((gender, index) => (
                          <Dropdown.Option value={gender} key={index}>
                            {({ selected, active }) => (
                              <MenuItem
                                isActive={active}
                                isSelected={selected}
                                data-testid={`test-${index}`}
                              >
                                {gender.name}
                              </MenuItem>
                            )}
                          </Dropdown.Option>
                        ))}
                    </Dropdown.Options>
                    <Dropdown.Hint>{error && error.message}</Dropdown.Hint>
                  </>
                )}
              </Dropdown>
            )}
          />
        </Form.Item>
        <Form.Item className="flex-1">
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomDatePicker
                label={(
                  <p>
                    {t('date_of_birth')}
                    <span className="text-red-50">*</span>
                  </p>
                )}
                value={value}
                onChange={onChange}
              />
            )}
            name="birthday"
          />
        </Form.Item>
      </div>
      <Form.Item>
        <TextInput
          type="text"
          label={t('address')}
          placeholder={t('address_placeholder')}
          {...register('address')}
          required
          isError={!!errors.address}
          hintText={errors.address?.message}
        />
      </Form.Item>
      <Form.Item>
        <TextInput
          id="email"
          type="email"
          label={t('email')}
          disabled
          {...register('email')}
          isError={!!errors.email}
          hintText={errors.email?.message}
          required
        />
      </Form.Item>
      <Form.Item>
        <TextInput
          type="tel"
          pattern={PHONE_NUMBER_REGEX.source}
          placeholder={t('phone_number_placeholder')}
          label={t('phone_number')}
          {...register('phoneNumber')}
          isError={!!errors.phoneNumber}
          hintText={phoneHintText(errors.phoneNumber)}
        />
      </Form.Item>
      {watch('isUnderGuard') && (
        <>
          <TextInput
            id="parentFullname"
            type="text"
            label={t('guardian_name')}
            {...register('parentFullname')}
          />
          <TextInput
            id="parentPhoneNumber"
            type="tel"
            pattern={PHONE_NUMBER_REGEX.source}
            placeholder={t('phone_number_placeholder')}
            label={t('guardian_phone_number')}
            {...register('parentPhoneNumber')}
            required
            isError={!!errors.parentPhoneNumber}
            hintText={phoneHintText(errors.parentPhoneNumber)}
          />
        </>
      )}
      <div className="mt-3 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          className="w-[114px]"
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || isLoading || !isDirty || !isEmpty(errors)}
          animation={(isSubmitting || isLoading) && 'progress'}
          className="w-[114px]"
        >
          {t('save')}
        </Button>
      </div>
    </Form>
  );
};
