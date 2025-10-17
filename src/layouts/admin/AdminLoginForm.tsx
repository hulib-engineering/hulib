'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useLocale } from 'next-intl';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import type { EmailLoginResponse } from '@/libs/services/modules/auth';
import { useLoginAsManagerMutation } from '@/libs/services/modules/auth';
import { LoginValidation } from '@/validations/LoginValidation';
import TextInput from '@/components/core/textInput-v1/TextInput';

export default function AdminLoginForm() {
  const { update } = useSession();

  const currentLocale = useLocale();

  const [login] = useLoginAsManagerMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // const [rememberMe, setRememberMe] = useState(false);

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
          redirect: true,
          // Use relative URL (important!)
          callbackUrl: `/${currentLocale}/admin/home`,
        });
      }
    } catch (error: any) {
      setError('password', {
        type: 'custom',
        message: 'Incorrect password, please try again.',
      });
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary-90">
      <div className="mx-auto flex h-fit w-full max-w-md flex-col items-center gap-8 rounded-[20px] bg-blue-98 p-6">
        <Image src="/assets/images/logo.svg" alt="logo" width={192} height={56} />
        <div className="flex flex-col text-center text-neutral-10">
          <h2 className="text-4xl font-medium leading-[44px]">Welcome back!</h2>
          <p>Log in to Admin account</p>
        </div>
        <Form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Form.Item>
            <TextInput
              id="email"
              type="email"
              label="Email address"
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
              {...register('password')}
              isError={!!errors.password}
              hintText={errors.password?.message}
            />
          </Form.Item>
          {/* <Form.Item className="flex justify-between"> */}
          {/*  <fieldset className="flex items-center gap-2"> */}
          {/*    <Checkbox */}
          {/*      id="remember-me" */}
          {/*      checked={rememberMe} */}
          {/*      onChange={e => setRememberMe(e.target.checked)} */}
          {/*    /> */}
          {/*    <Label */}
          {/*      htmlFor="remember" */}
          {/*      type="checkbox" */}
          {/*      className="cursor-pointer text-sm leading-4 text-neutral-30" */}
          {/*    > */}
          {/*      Keep me logged in */}
          {/*    </Label> */}
          {/*  </fieldset> */}
          {/* </Form.Item> */}
          <Form.Item className="py-4">
            <Button
              type="submit"
              size="lg"
              fullWidth
              value="Submit"
              disabled={isSubmitting}
              animation={isSubmitting && 'progress'}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
