'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import TextInput from '@/components/textInput/TextInput';
import ConfirmChangePassword from '@/layouts/ConfirmChangePassword';
import { useChangePasswordMutation } from '@/libs/services/modules/auth';
import { ChangePasswordValidation } from '@/validations/ChangePasswordValidation';

const ChangePassword = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof ChangePasswordValidation>>({
    resolver: zodResolver(ChangePasswordValidation),
  });

  const [isOpen, setIsOpen] = useState(false);

  const onHandleClickChangeBtn = () => {
    if (isValid) {
      setIsOpen(!isOpen);
    }
  };

  const onHandleSubmit = handleSubmit((data) => {
    console.log('input success', data);
    setIsOpen(!isOpen);
    try {
      changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    } catch (error: any) {
      console.log(error);
    }
  });

  return (
    <div className="h-full bg-[#F9F9F9]">
      <button
        type="button"
        className="ml-[10%] flex cursor-pointer items-center gap-2 px-2 py-3 pt-10"
        onClick={() => router.back()}
      >
        <Image
          src="/assets/icons/ArrowLeft-icon.svg"
          width={24}
          height={24}
          alt="arrow-icon"
          loading="lazy"
        />
        <p className="text-base font-medium text-[#0442BF] underline">
          Back to Previous
        </p>
      </button>
      <div className="mx-auto mt-3 max-w-[600px] bg-white p-10">
        <h2 className="text-[2rem] font-medium leading-[40px] tracking-[-2%]">
          Change Your Password
        </h2>
        <Form
          className="mt-[60px] flex w-full flex-col items-center gap-4"
          onSubmit={handleSubmit(onHandleClickChangeBtn)}
        >
          <Form.Item>
            <TextInput
              {...register('oldPassword')}
              id="oldPassword"
              type="password"
              label="Old Password"
              showPasswordText={<Eye />}
              isError={!!errors.oldPassword}
              hintText={
                errors.oldPassword?.message ??
                'Password must have at least 8 characters'
              }
            />
          </Form.Item>
          <Form.Item>
            <TextInput
              {...register('newPassword')}
              id="newPassword"
              type="password"
              label="New Password"
              showPasswordText={<Eye />}
              isError={!!errors.newPassword}
              hintText={
                errors.newPassword?.message ??
                'Password must have at least 8 characters'
              }
            />
          </Form.Item>
          <Form.Item>
            <TextInput
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              label="Re-enter New Password"
              showPasswordText={<Eye />}
              isError={!!errors.confirmPassword}
              hintText={errors.confirmPassword?.message}
            />
          </Form.Item>
          <Form.Item className="py-4">
            <Button type="submit" value="Submit" className="w-full">
              Change
            </Button>
          </Form.Item>
          <a
            className="cursor-pointer text-[1rem] font-medium leading-5 text-[#0442BF] underline"
            href="/auth/forgot-password"
          >
            Forgot Passwords?
          </a>
        </Form>
      </div>
      <ConfirmChangePassword
        open={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        onSuccess={onHandleSubmit}
      />
    </div>
  );
};

export default ChangePassword;
