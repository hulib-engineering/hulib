'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';
import Label from '@/components/Label';
import SocialButton from '@/components/SocialButton';
import TextInput from '@/components/textInput/TextInput';
import type { EmailLoginResponse } from '@/libs/services/modules/auth';
import { useLoginAsManagerMutation } from '@/libs/services/modules/auth';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import GoogleIcon from '@/public/assets/icons/google-icon.svg';
import { LoginValidation } from '@/validations/LoginValidation';

const LoginForm = () => {
  const { update } = useSession();

  const [login] = useLoginAsManagerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
          callbackUrl: `${window.location.origin}/profile`,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <SessionProvider>
      <div className="text-center text-neutral-10">
        <h2 className="text-4xl font-medium leading-[44px] tracking-[-2%]">
          Welcome Back
        </h2>
        <p className="tracking-[0.5%]">Login to your Hulib account</p>
      </div>
      <Form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Form.Item>
          <TextInput
            id="email"
            type="email"
            label="Phone number or email address"
            placeholder="hulib@gmail.com"
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
            isError={!!errors.password}
            hintText={errors.password?.message}
          />
        </Form.Item>
        <Form.Item className="flex justify-between">
          <fieldset className="flex items-center gap-2">
            <Input type="checkbox" id="remember" readOnly={false} />
            <Label
              htmlFor="remember"
              type="checkbox"
              className="cursor-pointer pb-0 pt-1 text-neutral-30"
            >
              Keep me logged in
            </Label>
          </fieldset>
          <Link href="forgot-password" className="text-primary-50">
            Forgot password?
          </Link>
        </Form.Item>
        <Form.Item className="py-4">
          <Button
            type="submit"
            value="Submit"
            className="w-full"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      <div className="inline-flex h-6 items-center justify-start gap-2 self-stretch">
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
        <div className="text-center tracking-tight text-neutral-30">Or</div>
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
      </div>
      <div className="w-full space-y-2">
        <SocialButton
          iconUrl={GoogleIcon}
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
        >
          Log in with Google
        </SocialButton>
        <SocialButton
          iconUrl={FacebookIcon}
          className="w-full"
          onClick={() => signIn('facebook', { callbackUrl: '/profile' })}
        >
          Log in with Facebook
        </SocialButton>
      </div>
      <div className="inline-flex items-center justify-center gap-4 py-3">
        <div className="tracking-tight text-neutral-30">New to Hulib?</div>
        <Link href="register" className="font-medium text-primary-50 underline">
          Create an account
        </Link>
      </div>
    </SessionProvider>
  );
};

export const LoginWithSession = () => (
  <SessionProvider>
    <LoginForm />
  </SessionProvider>
);

export { LoginForm };
