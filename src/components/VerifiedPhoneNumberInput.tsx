'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import TextInput from '@/components/core/textInput/TextInput';
import { auth } from '@/libs/Firebase';
import { PhoneNumberValidation } from '@/validations/RegisterValidation';

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const VerifiedPhoneNumberInput = ({
  isError,
  hintText,
  value,
  onChange,
}: {
  isError?: boolean;
  hintText?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const t = useTranslations('VerifiedPhone');
  const {
    register,
    watch,
    setValue,
    setError,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(PhoneNumberValidation),
    defaultValues: {
      isVerified: false,
      parentPhoneNumber: '',
      verificationCode: '',
      verificationId: '',
    },
  });

  const [confirmationResponse, setConfirmationResponse]
    = useState<ConfirmationResult | null>(null);
  const [verifiedNumber, setVerifiedNumber] = useState(value);

  useEffect(() => {
    if (isError) {
      setError('parentPhoneNumber', {
        type: 'unverified',
        message: hintText || t('invalid'),
      });
    }
  }, [isError, hintText, setError, t]);

  useEffect(() => {
    const handleOtp = async (otp: string) => {
      try {
        if (!confirmationResponse) {
          throw new Error(t('no_confirmation'));
        }
        const credential = PhoneAuthProvider.credential(
          confirmationResponse.verificationId,
          otp,
        );
        await signInWithCredential(auth, credential);
        setVerifiedNumber(watch('parentPhoneNumber'));
        setValue('isVerified', true);
      } catch (error: any) {
        console.error('OTP Verification Error:', error);
        setError('verificationCode', {
          type: 'unverified',
          message: t('invalid_otp'),
        });
      }
    };

    if (watch('verificationCode').length === 6) {
      handleOtp(watch('verificationCode'));
    }
  }, [watch('verificationCode'), confirmationResponse, setError, setValue, t]);

  useEffect(() => {
    if (verifiedNumber !== '') {
      onChange(verifiedNumber);
    }
  }, [onChange, verifiedNumber]);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      { size: 'invisible' },
    );

    window.recaptchaVerifier.render();
  };

  const handleSendCode = async () => {
    try {
      setupRecaptcha(); // Setup Recaptcha
      const phoneNumber = watch('parentPhoneNumber').trim();
      if (!phoneNumber) {
        throw new Error(t('phone_required'));
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,

        // @ts-ignore
        window.recaptchaVerifier,
      );

      setConfirmationResponse(confirmationResult);
    } catch (error: any) {
      console.error('🚨 Firebase Error:', error.message);
    }
  };

  return (
    <div
      className={mergeClassnames(
        'flex items-end gap-2',
        !confirmationResponse && !!errors.parentPhoneNumber && 'items-center',
        confirmationResponse && watch('isVerified') && 'items-end',
        confirmationResponse && !watch('isVerified') && 'items-start',
      )}
    >
      <div id="recaptcha-container" className="sr-only" />
      <fieldset className="w-2/3">
        <TextInput
          type="tel"
          label={t('parent_phone')}
          placeholder="+84xxxxxxxxxx"
          {...register('parentPhoneNumber')}
          isError={!!errors.parentPhoneNumber}
          hintText={errors.parentPhoneNumber?.message}
          disabled={watch('isVerified')}
        />
      </fieldset>
      <fieldset className="w-1/3">
        {!confirmationResponse
        || (watch('parentPhoneNumber') !== verifiedNumber
          && verifiedNumber !== '')
          ? (
              <Button
                // id="verify-button"
                type="button"
                className="w-full"
                disabled={
                  !dirtyFields.parentPhoneNumber || !!errors.parentPhoneNumber
                }
                onClick={handleSendCode}
              >
                {t('verify')}
              </Button>
            )
          : !watch('isVerified')
              ? (
                  <TextInput
                    type="number"
                    label={t('verification_code')}
                    {...register('verificationCode')}
                    isError={!!errors.verificationCode}
                    hintText={errors.verificationCode?.message}
                  />
                )
              : (
                  <Chip
                    className={mergeClassnames(
                      'rounded-full border border-[#C2C6CF] bg-green-98 text-green-50',
                      'hover:bg-green-98 hover:text-green-50',
                    )}
                  >
                    {t('verified')}
                  </Chip>
                )}
      </fieldset>
    </div>
  );
};

export { VerifiedPhoneNumberInput };
