'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckFat, X } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordChecklist from 'react-password-checklist';
import type { z } from 'zod';

import Button from '@/components/core/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Form from '@/components/core/form/Form';
import Modal from '@/components/Modal';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { useChangePasswordMutation } from '@/libs/services/modules/auth';
import { ChangePasswordValidation } from '@/validations/ChangePasswordValidation';

export default function Index() {
  const router = useRouter();

  const t = useTranslations('Common');

  const [changePassword] = useChangePasswordMutation();

  const form = useForm<z.infer<typeof ChangePasswordValidation>>({
    resolver: zodResolver(ChangePasswordValidation),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, touchedFields },
  } = form;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const onHandleClickChangeBtn = () => {
    if (isValid) {
      setIsConfirmModalOpen(!isConfirmModalOpen);
    }
  };
  const handleSubmitChangingPassword = handleSubmit(async (data) => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
    try {
      await changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      pushSuccess(t('update_successfully'));
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    }
  });

  return (
    <div className="mx-auto my-12 max-w-[592px] rounded-[20px] bg-white px-4 py-8 lg:p-5">
      <div className="flex flex-col gap-5 lg:gap-[60px]">
        <h2 className="text-2xl font-medium leading-8 tracking-[-2%] text-black lg:text-4xl lg:leading-[44px]">
          Change Your Password
        </h2>
        <Form
          form={form}
          className="flex w-full flex-col items-center gap-5 lg:gap-[60px]"
          onSubmit={handleSubmit(onHandleClickChangeBtn)}
        >
          <div className="flex w-full flex-col gap-4 lg:gap-8">
            <Form.Field
              control={control}
              name="oldPassword"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  id="oldPassword"
                  type="password"
                  label="Old Password"
                  isError={!!error}
                  hintText={error?.message}
                  {...field}
                />
              )}
            />
            <Form.Field
              control={control}
              name="newPassword"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  id="newPassword"
                  type="password"
                  label="New Password"
                  isError={!!error}
                  hintText={error?.message}
                  {...field}
                />
              )}
            />
            <Form.Field
              control={control}
              name="confirmPassword"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  id="confirmPassword"
                  type="password"
                  label="Re-enter New Password"
                  isError={!!error}
                  hintText={error?.message}
                  {...field}
                />
              )}
            />
            {/* Password Requirements Checklist */}
            {touchedFields.newPassword && (
              <div className="w-full lg:-mt-6">
                <PasswordChecklist
                  rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                  minLength={8}
                  value={watch('newPassword')}
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
              </div>
            )}
          </div>
          <div className="flex w-full flex-col items-center gap-3">
            <Button size="lg" type="submit" value="Submit" fullWidth>
              Change
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="underline"
              fullWidth
              onClick={() => router.push('/auth/forgot-password')}
            >
              Forgot Passwords?
            </Button>
          </div>
        </Form>
      </div>

      {/* Confirm changing password modal */}
      <Modal open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl rounded-[20px] bg-[#F2F5F8] p-4 lg:p-12">
          <div className="flex flex-col items-center justify-center gap-5 lg:gap-8">
            <h4 className="text-center text-2xl font-medium leading-8 lg:text-[28px] lg:leading-9">
              Change Your Password
            </h4>
            <p className="text-center">
              Are you sure you want to change your password?
            </p>
            <div className="flex w-full flex-col items-center gap-3 lg:flex-row">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="md"
                fullWidth
                onClick={handleSubmitChangingPassword}
              >
                Change
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
}
