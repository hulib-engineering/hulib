import React, { useRef } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Image from 'next/image';
import Link from 'next/link';
import { XIcon } from '@phosphor-icons/react';
import type { AuthCodeRef } from '@/components/core/authCode/private/types';
import Modal from '@/components/Modal';
import AuthCode from '@/components/core/authCode/AuthCode';
import Hint from '@/components/Hint';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';

import { EmailChangeValidation } from '@/validations/ProfileValidation';
import { useRequestOTPMutation, useVerifyNewEmailMutation } from '@/libs/services/modules/auth';

type OTPProps = {
  email: string;
  onSuccess: () => void;
  id: string | number;
};

export default function CodeConfirmationModal({ email, onSuccess, id }: OTPProps) {
  const t = useTranslations('Common');

  // const [verifyNewEmail, { isLoading, error }] = useVerifyNewEmailMutation();
  const [verifyNewEmail, { isLoading: isConfirming }] = useVerifyNewEmailMutation();
  const [resendOTP] = useRequestOTPMutation(); // mock-up function

  const authCodeRef = useRef<AuthCodeRef | null>(null);

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
    setFocus,
  } = useForm<z.infer<typeof EmailChangeValidation>>({
    resolver: zodResolver(EmailChangeValidation),
    defaultValues: {
      verificationCode: '',
    },
  });

  setFocus('verificationCode');

  const handleAuthCodeSubmit: SubmitHandler<
    z.infer<typeof EmailChangeValidation>
  > = async ({ verificationCode }) => {
    if (verificationCode.length !== 4) {
      return;
    }

    clearErrors('verificationCode');
    try {
      await verifyNewEmail({ id, newEmail: email, otp: verificationCode }).unwrap();
      onSuccess();
      pushSuccess(t('verified'));
    } catch (_error: any) {
      // Note: Consider adding more specific error warnings (400, 401, 402, 429, network error)
      setError('verificationCode', {
        type: 'unverified',
        message: t('invalid_verification_code'),
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      authCodeRef.current?.clear();
      setFocus('verificationCode');
      await resendOTP({ id, email, digits: 4 }).unwrap();
      pushSuccess(t('verified_resent_OTP'));
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
          <XIcon size={20} />
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
                      ref={(instance) => {
                        authCodeRef.current = instance;
                        field.ref(instance);
                      }}
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
