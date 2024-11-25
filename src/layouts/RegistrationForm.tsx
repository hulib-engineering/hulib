'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckFat, Eye, X } from '@phosphor-icons/react';
import { omit } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import PasswordChecklist from 'react-password-checklist';
import type { z } from 'zod';

import AuthCode from '@/components/authCode/AuthCode';
import Button from '@/components/button/Button';
import Dropdown from '@/components/dropdown/Dropdown';
import Form from '@/components/form/Form';
import Hint from '@/components/Hint';
import { Logo } from '@/components/Logo';
import MenuItem from '@/components/menuItem/MenuItem';
import Modal from '@/components/Modal';
import SocialButton from '@/components/SocialButton';
import TextInput from '@/components/textInput/TextInput';
import { useRouter } from '@/libs/i18nNavigation';
import {
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

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const Step1Form = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof RegisterStep1Validation>) => void;
}) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<z.infer<typeof RegisterStep1Validation>>({
    resolver: zodResolver(RegisterStep1Validation),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleFormSubmit}>
      <Form.Item>
        <TextInput
          id="email"
          type="email"
          label="Email"
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
          label="Password"
          showPasswordText={<Eye />}
          {...register('password')}
        />
      </Form.Item>
      <Form.Item>
        <TextInput
          id="confirmPassword"
          type="password"
          label="Re-enter password"
          showPasswordText={<Eye />}
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
        >
          Continue
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
  // const [currentGender, setCurrentGender] = useState({ value: '', label: '' });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof RegisterStep2Validation>>({
    resolver: zodResolver(RegisterStep2Validation),
    defaultValues: {
      fullname: '',
      gender: 'other',
      birthday: '',
    },
  });

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleFormSubmit}>
      <Form.Item>
        <TextInput
          id="fullname"
          type="text"
          label="Fullname"
          placeholder="John Doe"
          {...register('fullname')}
          isError={!!errors.fullname}
          hintText={errors.fullname?.message}
        />
      </Form.Item>
      <Form.Item className="z-10 flex gap-2">
        <fieldset className="w-full">
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="gender"
                value={field.value}
                onChange={field.onChange}
              >
                {({ open }) => (
                  <>
                    <Dropdown.Select open={open} label="Gender">
                      {field.value}
                    </Dropdown.Select>
                    <Dropdown.Options>
                      {genders.map((gender) => (
                        <Dropdown.Option
                          key={gender.value}
                          value={gender.value}
                        >
                          {({ selected, active }) => (
                            <MenuItem isActive={active} isSelected={selected}>
                              <MenuItem.Title>{gender.label}</MenuItem.Title>
                            </MenuItem>
                          )}
                        </Dropdown.Option>
                      ))}
                    </Dropdown.Options>
                    {!!errors.gender && (
                      <Dropdown.Hint>{errors.gender.message}</Dropdown.Hint>
                    )}
                  </>
                )}
              </Dropdown>
            )}
          />
        </fieldset>
        <fieldset className="w-full">
          <TextInput
            type="date"
            label="Date of birth"
            {...register('birthday')}
            isError={!!errors.birthday}
            hintText={errors.birthday?.message}
          />
        </fieldset>
      </Form.Item>
      <Form.Item className="py-4">
        <Button
          type="submit"
          value="Submit"
          className="w-full"
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </Form.Item>
      <p className="text-center">
        By creating an account, I accept{' '}
        <Link
          href="#term-of-use"
          className="font-medium leading-tight tracking-tight text-primary-50 underline"
        >
          Terms of Use
        </Link>{' '}
        and{' '}
        <Link
          href="#privacy-policy"
          className="font-medium leading-tight tracking-tight text-primary-50 underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </Form>
  );
};

const Step3Form = ({
  id,
  email,
  code,
}: {
  id: number;
  email: string;
  code: string;
}) => {
  const [confirmEmail] = useConfirmEmailMutation();
  const [resendOTP] = useResendOTPMutation();

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

  const [isOpen, setIsOpen] = useState(true);
  const [currentVerificationCode, setCurrentVerificationCode] = useState(code);

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
          await confirmEmail({ id });
        } catch (error: any) {
          console.log(error);
        }
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP({ id }).unwrap();
      if (result.data) {
        setCurrentVerificationCode(result.data.code);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const closeModal = () => setIsOpen(false);

  return (
    <Modal open={isOpen} onClose={closeModal} className="z-50">
      <Modal.Backdrop className="bg-[#F3F4F6] bg-opacity-100 bg-gradient-to-bl from-white/20 to-[#0442bf33] bg-blend-multiply" />
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
                {email}
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
      <Modal.Backdrop className="bg-[#F3F4F6] bg-opacity-100 bg-gradient-to-bl from-white/20 to-[#F9DA6C33] bg-blend-multiply" />
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
        gender: { id: 3 },
      }).unwrap();
      if (result) {
        setVerificationData(result);
        setStep((prevState) => prevState + 1);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  if (step === 2) {
    return <Step3Form {...verificationData} />;
  }

  if (step === 3) {
    return <Step4Form />;
  }

  return (
    <>
      <div className="text-center text-neutral-10">
        <h2 className="text-4xl font-medium leading-[44px] tracking-[-2%]">
          Create an account
        </h2>
        <p className="tracking-[0.5%]">Step {step + 1} of 3</p>
      </div>
      {step === 0 ? (
        <Step1Form onSubmit={handleStep1FormSubmit} />
      ) : (
        <Step2Form onSubmit={handleStep2FormSubmit} />
      )}
      <div className="inline-flex h-6 items-center justify-start gap-2 self-stretch">
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
        <div className="text-center tracking-tight text-neutral-30">
          Or sign up with
        </div>
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <SocialButton iconUrl={FacebookIcon} />
        <SocialButton iconUrl={GoogleIcon} />
      </div>
      <div className="inline-flex items-center justify-center gap-4 py-3">
        <div className="tracking-tight text-neutral-30">
          Already have an account?
        </div>
        <Link href="login" className="font-medium text-primary-50 underline">
          Log in
        </Link>
      </div>
    </>
  );
};

export { RegistrationForm };
