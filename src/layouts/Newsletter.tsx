import { useTranslations } from 'next-intl';
import React from 'react';

import { NewsletterForm } from '@/components/NewsletterForm';
import { mergeClassnames } from '@/components/core/private/utils';

const Newsletter = () => {
  const t = useTranslations('Index');

  return (
    <section
      id="newsletter"
      className={mergeClassnames(
        'relative mt-8 flex w-full flex-col items-center justify-center px-4 py-3 text-slate-1000',
        'sm:mx-auto sm:mt-2 sm:w-3/4 lg:px-10 2xl:px-[5.625rem] 2xl:py-[6.25rem]',
      )}
    >
      <div className="w-full rounded-3xl border-4 border-solid border-white bg-white/50 py-6 backdrop-blur-[100px] sm:max-w-7xl lg:py-[5.625rem]">
        <div className="mx-auto mb-3 w-full px-4 text-center sm:mb-8 2xl:max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase text-lp-primary-blue sm:mb-6 sm:text-lg">
            {t('newsletter_title')}
          </p>
          <h1 className="text-[1.75rem] font-semibold capitalize sm:text-5xl sm:font-bold">
            {t('newsletter_description')}
          </h1>
        </div>
        <div className="w-full px-3 pt-4 2xl:px-[17.5rem]">
          <NewsletterForm />
        </div>
      </div>
      <div
        className={mergeClassnames(
          'absolute -right-7 -top-7 h-[9.375rem] w-[9.375rem] 2xl:left-[80%] 2xl:-top-[10%] 2xl:h-[18.75rem] 2xl:w-[18.75rem]',
          'animate-move-up rounded-full bg-gradient-to-r from-[#6D96FF] to-[#FF9CEF] opacity-35 blur-[6.25rem]',
        )}
      />
      <div
        className={mergeClassnames(
          'absolute -bottom-7 -left-7 h-[9.375rem] w-[9.375rem] 2xl:-bottom-[10%] 2xl:left-0 2xl:h-[18.75rem] 2xl:w-[18.75rem]',
          'animate-move-down rounded-full bg-gradient-to-r from-[#6D96FF] to-[#FF9CEF] opacity-30 blur-[6.25rem]',
        )}
      />
    </section>
  );
};

export default Newsletter;
