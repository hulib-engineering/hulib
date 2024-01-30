import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Logo, LogoSmall } from '@/components/Logo';
import { mergeClassnames } from '@/components/private/utils';

const Footer = () => {
  const t = useTranslations('Footer');

  const Links = [
    { content: t('privacy_policy'), url: '' },
    { content: t('term_of_service'), url: '' },
    { content: t('cookie_settings'), url: '' },
  ];

  return (
    <footer className="w-full border-t-[0.5px] border-t-[rgba(176,206,250,0.50)] py-4 lg:px-[20.625rem] lg:py-[5.625rem]">
      {/* <div className="flex w-full flex-col items-start justify-center gap-8"> */}
      <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="hidden lg:flex">
          <Logo />
        </div>
        <div className="flex lg:hidden">
          <LogoSmall />
        </div>
        <div className="flex flex-col-reverse items-center gap-8 lg:flex-row">
          <p className="text-sm font-normal leading-[1.375rem] text-[rgba(0,_87,_215,_0.50)]">
            {t('copyright')}
          </p>
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            {Links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={mergeClassnames(
                  'text-sm font-normal leading-[1.375rem] text-[rgba(0,_87,_215,_0.50)] underline transition duration-200 capitalize',
                  'hover:-translate-y-1',
                )}
              >
                {link.content}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}
    </footer>
  );
};

export default Footer;
