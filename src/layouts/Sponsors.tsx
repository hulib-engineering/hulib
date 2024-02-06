import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

const SponsorsLogo = [
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'MOMO', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsors-1.png' },
];
const Sponsors = () => {
  const t = useTranslations('Index');
  return (
    <section className="flex w-full flex-col items-center gap-12 overflow-hidden py-3 text-slate-1000 lg:py-[5.625rem]">
      <div className="flex  flex-col items-center self-stretch">
        <h1 className="text-center text-[1.75rem] font-semibold uppercase leading-7 lg:text-5xl lg:font-bold">
          {t('sponsors_title')}
        </h1>
      </div>
      <div className="group overflow-hidden whitespace-nowrap">
        <div className="inline-block min-w-fit max-w-screen-lg animate-slide overflow-hidden py-4 group-hover:[animation-play-state:paused]">
          {SponsorsLogo.map((each, index) => (
            <div key={index} className="mx-4 inline-block lg:mx-16">
              <Image
                alt={each.name}
                width={145}
                height={145}
                src={each.logoUrl}
              />
            </div>
          ))}
        </div>
        <div className="inline-block min-w-fit animate-slide overflow-hidden py-4 group-hover:[animation-play-state:paused]">
          {SponsorsLogo.map((each, index) => (
            <div key={index} className="mx-4 inline-block lg:mx-16">
              <Image
                alt={each.name}
                width={145}
                height={145}
                src={each.logoUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
