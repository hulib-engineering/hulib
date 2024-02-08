import { useTranslations } from 'next-intl';
import React from 'react';

import { NewsletterForm } from '@/components/NewsletterForm';
import { mergeClassnames } from '@/components/private/utils';

const Newsletter = () => {
  const t = useTranslations('Index');

  return (
    <section
      id="newsletter"
      className="relative mt-8 flex w-full flex-col items-center justify-center px-4 py-3 text-slate-1000 sm:mt-0 lg:px-[20.625rem] lg:py-[6.25rem]"
    >
      <div className="w-full rounded-3xl border-4 border-solid border-white bg-white/50 py-6 backdrop-blur-[100px] sm:max-w-7xl lg:py-[5.625rem]">
        <div className="mb-3 px-4 text-center sm:mb-8 lg:px-[17.5rem]">
          <p className="mb-3 text-[0.75rem] font-semibold uppercase text-primary sm:mb-6 sm:text-lg">
            {t('newsletter_title')}
          </p>
          <h1 className="text-[1.75rem] font-semibold capitalize sm:text-5xl sm:font-bold">
            {t('newsletter_description')}
          </h1>
        </div>
        <div className="w-full px-3 pt-4 lg:px-[17.5rem]">
          <NewsletterForm />
        </div>
      </div>
      {/* <div className="md:right-8 md:top-[-16rem] hidden animate-move-up md:absolute"> */}
      {/*  <GradientSplash /> */}
      {/* </div> */}
      {/* <div className="md:bottom-[-16rem] md:left-8 hidden animate-move-down md:absolute"> */}
      {/*  <GradientSplash /> */}
      {/* </div> */}
      <div
        className={mergeClassnames(
          'absolute -left-7 -top-7 h-[9.375rem] w-[9.375rem] md:right-8 md:top-[-16rem] md:hidden md:h-[18.75rem] md:w-[18.75rem]',
          'animate-move-up rounded-full bg-gradient-to-r from-[#6D96FF] to-[#FF9CEF] opacity-30 blur-[200px]',
        )}
      />
      <div
        className={mergeClassnames(
          'absolute -bottom-7 -right-7 h-[9.375rem] w-[9.375rem] md:bottom-[-16rem] md:left-8 md:hidden md:h-[18.75rem] md:w-[18.75rem]',
          'animate-move-down rounded-full bg-gradient-to-r from-[#6D96FF] to-[#FF9CEF] opacity-30 blur-[200px]',
        )}
      />
    </section>
  );
};

export default Newsletter;
