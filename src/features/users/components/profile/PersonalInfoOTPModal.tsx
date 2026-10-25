import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Image from 'next/image';
import Link from 'next/link';
import { XIcon } from '@phosphor-icons/react';
import Modal from '@/components/Modal';
import AuthCode from '@/components/core/authCode/AuthCode';
import Hint from '@/components/Hint';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';

import { EmailChangeValidation } from '@/validations/ProfileValidation';

export default function CodeConfirmationModal({ email, onSuccess }: { email: string; onSuccess: () => void }) {
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

  // add to or modify this function once BE has the endpoint
  const handleResendOTP = async () => {
    try {
      const result = await resendOTP({ email });
      if (result) {
        pushSuccess(t('verified_resent_OTP'));
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
