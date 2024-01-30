'use client';

import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/navigation';
// import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
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

  // const router = useRouter();
  //
  const t = useTranslations('Index');

  const handleSubscribe = handleSubmit(async (data) => {
    try {
      await emailjs.send(
        Env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        Env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          to: data.email,
        },
        Env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
      alert(
        '🚀 Your message is on its way! Thanks for reaching out 😊. Have a fantastic day ahead! 🌟',
      );
    } catch (error: any) {
      console.log(error);
      alert(`Error: ${error.message}`);
    } finally {
      // setIsLoading(false);
    }
    // await sendMail(data.email, 'Subscribe Newsletter', 'Hello new subscriber!');
    // if (props.edit) {
    //   await fetch(`/api/guestbook`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       id: props.id,
    //       ...data,
    //     }),
    //   });
    //
    //   props.handleStopEditing();
    // } else {
    //   await fetch(`/api/guestbook`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });
    //
    //   reset();
    // }
    // router.refresh();
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
            className="w-full p-[0_0.75rem] leading-tight text-slate-1000 outline-none autofill:bg-white lg:p-3"
            {...register('email')}
          />
        </label>
        {/* {errors.email?.message && ( */}
        {/*  <div className="my-2 text-xs italic text-red-500"> */}
        {/*    {errors.email?.message} */}
        {/*  </div> */}
        {/* )} */}
      </div>
      <div className="hidden lg:flex">
        <button
          type="submit"
          className={mergeClassnames(
            'rounded-full bg-primary px-8 py-3 text-base font-medium text-white uppercase',
            'transition-all duration-300 ease-out hover:bg-primary-hover',
          )}
        >
          subscribe
        </button>
      </div>
      <div className="flex lg:hidden">
        <button type="submit">
          <Image
            width={40}
            height={40}
            alt="go"
            src="/assets/images/icons/arrow-right-2.svg"
          />
        </button>
      </div>
    </form>
  );
};

export { NewsletterForm };
