'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckFat, X } from '@phosphor-icons/react';
import { omit } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import PasswordChecklist from 'react-password-checklist';
import type { z } from 'zod';

import AuthCode from '@/components/authCode/AuthCode';
import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import Form from '@/components/form/Form';
import Hint from '@/components/Hint';
import { Logo } from '@/components/Logo';
import Modal from '@/components/Modal';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { ControlledSelect } from '@/components/Select';
import SocialButton from '@/components/SocialButton';
import TermOfUseModal from '@/components/TermOfUseModal';
import TextInput from '@/components/textInput-v1/TextInput';
import { VerifiedPhoneNumberInput } from '@/components/VerifiedPhoneNumberInput';
import { genders } from '@/libs/constants';
import { useRouter } from '@/libs/i18nNavigation';
import {
  useCheckEmailMutation,
  useConfirmEmailMutation,
  useRegisterMutation,
  useResendOTPMutation,
} from '@/libs/services/modules/auth';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import GoogleIcon from '@/public/assets/icons/google-icon.svg';
import {
  RegisterStep1Validation,
  RegisterStep2Validation,
  RegisterStep3Validation,
} from '@/validations/RegisterValidation';

const Step1Form = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof RegisterStep1Validation>) => void;
}) => {
  const [checkEmail] = useCheckEmailMutation();

  const t = useTranslations('SignUp');

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<z.infer<typeof RegisterStep1Validation>>({
    resolver: zodResolver(RegisterStep1Validation),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await checkEmail({ email: data.email }).unwrap();
      onSubmit(data);
    } catch (error: any) {
      if (error?.data?.errors?.email === 'emailAlreadyExists') {
        setError('email', {
          type: 'custom',
          message: 'Email already exists. Please use a different email',
        });
      } else {
        pushError(`Error: ${error.message}`);
      }
    }
  });

  return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleFormSubmit}>
      <Form.Item>
        <TextInput
          id="email"
          type="email"
          label={t('email')}
          placeholder="john@company.com"
          {...register('email')}
          isError={!!errors.email}
          hintText={errors.email?.message}
        />
      </Form.Item>
      <Form.Item>
        <TextInput
          id="password"
          type="password"
          label={t('password')}
          {...register('password')}
        />
      </Form.Item>
      <Form.Item>
        <TextInput
          id="confirmPassword"
          type="password"
          label={t('confirm_password')}
          {...register('confirmPassword')}
        />
      </Form.Item>
      {touchedFields.password && (
        <PasswordChecklist
          rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
          minLength={8}
          value={watch('password')}
          valueAgain={watch('confirmPassword')}
          iconComponents={{
            ValidIcon: (
              <CheckFat
                size={20}
                color="#46d51b"
                weight="fill"
                className="mr-2"
              />
            ),
            InvalidIcon: (
              <X size={20} color="#ee0538" weight="fill" className="mr-2" />
            ),
          }}
        />
      )}
      <Form.Item className="py-4">
        <Button
          type="submit"
          value="Submit"
          className="w-full"
          disabled={isSubmitting}
          animation={isSubmitting && 'progress'}
        >
          {t('continue')}
        </Button>
      </Form.Item>
    </Form>
  );
};

const Step2Form = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof RegisterStep2Validation>) => void;
}) => {
  const t = useTranslations('SignUp');

  const {
    control,
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof RegisterStep2Validation>>({
    resolver: zodResolver(RegisterStep2Validation),
    defaultValues: {
      isUnderGuard: false,
      fullname: '',
      gender: 3,
      birthday: '',
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalRef, setCurrentModalRef] = useState('');

  useEffect(() => {
    const today = new Date();
    const birthDate = new Date(watch('birthday'));
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    if (age < 18) {
      setValue('isUnderGuard', true);
    } else {
      setValue('isUnderGuard', false);
    }
  }, [watch('birthday')]);

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  const handleClick = (modalName: string) => {
    setIsModalOpen(true);
    setCurrentModalRef(modalName);
  };

  return (
    <>
      <Form className="flex w-full flex-col gap-4" onSubmit={handleFormSubmit}>
        <Form.Item>
          <TextInput
            id="fullname"
            type="text"
            label={t('fullname')}
            placeholder="John Doe"
            {...register('fullname')}
            isError={!!errors.fullname}
            hintText={errors.fullname?.message}
          />
        </Form.Item>
        <Form.Item className="z-10 flex gap-2">
          <fieldset className="w-full">
            <ControlledSelect
              name="gender"
              control={control}
              label={t('gender')}
              options={genders}
            />
          </fieldset>
          <fieldset className="w-full">
            <TextInput
              type="date"
              label={t('birthday')}
              {...register('birthday')}
              isError={!!errors.birthday}
              hintText={errors.birthday?.message}
            />
          </fieldset>
        </Form.Item>
        {watch('isUnderGuard') && (
          <Form.Item>
            <VerifiedPhoneNumberInput
              value=""
              onChange={(value) => setValue('parentPhoneNumber', value)}
            />
          </Form.Item>
        )}
        <Form.Item className="py-4">
          <Button
            type="submit"
            value="Submit"
            className="w-full"
            disabled={isSubmitting}
            animation={isSubmitting && 'progress'}
          >
            {t('register')}
          </Button>
        </Form.Item>
        <p className="text-center">
          {`${t('accept_pp_and_tac.first')} `}
          <button
            type="button"
            onClick={() => handleClick('term_of_service')}
            className="font-medium leading-tight tracking-tight text-primary-50 underline"
          >
            Terms of Use
          </button>
          {` ${t('accept_pp_and_tac.second')} `}
          <button
            type="button"
            onClick={() => handleClick('privacy_policy')}
            className="font-medium leading-tight tracking-tight text-primary-50 underline"
          >
            Privacy Policy
          </button>
          .
        </p>
      </Form>

      {currentModalRef === 'privacy_policy' && (
        <PrivacyPolicyModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {currentModalRef === 'term_of_service' && (
        <TermOfUseModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

type IStep3FormProps = {
  id: number;
  email: string;
  code: string;
  onSuccess: () => void;
};

const Step3Form = (props: IStep3FormProps) => {
  const [confirmEmail] = useConfirmEmailMutation();
  const [resendOTP] = useResendOTPMutation();

  const router = useRouter();

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterStep3Validation>>({
    resolver: zodResolver(RegisterStep3Validation),
    defaultValues: {
      verificationCode: '',
    },
  });

  const [currentVerificationCode, setCurrentVerificationCode] = useState(
    props.code,
  );

  const handleAuthCodeSubmit: SubmitHandler<
    z.infer<typeof RegisterStep3Validation>
  > = async ({ verificationCode }) => {
    if (verificationCode.length === 6) {
      if (verificationCode !== currentVerificationCode) {
        setError('verificationCode', {
          type: 'unverified',
          message: 'The verification code is not correct, please re - enter',
        });
      } else {
        clearErrors('verificationCode');
        try {
          const result = await confirmEmail({ id: props.id });
          if (result && !result.error) {
            props.onSuccess();
          }
        } catch (error: any) {
          pushError(`Error: ${error.message}`);
        }
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP({ id: props.id }).unwrap();
      if (result) {
        setCurrentVerificationCode(result.code);
      }
    } catch (error: any) {
      if (error && error?.data && error?.data?.errors) {
        pushError(`Error: ${JSON.stringify(error?.data?.errors)}`);
        return;
      }
      pushError(`Error: ${error.message}`);
    }
  };

  const handleNavigateToLogin = () => router.push('/auth/login');

  return (
    <Modal
      open
      onClose={handleNavigateToLogin}
      disableClosingTrigger
      className="z-50"
    >
      <Modal.Backdrop className="bg-neutral-variant-98 bg-opacity-100 bg-gradient-to-bl from-white/20 to-[#0442bf]/20 bg-blend-multiply" />
      <Modal.Panel className="flex max-w-xl flex-col items-center gap-12 p-8">
        <Logo />
        <div className="flex flex-col gap-4 text-center text-neutral-10">
          <h2 className="text-4xl font-medium leading-[44px] tracking-[-2%]">
            Enter verification code
          </h2>
          <p className="tracking-[0.5%]">Step 3 of 3</p>
          <p className="tracking-[0.5%]">
            It’s almost done. please enter the 6-digit verification code we just
            sent to{' '}
            <span>
              <Link
                href="https://mail.google.com/mail/u/1/#inbox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-50 no-underline"
              >
                {props.email}
              </Link>
            </span>
          </p>
        </div>
        <Form
          onSubmit={handleSubmit(handleAuthCodeSubmit)}
          className="flex w-full flex-col items-center justify-center gap-4"
        >
          <Form.Item>
            <Controller
              name="verificationCode"
              control={control}
              render={({ field }) => (
                <>
                  <AuthCode
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      handleAuthCodeSubmit({ verificationCode: value });
                    }}
                    className="justify-center"
                  />
                  <Hint error className="mt-3">
                    {errors.verificationCode?.message}
                  </Hint>
                </>
              )}
            />
          </Form.Item>
        </Form>
        <div className="flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center self-stretch">
            <div className="tracking-tight text-neutral-40">
              Haven’t receive the email?
            </div>
            <Button
              variant="ghost"
              className="leading-[18px] underline"
              onClick={handleResendOTP}
            >
              Resend
            </Button>
          </div>
          <div className="inline-flex items-center justify-center self-stretch">
            <div className="tracking-tight text-neutral-40">
              If you need help, contact us via email
            </div>
            <Button
              as="a"
              href="#?"
              variant="ghost"
              className="leading-[18px] underline"
            >
              Hulib@gmail.com
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

const Step4Form = () => {
  const router = useRouter();

  const handleNavigateToLogin = () => router.push('/auth/login');

  return (
    <Modal open onClose={handleNavigateToLogin} className="z-50">
      <Modal.Backdrop className="bg-neutral-variant-98 bg-opacity-100 bg-gradient-to-bl from-white/20 to-[#F9DA6C]/20 bg-blend-multiply" />
      <Modal.Panel className="flex max-w-xl flex-col items-center gap-12 bg-transparent p-8 shadow-none">
        <div className="flex flex-row items-center justify-center gap-4 py-2">
          <h2 className="text-right text-4xl font-medium leading-tight text-neutral-10">
            Welcome to
          </h2>
          <Logo />
        </div>
        <Image
          alt="Success illustration"
          src="/assets/images/success-illus.svg"
          priority
          width={250}
          height={200}
          className="mx-auto object-contain"
        />
        <div className="w-full">
          <Button className="mx-auto w-3/4" onClick={handleNavigateToLogin}>
            Get started
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

const RegistrationForm = () => {
  const [register] = useRegisterMutation();

  const t = useTranslations('SignUp');

  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] =
    useState<z.infer<typeof RegisterStep1Validation>>();
  const [verificationData, setVerificationData] = useState<{
    id: number;
    email: string;
    code: string;
  }>({ id: 0, email: '', code: '' });

  const handleStep1FormSubmit = (
    data: z.infer<typeof RegisterStep1Validation>,
  ) => {
    setStep1Data(data);
    setStep((currentStep) => currentStep + 1);
  };

  const handleStep2FormSubmit = async (
    data: z.infer<typeof RegisterStep2Validation>,
  ) => {
    try {
      const result = await register({
        ...omit(step1Data, 'confirmPassword'),
        fullName: data.fullname,
        ...omit(data, 'fullname'),
        gender: { id: data.gender },
      }).unwrap();
      if (result) {
        setVerificationData(result);
        setStep((prevState) => prevState + 1);
      }
    } catch (error: any) {
      if (error && error?.data && error?.data?.errors) {
        if (error?.data?.errors?.email) {
          pushError(error?.data?.errors?.email);
          return;
        }
        pushError(`Error: ${JSON.stringify(error?.data?.errors)}`);
        return;
      }
      pushError(`Error: ${error.message}`);
    }
  };

  if (step === 2) {
    return (
      <Step3Form
        {...verificationData}
        onSuccess={() => setStep((prevState) => prevState + 1)}
      />
    );
  }

  if (step === 3) {
    return <Step4Form />;
  }

  return (
    <>
      <div className="text-center text-neutral-10">
        <h2 className="text-4xl font-medium leading-[44px] tracking-[-2%]">
          {t('title')}
        </h2>
        <p className="tracking-[0.5%]">{t('step', { step: step + 1 })}</p>
      </div>
      {step === 0 ? (
        <Step1Form onSubmit={handleStep1FormSubmit} />
      ) : (
        <Step2Form onSubmit={handleStep2FormSubmit} />
      )}
      <div className="inline-flex h-6 items-center justify-start gap-2 self-stretch">
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
        <div className="text-center tracking-tight text-neutral-30">
          {t('or_social_login')}
        </div>
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <SocialButton
          iconUrl={FacebookIcon}
          onClick={() => signIn('facebook', { callbackUrl: '/profile' })}
        />
        <SocialButton
          iconUrl={GoogleIcon}
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
        />
      </div>
      <div className="inline-flex items-center justify-center gap-4 py-3">
        <div className="tracking-tight text-neutral-30">{t('registered')}</div>
        <Link href="login" className="font-medium text-primary-50 underline">
          {t('log_in')}
        </Link>
      </div>
    </>
  );
};

export { RegistrationForm };
