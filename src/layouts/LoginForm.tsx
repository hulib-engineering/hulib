'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import Input from '@/components/core/input/Input';
import LabelComponent from '@/components/Label';
import SocialButton from '@/components/SocialButton';
import type { EmailLoginResponse } from '@/libs/services/modules/auth';
import { useLoginAsManagerMutation } from '@/libs/services/modules/auth';
import GoogleIcon from '@/public/assets/icons/google-icon.svg';
import { LoginValidation } from '@/validations/LoginValidation';
import TextInput from '@/components/core/textInput-v1/TextInput';

const LoginForm = () => {
  const t = useTranslations('SignIn');

  const { update } = useSession();

  const [login] = useLoginAsManagerMutation();

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit = async (data: z.infer<typeof LoginValidation>) => {
    try {
      const result = (await login({
        email: data.email,
        password: data.password,
      }).unwrap()) as EmailLoginResponse;

      if (result) {
        Cookies.set('refresh_token', result.refreshToken, {
          expires: result.tokenExpires,
        });
        // save access token to session
        await update({ accessToken: result.token });
        await signIn('credentials', {
          id: result.user.id,
          accessToken: result.token,
          role: result.user.role.name,
          callbackUrl: `${window.location.origin}/home`,
        });
      }
    } catch {
      setError('password', {
        type: 'custom',
        message: 'Incorrect password, please try again.',
      });
    }
  };

  return (
    <>
      <div className="text-center text-neutral-10">
        <h2 className="text-2xl font-medium leading-8 tracking-[-2%] xl:text-4xl xl:leading-[44px]">
          {t('welcome_back')}
        </h2>
        <p className="text-sm tracking-[0.5%] xl:text-base">{t('login_to_hulib')}</p>
      </div>
      <Form
        form={form}
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Form.Field
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <TextInput
              type="email"
              id="email"
              label={t('email')}
              placeholder="hulib@gmail.com"
              isError={!!error}
              hintText={error?.message}
              {...field}
            />
          )}
        />
        <Form.Field
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <TextInput
              type="password"
              id="password"
              label={t('password')}
              isError={!!error}
              hintText={error?.message}
              {...field}
            />
          )}
        />
        <Form.Item className="flex items-center justify-between">
          <fieldset className="flex items-center gap-1">
            <Input type="checkbox" id="remember" readOnly={false} />
            <LabelComponent
              htmlFor="remember"
              type="checkbox"
              className="cursor-pointer py-0 text-xs leading-[14px] text-neutral-30"
            >
              {t('keep_logged_in')}
            </LabelComponent>
          </fieldset>
          <Link href="forgot-password" className="text-xs leading-[14px] text-primary-50">
            {t('forgot_password')}
          </Link>
        </Form.Item>
        <Form.Item className="py-4">
          <Button
            type="submit"
            value="Submit"
            className="w-full"
            disabled={isSubmitting}
            animation={isSubmitting && 'progress'}
          >
            {t('log_in')}
          </Button>
        </Form.Item>
      </Form>
      <div className="inline-flex h-6 items-center justify-start gap-2 self-stretch">
        <div className="h-px w-full shrink grow basis-0 bg-neutral-90" />
        <div className="text-center tracking-tight text-neutral-30">{t('or')}</div>
        <div className="h-px w-full shrink grow basis-0 bg-neutral-90" />
      </div>
      <div className="w-full">
        <SocialButton
          iconUrl={GoogleIcon}
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/home' })}
        >
          {`${t('log_in')} ${t('with_gg')}`}
        </SocialButton>
        {/* <SocialButton
          iconUrl={FacebookIcon}
          className="w-full"
          onClick={() => signIn('facebook', { callbackUrl: '/home' })}
        >
          Log in with Facebook
        </SocialButton> */}
      </div>
      <div className="inline-flex items-center justify-center gap-4 py-3">
        <div className="tracking-tight text-neutral-30">{t('new_user')}</div>
        <Link href="register" className="font-medium text-primary-50 underline">
          {t('register')}
        </Link>
      </div>
    </>
  );
};

export const LoginWithSession = () => (
  <SessionProvider>
    <LoginForm />
  </SessionProvider>
);
