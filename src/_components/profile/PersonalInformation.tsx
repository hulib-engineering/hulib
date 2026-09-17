'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Control, FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import type { z } from 'zod';

import { isEmpty } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { X } from '@phosphor-icons/react';
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
import { EmailChangeValidation, PHONE_NUMBER_REGEX, ProfileValidation, VALIDATION_MESSAGES } from '@/validations/ProfileValidation';
import { calculateAge } from '@/utils/dateUtils';
import Alert from '@/components/Alert';
import Modal from '@/components/Modal';
import AuthCode from '@/components/core/authCode/AuthCode';
import Hint from '@/components/Hint';

type DEBUGGINGSectionProps = {
  register: UseFormRegister<TProfileForm>;
  errors: FieldErrors<TProfileForm>;
  DEBUGGING: boolean;
};

type SectionProps = {
  register: UseFormRegister<TProfileForm>;
  errors: FieldErrors<TProfileForm>;
};

type IProfileFormProps = {
  data: User;
};

type TProfileForm = z.infer<typeof ProfileValidation>;

// Extra: Find a weight to change the weight of the input text of the fields to 'medium'
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

function EmailSection({ register, errors, DEBUGGING = false }: DEBUGGINGSectionProps) {
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
          disabled={!DEBUGGING}
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

function GuardianSection({ register, errors }: SectionProps) {
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
// TODO: Refactor the modal component
function CodeConfirmationModal({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const t = useTranslations('Common');
  // MOCK-UP DATA, REMOVE THE ENTIRE THING ONCE BE API ENDPOINTS ARE AVAILABLE
  // BEGIN ---
  const MOCK_VALID_CODE = '1234';

  function useConfirmEmailMutation() {
    const [isLoading, setIsLoading] = useState(false);

    const confirmEmail = async ({ email, code }: { email: string; code: string }) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);

      if (code !== MOCK_VALID_CODE) {
        const error = new Error('Invalid verification code') as Error & {
          data: { errors: { code: string } };
        };
        error.data = { errors: { code: 'invalidCode' } };
        throw error;
      }

      return { email, verified: true };
    };

    return [confirmEmail, { isLoading }] as const;
  }

  function useResendOTPMutation() {
    const [isLoading, setIsLoading] = useState(false);

    const resendOTP = async ({ email }: { email: string }) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
      return { email, code: MOCK_VALID_CODE };
    };

    return [resendOTP, { isLoading }] as const;
  }
  // END ---
  const [confirmEmail, { isLoading: isConfirming }] = useConfirmEmailMutation(); // mock-up function
  const [resendOTP] = useResendOTPMutation(); // mock-up function

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof EmailChangeValidation>>({
    resolver: zodResolver(EmailChangeValidation),
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleAuthCodeSubmit: SubmitHandler<
    z.infer<typeof EmailChangeValidation>
  > = async ({ verificationCode }) => {
    if (verificationCode.length !== 4) {
      return;
    }

    clearErrors('verificationCode');
    try {
      const result = await confirmEmail({ email, code: verificationCode });
      if (result) {
        onSuccess();
        pushSuccess(t('verified'));
      }
    } catch (_error: any) {
      setError('verificationCode', {
        type: 'unverified',
        message: t('invalid_verification_code'),
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP({ email });
      if (result) {
        console.log('succeeded'); // blank code, fill in with actual resent confirm codes
      }
    } catch (error: any) {
      if (error && error?.data && error?.data?.errors) {
        pushError(`Error: ${JSON.stringify(error?.data?.errors)}`);
        return;
      }
      pushError(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Modal.Backdrop />
      <Modal.Panel className="relative h-[872px] w-[480px] pt-14">
        <Button variant="ghost" type="button" onClick={onSuccess} className="absolute right-5 top-5">
          <X size={20} />
        </Button>
        <div className="flex flex-col items-center gap-2 px-6">
          <Image src="/assets/images/users/mail_icon.png" alt="A Mail Icon" width={112.5} height={99} />
          <h1 className="text-[28px] font-medium text-primary-50">{t('email_confirm_title')}</h1>
          <p className="text-center">
            {t.rich('email_confirm_description', {
              email,
              bold: chunks => <span className="font-extrabold">{chunks}</span>,
              br: () => <br />,
            })}
          </p>

          <Form
            onSubmit={handleSubmit(handleAuthCodeSubmit)}
            className="mt-6 flex w-full flex-col items-center justify-center gap-4"
          >
            <Form.Item>
              <Controller
                name="verificationCode"
                control={control}
                render={({ field }) => (
                  <>
                    <AuthCode
                      {...field}
                      length={4}
                      size="sm"
                      disabled={isConfirming}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value.length === 4) {
                          handleAuthCodeSubmit({ verificationCode: value });
                        }
                      }}
                      className="justify-center"
                    />
                    <Hint error className="mt-5 flex flex-col justify-center">
                      {errors.verificationCode?.message}
                      {errors.verificationCode?.message && (
                        <Link href="#" onClick={handleResendOTP} className="font-medium text-red-50 underline">
                          {t('resend_otp')}
                        </Link>
                      )}
                    </Hint>
                  </>
                )}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal.Panel>
    </>
  );
}

export default function PersonalInformation({ data }: IProfileFormProps) {
  const DEBUGGING = false; // SET THIS FLAG TO TRUE TO SEE THE REMAINING UI
  const t = useTranslations('Common');

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isOpenConfirmCodeModal, setIsOpenConfirmCodeModal] = useState(false);

  const dispatch = useAppDispatch();

  const {
    control,
    register,
    setValue,
    setError,
    watch,
    getValues,
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
      phoneNumber: data?.phoneNumber ?? null,
      address: data?.address ?? '',
      parentPhoneNumber: data?.parentPhoneNumber ?? null,
      parentEmail: data?.parentEmail ?? '',
    },
  });

  useEffect(() => {
    if (!DEBUGGING) {
      return;
    }
    const birthday = watch('birthday');
    if (birthday) {
      const age = calculateAge(birthday);
      const underGuard = age < 18;
      setValue('isUnderGuard', underGuard);

      if (!underGuard) {
        setValue('parentPhoneNumber', null, { shouldDirty: true, shouldValidate: true });
        setValue('parentEmail', '', { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [setValue, watch('birthday')]);

  const handleUpdate = handleSubmit(async (values: TProfileForm) => {
    try {
      const { isUnderGuard, ...profilePatch } = values;

      if (!isUnderGuard) {
        profilePatch.parentPhoneNumber = null;
        profilePatch.parentEmail = '';
      }

      if (!profilePatch.phoneNumber) {
        profilePatch.phoneNumber = null;
      }
      if (!profilePatch.parentPhoneNumber) {
        profilePatch.parentPhoneNumber = null;
      }

      const response = await updateProfile({ ...profilePatch, gender: { id: values.gender?.id } }).unwrap();
      dispatch(setUserInfo(response));
      pushSuccess(t('update_successfully'));
      setIsOpenConfirmCodeModal(true);
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

  function handleCloseCCModal() {
    setIsOpenConfirmCodeModal(false);
  }

  return (
    <>
      <Form className="flex w-full flex-col gap-3" onSubmit={handleUpdate}>
        <Name register={register} errors={errors} />
        <GenderBirthday control={control} />
        <AddressSection register={register} errors={errors} />
        <EmailSection register={register} errors={errors} DEBUGGING={DEBUGGING} />
        <PhoneNumberSection register={register} errors={errors} />
        {watch('isUnderGuard') && (
          <GuardianSection register={register} errors={errors} />
        )}
        <FormActionsSection
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          isDirty={isDirty}
          errors={errors}
          onCancel={reset}
        />
      </Form>

      {DEBUGGING && (
        <Modal open={isOpenConfirmCodeModal} onClose={handleCloseCCModal}>
          <CodeConfirmationModal email={getValues('email')} onSuccess={handleCloseCCModal} />
        </Modal>
      )}
    </>
  );
};
