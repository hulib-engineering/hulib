'use client';

import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/private/utils';
import { Env } from '@/libs/Env.mjs';
import { NewsletterValidation } from '@/validations/NewsletterValidation';

const NewsletterForm = () => {
  const {
    handleSubmit,
    register,
    // reset,
    formState: { errors },
  } = useForm<z.infer<typeof NewsletterValidation>>({
    resolver: zodResolver(NewsletterValidation),
  });

  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('Index');

  const handleSubscribe = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await emailjs.send(
        Env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        Env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          to: data.email,
        },
        Env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
      pushSuccess('🚀 Your message is on its way! Thanks for reaching out 😊');
      // alert(
      //   '🚀 Your message is on its way! Thanks for reaching out 😊. Have a fantastic day ahead! 🌟',
      // );
    } catch (error: any) {
      // console.log(error);
      pushError(`Error: ${error.message}`);
      // toast.error(`Error: ${error.message}`);
      // alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form
      autoComplete="off"
      className={mergeClassnames(
        'relative flex w-full flex-row items-center justify-between rounded-[3.125rem] bg-white p-2 sm:p-3',
        errors.email?.message && 'border border-solid border-red-500',
      )}
      onSubmit={handleSubscribe}
    >
      <div className="grow">
        <label className="text-xs font-normal sm:text-xl" htmlFor="email">
          <input
            autoComplete="off"
            id="email"
            placeholder={t('newsletter_form_email_placeholder')}
            className="w-full p-[0_0.75rem] text-slate-1000 outline-none autofill:bg-white lg:p-3"
            {...register('email')}
          />
        </label>
      </div>
      <div className="hidden lg:flex">
        <Button disabled={isLoading} type="submit" className="uppercase">
          {t('newsletter_form_submit')}
        </Button>
      </div>
      <div className="flex lg:hidden">
        <button type="submit">
          <Image
            width={40}
            height={40}
            alt="Subscribe"
            src="/assets/images/icons/arrow-right-2.svg"
          />
        </button>
      </div>
    </form>
  );
};

export { NewsletterForm };
