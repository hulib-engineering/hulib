import { useTranslations } from 'next-intl';
import React from 'react';

import { GradientSplash } from '@/components/GradientSplash';
import { NewsletterForm } from '@/components/NewsletterForm';

const Newsletter = () => {
  const t = useTranslations('Index');

  return (
    <section
      id="newsletter"
      className="relative flex w-full flex-col items-center justify-center px-[20.625rem] py-[6.25rem] text-slate-1000"
    >
      {/* add backdrop-blur can cause fps drop in low-end devices// backdrop-blur-[50px] */}
      <div className="rounded-[2rem] border-4 border-solid border-white bg-[rgba(255,_255,_255,_0.50)] py-[5.625rem]">
        <div className="mb-8 px-[17.5rem] text-center">
          <p className="mb-6 text-lg font-semibold uppercase text-primary">
            {t('newsletter_title')}
          </p>
          <h1 className="text-5xl font-bold capitalize">
            {t('newsletter_description')}
          </h1>
        </div>
        <div className="w-full px-[17.5rem] pt-4">
          <NewsletterForm />
        </div>
      </div>
      <div className="absolute right-8 top-[-16rem]">
        <GradientSplash />
      </div>
      <div className="absolute bottom-[-16rem] left-8">
        <GradientSplash />
      </div>
    </section>
  );
};

export default Newsletter;
