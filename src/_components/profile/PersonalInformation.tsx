'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { z } from 'zod';

import { isEmpty } from 'lodash';
import Button from '@/components/core/button/Button';
// import { CustomDatePicker } from '@/components/CustomDatePicker';
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
import Alert from '@/components/Alert';

type IProfileFormProps = {
  data: User;
  onCancel: () => void;
  onSucceed: () => void;
};

type TProfileForm = z.infer<typeof ProfileValidation>;

// Extra: Find a weight to change the weight of the input text of the fields to 'medium'
function Name({ register, errors }: { register: UseFormRegister<TProfileForm>; errors: FieldErrors<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <Form.Item>
      <TextInput
        id="fullName"
        type="text"
        placeholder={t('full_name_placeholder')}
        label={(<span className="font-medium">{t('full_name')}</span>)}
        {...register('fullName')}
        isError={!!errors.fullName}
        hintText={errors.fullName?.message}
        required
      />
    </Form.Item>
  );
}
// TODO: Remove the damn 'any' for translations if possible
function GenderSection({ control }: { control: Control<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <Form.Item className="flex-1">
      <Controller
        name="gender"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Dropdown value={value} onChange={onChange} isError={!!error}>
            {({ open }) => (
              <>
                <Dropdown.Select
                  open={open}
                  label={(<span className="font-medium">{t('gender.label')}</span>)}
                  placeholder={t('gender.placeholder')}
                >
                  {value?.name && <span className="font-normal text-black">{t(`gender.${value.name}` as any)}</span>}
                </Dropdown.Select>
                <Dropdown.Options>
                  {genders
                    .map(({ value, label }) => ({ id: value, name: label }))
                    .map((gender, index) => (
                      <Dropdown.Option value={gender} key={index}>
                        {/* ({ selected, active }) => (
                              <MenuItem isActive={active} isSelected={selected} data-testid={`test-${index}`}>
                                {t(`gender.${gender.name}` as any)}
                              </MenuItem>
                            ) */}
                        <MenuItem data-testid={`test-${index}`}>
                          {t(`gender.${gender.name}` as any)}
                        </MenuItem>
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
  );
}

function BirthdaySection({ control }: { control: Control<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <Form.Item className="flex-1">
      <Controller
        name="birthday"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextInput
            type="date"
            label={<span className="font-medium">{t('date_of_birth')}</span>}
            {...field}
            isError={!!error}
            hintText={error?.message}
            required
          />
        )}
      />
    </Form.Item>
  );
}

function GenderBirthday({ control }: { control: Control<TProfileForm> }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <GenderSection control={control} />
      <BirthdaySection control={control} />
    </div>
  );
}

function AddressSection({ register, errors }: { register: UseFormRegister<TProfileForm>; errors: FieldErrors<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <Form.Item>
      <TextInput
        type="text"
        label={(<span className="font-medium">{t('address')}</span>)}
        placeholder={t('address_placeholder')}
        {...register('address')}
        isError={!!errors.address}
        hintText={errors.address?.message}
      />
    </Form.Item>
  );
}

function EmailSection({ register, errors }: { register: UseFormRegister<TProfileForm>; errors: FieldErrors<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <Form.Item>
      <TextInput
        id="email"
        type="email"
        label={(<span className="font-medium">{t('email')}</span>)}
        disabled
        {...register('email')}
        isError={!!errors.email}
        hintText={errors.email?.message}
        required
      />
    </Form.Item>
  );
}

function PhoneNumberSection({ register, errors }: { register: UseFormRegister<TProfileForm>; errors: FieldErrors<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <>
      <Form.Item>
        <TextInput
          type="tel"
          pattern={PHONE_NUMBER_REGEX.source}
          placeholder={t('phone_number_placeholder')}
          label={(<span className="font-medium">{t('phone_number')}</span>)}
          {...register('phoneNumber')}
          isError={!!errors.phoneNumber}
        />
      </Form.Item>
      {errors.phoneNumber && (<Alert>{t(errors.phoneNumber.message as any)}</Alert>)}
    </>
  );
}

function GuardianSection({ register, errors }: { register: UseFormRegister<TProfileForm>; errors: FieldErrors<TProfileForm> }) {
  const t = useTranslations('Common');
  return (
    <>
      <TextInput
        id="parentEmail"
        type="email"
        placeholder={t('guardian_placeholder')}
        label={(
          <p className="font-medium">
            {t('guardian_email')}
            <span className="font-normal text-red-50">*</span>
          </p>
        )}
        {...register('parentEmail')}
        isError={!!errors.parentEmail}
      />
      {errors.parentEmail && (<Alert>{t(errors.parentEmail.message as any)}</Alert>)}
      <TextInput
        id="parentPhoneNumber"
        type="tel"
        pattern={PHONE_NUMBER_REGEX.source}
        placeholder={t('guardian_placeholder')}
        label={(
          <p className="font-medium">
            {t('guardian_phone_number')}
            <span className="font-normal text-red-50">*</span>
          </p>
        )}
        {...register('parentPhoneNumber')}
        isError={!!errors.parentPhoneNumber}
      />
      {errors.parentPhoneNumber && (<Alert>{t(errors.parentPhoneNumber.message as any)}</Alert>)}
    </>
  );
}

function FormActionsSection({
  isSubmitting,
  isLoading,
  isDirty,
  errors,
  onCancel,
}: {
  isSubmitting: boolean;
  isLoading: boolean;
  isDirty: boolean;
  errors: FieldErrors<TProfileForm>;
  onCancel: () => void;
}) {
  const t = useTranslations('Common');
  return (
    <div className="mt-3 flex items-center justify-end gap-3">
      <Button
        type="button"
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
  );
}

export default function PersonalInformation({ data, onCancel, onSucceed }: IProfileFormProps) {
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
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    mode: 'onChange',
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
      parentEmail: data?.parentEmail ?? '',
    },
  });

  useEffect(() => {
    if (watch('birthday')) {
      const age = calculateAge(watch('birthday'));
      // if age < 18 -> under guard
      setValue('isUnderGuard', age < 18);
    }
  }, [setValue, watch('birthday')]);

  const handleUpdate = handleSubmit(async (values: TProfileForm) => {
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

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Form className="flex w-full flex-col gap-3" onSubmit={handleUpdate}>
      <Name register={register} errors={errors} />
      <GenderBirthday control={control} />
      <AddressSection register={register} errors={errors} />
      <EmailSection register={register} errors={errors} />
      <PhoneNumberSection register={register} errors={errors} />
      {watch('isUnderGuard') && (
        <GuardianSection register={register} errors={errors} />
      )}
      <FormActionsSection
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        isDirty={isDirty}
        errors={errors}
        onCancel={handleCancel}
      />
    </Form>
  );
};
