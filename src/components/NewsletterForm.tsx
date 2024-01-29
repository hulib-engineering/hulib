'use client';

import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { z } from 'zod';

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

  // const router = useRouter();
  //
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
      toast.success(
        '🚀 Your message is on its way! Thanks for reaching out 😊',
      );
      // alert(
      //   '🚀 Your message is on its way! Thanks for reaching out 😊. Have a fantastic day ahead! 🌟',
      // );
    } catch (error: any) {
      console.log(error);
      toast.error(`Error: ${error.message}`);
      // alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form
      autoComplete="off"
      className={mergeClassnames(
        'relative flex w-full flex-row items-center justify-between rounded-[3.125rem] bg-white p-3',
        errors.email?.message && 'border border-solid border-red-500',
      )}
      onSubmit={handleSubscribe}
    >
      <div className="grow">
        <label className="text-xl" htmlFor="email">
          <input
            autoComplete="off"
            id="email"
            placeholder={t('newsletter_form_email_placeholder')}
            className="w-full p-3 leading-tight text-slate-1000 outline-none autofill:bg-white"
            {...register('email')}
          />
        </label>
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={mergeClassnames(
            'rounded-full bg-primary px-8 py-3 text-base font-medium text-white uppercase',
            'transition-all duration-300 ease-out hover:bg-primary-hover disabled:bg-opacity-75',
          )}
        >
          subscribe
        </button>
      </div>
    </form>
  );
};

export { NewsletterForm };
