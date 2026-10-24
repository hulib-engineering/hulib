'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { z } from 'zod';
import Link from 'next/link';

import { isEmpty } from 'lodash';

import Button from '@/components/core/button/Button';
// import { CustomDatePicker } from '@/components/CustomDatePicker';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Dropdown from '@/components/core/dropdown/Dropdown';
import Form from '@/components/core/form/Form';
import MenuItem from '@/components/core/menuItem/MenuItem';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { genders } from '@/libs/constants';
import { useAppDispatch } from '@/libs/hooks';
import type { User } from '@/libs/services/modules/auth';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import { setUserInfo } from '@/libs/store/authentication';
import { PHONE_NUMBER_REGEX, ProfileValidation, VALIDATION_MESSAGES } from '@/validations/ProfileValidation';
import { calculateAge } from '@/utils/dateUtils';
import Alert from '@/components/Alert';

// import { CodeConfirmationModal } from './PersonalInfoOTPModal' Note: Reuse if OTP modal still needed
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import PhoneCodeSelect from '@/components/PhoneCodeByCountryDropdown';
import { detectPhoneCountry } from '@/utils/detectPhoneCountry';

type SectionProps = {
  register: UseFormRegister<TProfileForm>;
  errors: FieldErrors<TProfileForm>;
};

type IProfileFormProps = {
  data: User;
};

type TProfileForm = z.infer<typeof ProfileValidation>;

function Name({ register, errors }: SectionProps) {
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
                    .map(gender => (
                      <Dropdown.Option value={gender} key={gender.id}>
                        <MenuItem data-testid={`test-${gender.id}`}>
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
// TODO: give birthday section minicalendar
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
            max="9999-12-31"
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

function AddressSection({ register, errors }: SectionProps) {
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

function EmailSection({ register, errors }: SectionProps) {
  const t = useTranslations('Common');
  return (
    <>
      <Form.Item>
        <TextInput
          id="email"
          type="email"
          label={(<span className="font-medium">{t('email')}</span>)}
          {...register('email')}
          isError={!!errors.email}
          required
          disabled
        />
      </Form.Item>
      {errors.email
        ? <Alert>{t(errors.email.message as any)}</Alert>
        : <Alert variant="info">{t('email_valid')}</Alert>}
    </>
  );
}

function PhoneNumberSection({ register, errors }: SectionProps) {
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

function GuardianSection({ register, errors, setValue, watch }: any /* SectionProps */) {
  const t = useTranslations('Common');
  const message = errors.parentPhoneNumber?.message;
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <Form.Item>
        <label
          htmlFor="parentPhoneNumber"
          className="block pb-2 text-sm font-medium leading-4 text-neutral-10"
        >
          {t('guardian_phone_number')}
        </label>

        <div className="relative">
          <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2">
            <PhoneCodeSelect
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </div>
          <TextInput
            id="parentPhoneNumber"
            type="tel"
            className="pl-28"
            placeholder={t('guardian_placeholder')}
            {...register('parentPhoneNumber')}
            isError={!!errors.parentPhoneNumber}
          />
        </div>
      </Form.Item>

      {errors.parentPhoneNumber && (
        <Alert>
          {message === VALIDATION_MESSAGES.PARENT_REQUIRED ? (
            <>
              {t('guardian_required_1')}
              {' '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPrivacyOpen(true);
                }}
                className="italic underline"
              >
                {t('guardian_required_2')}
              </Link>
            </>
          ) : (
            t(message as any)
          )}
        </Alert>
      )}

      <PrivacyPolicyModal
        open={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
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
  // Note: There's a bug after the user submitted the form, the user can still revert field data back to what it was before update by pressing 'Cancel'
  // I don't think this bug is worth fixing, if not mentioning it's ironically could be useful for the users though
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

export default function PersonalInformation({ data }: IProfileFormProps) {
  const t = useTranslations('Common');

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  // const [isOpenConfirmCodeModal, setIsOpenConfirmCodeModal] = useState(false); || Note: Reuse if need an otp modal again

  const dispatch = useAppDispatch();

  const {
    control,
    register,
    setValue,
    setError,
    trigger,
    watch,
    // getValues, for OTP
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
      birthday: data?.birthday ?? new Date().toISOString().slice(0, 10),
      phoneNumber: data?.phoneNumber ?? null,
      address: data?.address ?? '',
      parentPhoneNumber: data?.parentPhoneNumber ?? null,
      parentEmail: data?.parentEmail ?? null,
      countryCode: detectPhoneCountry(data?.parentPhoneNumber),
    },
  });

  const birthday = watch('birthday');

  useEffect(() => {
    if (!birthday) {
      return;
    }
    const underGuard = calculateAge(birthday) < 18;
    setValue('isUnderGuard', underGuard, { shouldDirty: true, shouldValidate: true });
    void trigger(['parentPhoneNumber', 'parentEmail']);
  }, [birthday, setValue, trigger]);

  const handleUpdate = handleSubmit(async (values: TProfileForm) => {
    try {
      const { isUnderGuard, ...profilePatch } = values;

      if (!profilePatch.phoneNumber) {
        profilePatch.phoneNumber = null;
      }
      if (!profilePatch.parentPhoneNumber || profilePatch.countryCode === 'email') {
        profilePatch.parentPhoneNumber = null;
      }
      if (!profilePatch.parentEmail || profilePatch.countryCode !== 'email') {
        profilePatch.parentEmail = null;
      }
      const response = await updateProfile({ ...profilePatch, gender: { id: values.gender?.id } }).unwrap();
      dispatch(setUserInfo(response));
      pushSuccess(t('update_successfully'));
      // setIsOpenConfirmCodeModal(true); Note: Reuse if need an otp modal again
    } catch (error: any) {
      const fieldErrors = error?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        Object.keys(fieldErrors).forEach((field) => {
          setError(field as keyof z.infer<typeof ProfileValidation>, {
            type: 'server',
            message: VALIDATION_MESSAGES.PHONE_NUMBER,
          });
        });
        pushError(t('update_failed'));
      } else {
        pushError(t(error.message));
      }
    }
  });

  return (
    <>
      <Form className="flex w-full flex-col gap-3" onSubmit={handleUpdate}>
        <Name register={register} errors={errors} />
        <GenderBirthday control={control} />
        <AddressSection register={register} errors={errors} />
        <EmailSection register={register} errors={errors} />
        <PhoneNumberSection register={register} errors={errors} />
        <GuardianSection
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
        <FormActionsSection
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          isDirty={isDirty}
          errors={errors}
          onCancel={() => reset()}
        />
      </Form>

      {/* Note: Reuse if need an otp modal again
        <Modal open={isOpenConfirmCodeModal} onClose={handleCloseCCModal}>
          <CodeConfirmationModal email={getValues('email')} onSuccess={() => setIsOpenConfirmCodeModal(false)} />
        </Modal>
      */}
    </>
  );
};
