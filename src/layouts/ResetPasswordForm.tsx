'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import TextInput from '@/components/textInput/TextInput';
import { ResetPasswordValidation } from '@/validations/ResetPasswordValidation';

const ResetPasswordSuccess = () => {
  const router = useRouter();

  return (
    <>
      <div className="text-center text-neutral-10">
        <div className="flex items-center gap-x-2 py-2">
          <Image
            src="/assets/icons/GreenCheck-circle.svg"
            width={45.5}
            height={35}
            alt="arrow-icon"
            loading="lazy"
          />
          <h2 className="text-[2rem] font-medium leading-[40px] tracking-[-2%]">
            All done!
          </h2>
        </div>

        <p className="mt-4 text-[1rem] font-normal leading-6 tracking-[0.5%] text-neutral-40">
          Your password has been reset
        </p>
      </div>
      <Button
        type="button"
        className="w-fit px-4 py-3 text-white"
        onClick={() => router.push('/login')}
      >
        Login now
        <Image
          src="/assets/icons/ChevronRight-icon.svg"
          width={10}
          height={10}
          alt="arrow-icon"
          loading="lazy"
        />
      </Button>
    </>
  );
};

const ResetPasswordForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
  });

  const [submitSuccess, setSubmitSuccess] = React.useState<boolean>(false);

  const onHandleSubmit = handleSubmit(() => {
    if (isValid) {
      setSubmitSuccess(true);
    }
  });

  if (submitSuccess) return <ResetPasswordSuccess />;

  return (
    <>
      <div className="text-center text-neutral-10">
        <h2 className="text-[2rem] font-medium leading-[40px] tracking-[-2%]">
          Reset the password
        </h2>
      </div>
      <Form className="flex w-full flex-col gap-4">
        <Form.Item>
          <TextInput
            id="password"
            type="password"
            label="Password"
            showPasswordText={<Eye />}
            {...register('password')}
          />
          {errors.password?.message ? (
            <p className="mt-2 text-xs font-normal leading-[14px] text-red-50">
              {errors.password?.message}
            </p>
          ) : (
            <p className="mt-2 text-xs font-normal leading-[14px] text-neutral-60">
              Password must have at least 8 characters
            </p>
          )}
        </Form.Item>
        <Form.Item>
          <TextInput
            id="confirmPassword"
            type="password"
            label="Re-enter password"
            showPasswordText={<Eye />}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword?.message && (
            <p className="mt-2 text-xs font-normal leading-[14px] text-red-50">
              {errors.confirmPassword?.message}
            </p>
          )}
        </Form.Item>
        <Form.Item className="py-4">
          <Button
            type="submit"
            value="Submit"
            className="w-full"
            onClick={onHandleSubmit}
          >
            Reset password
          </Button>
        </Form.Item>
      </Form>

      <button
        type="button"
        className="flex items-center gap-x-2"
        onClick={() => router.push('/login')}
      >
        <Image
          src="/assets/icons/ArrowLeft-icon.svg"
          width={24}
          height={24}
          alt="arrow-icon"
          loading="lazy"
        />
        <span className="text-[1rem] font-medium leading-5 text-primary-50 underline">
          Back to login
        </span>
      </button>
    </>
  );
};

export { ResetPasswordForm };
