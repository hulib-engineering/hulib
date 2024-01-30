import { useTranslations } from 'next-intl';
import React from 'react';

import { NewsletterForm } from '@/components/NewsletterForm';

const Newsletter = () => {
  const t = useTranslations('Index');

  return (
    <section
      id="newsletter"
      className="relative flex w-full flex-col items-center justify-center py-8 text-slate-1000 lg:px-[20.625rem] lg:py-[6.25rem]"
    >
      <div className=" w-[23rem] rounded-[2rem] border-4 border-solid border-white bg-[rgba(255,_255,_255,_0.50)] py-9 backdrop-blur-[50px] lg:w-full lg:py-[5.625rem]">
        <div className="mb-4 px-[1rem] text-center lg:mb-8 lg:px-[17.5rem]">
          <p className="mb-6 text-[0.75rem] font-semibold uppercase text-primary lg:text-lg">
            {t('newsletter_title')}
          </p>
          <h1 className="text-[1.75rem] font-bold capitalize lg:text-5xl">
            {t('newsletter_description')}
          </h1>
        </div>
        <div className="w-full px-2 pt-4 lg:px-[17.5rem]">
          <NewsletterForm />
        </div>
      </div>
      {/* <div className="absolute right-8 top-[-16rem]">
        <GradientSplash />
      </div>
      <div className="absolute bottom-[-16rem] left-8">
        <GradientSplash />
      </div> */}
    </section>
  );
};

export default Newsletter;
