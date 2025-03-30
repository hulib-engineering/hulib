'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import { Chip } from '@/components/chip/Chip';
import { mergeClassnames } from '@/components/private/utils';
import TextInput from '@/components/textInput/TextInput';
import { auth } from '@/libs/firebase';
import { PhoneNumberValidation } from '@/validations/RegisterValidation';

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
  const {
    register,
    watch,
    setValue,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<z.infer<typeof PhoneNumberValidation>>({
    mode: 'onChange',
    resolver: zodResolver(PhoneNumberValidation),
    defaultValues: {
      isVerified: false,
      parentPhoneNumber: '',
      verificationCode: '',
      verificationId: '',
    },
  });

  const [confirmationResponse, setConfirmationResponse] =
    useState<ConfirmationResult | null>(null);
  const [verifiedNumber, setVerifiedNumber] = useState(value);

  useEffect(() => {
    if (isError) {
      setError('parentPhoneNumber', {
        type: 'unverified',
        message: hintText || 'Invalid',
      });
    }
  }, [isError, hintText]);

  useEffect(() => {
    const handleOtp = async (otp: string) => {
      try {
        if (!confirmationResponse) {
          throw new Error('No confirmation response available.');
        }
        const credential = PhoneAuthProvider.credential(
          confirmationResponse.verificationId,
          otp,
        );
        await signInWithCredential(auth, credential);
        setVerifiedNumber(watch('parentPhoneNumber'));
        setValue('isVerified', true);
      } catch (error) {
        console.error('OTP Verification Error:', error);
        setError('verificationCode', {
          type: 'unverified',
          message: 'Invalid OTP. Please try again.',
        });
      }
    };

    if (watch('verificationCode').length === 6) {
      handleOtp(watch('verificationCode'));
    }
  }, [watch('verificationCode'), confirmationResponse]);

  useEffect(() => {
    if (verifiedNumber !== '') {
      onChange(verifiedNumber);
    }
  }, [verifiedNumber]);

  const setupRecaptcha = () => {
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'verify-button', {
        size: 'invisible',
      });
      // @ts-ignore

      window.recaptchaVerifier.render();
    }
  };

  const handleSendCode = async () => {
    try {
      setupRecaptcha(); // Setup Recaptcha
      const phoneNumber = watch('parentPhoneNumber').trim();
      if (!phoneNumber) throw new Error('Phone number is required');

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,

        // @ts-ignore
        window.recaptchaVerifier,
      );

      setConfirmationResponse(confirmationResult);
      console.log('🔥 OTP sent:', confirmationResult);
    } catch (error: any) {
      console.error('🚨 Firebase Error:', error.message);
      alert(`Firebase Error: ${error.message}`);
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
      <fieldset className="w-2/3">
        <TextInput
          type="tel"
          label="Parent's phone number"
          placeholder="+84xxxxxxxxxx"
          {...register('parentPhoneNumber')}
          isError={!!errors.parentPhoneNumber}
          hintText={errors.parentPhoneNumber?.message}
          disabled={watch('isVerified')}
        />
      </fieldset>
      <fieldset className="w-1/3">
        {!confirmationResponse ||
        (watch('parentPhoneNumber') !== verifiedNumber &&
          verifiedNumber !== '') ? (
          <Button
            id="verify-button"
            type="button"
            className="w-full"
            disabled={
              !dirtyFields.parentPhoneNumber || !!errors.parentPhoneNumber
            }
            onClick={handleSendCode}
          >
            Verify
          </Button>
        ) : !watch('isVerified') ? (
          <TextInput
            type="number"
            label="Verification code"
            {...register('verificationCode')}
            isError={!!errors.verificationCode}
            hintText={errors.verificationCode?.message}
          />
        ) : (
          <Chip
            className={mergeClassnames(
              'rounded-full border border-[#C2C6CF] bg-green-98 text-green-50',
              'hover:bg-green-98 hover:text-green-50',
            )}
          >
            Verified
          </Chip>
        )}
      </fieldset>
    </div>
  );
};

export { VerifiedPhoneNumberInput };
