'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { mergeClassnames } from '@/components/private/utils';

type ISponsorItemCardProps = {
  name: string;
  type: string;
  logoUrl: string;
};

const SponsorItemCard = ({ name, type, logoUrl }: ISponsorItemCardProps) => {
  const toolTipText = type.split('-')[0];

  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <div className="relative">
      <div
        className={mergeClassnames(
          'invisible z-10 absolute right-0 -top-9 rounded bg-[#212121] py-1 px-2 opacity-0',
          'capitalize text-center text-xs font-medium text-white tracking-tight',
          isCardHovered && 'visible opacity-100',
        )}
      >
        {toolTipText}
      </div>
      <div
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        className="relative overflow-hidden rounded-xl bg-white p-8 transition-all duration-300 ease-out hover:shadow-[0px_8px_24px_#0061ef14]"
      >
        <Image
          width={52}
          height={52}
          alt={`Chip ${toolTipText}`}
          src={`/assets/images/chips/${type}.svg`}
          className="absolute right-0 top-0"
        />
        <div className="flex flex-col items-center justify-center">
          <Image
            className="h-16 w-auto object-contain object-center"
            src={logoUrl}
            alt={name}
            height={64}
            width={360}
          />
        </div>
      </div>
    </div>
  );
};

const SponsorList = [
  {
    name: 'VEO',
    logoUrl: '/assets/images/sponsors/VEO.png',
    type: 'legal-sponsor',
  },
  {
    name: 'WEC',
    logoUrl: '/assets/images/sponsors/WEC.png',
    type: 'diamond-sponsor',
  },
  {
    name: 'Blue Magnolia',
    logoUrl: '/assets/images/sponsors/BM.png',
    type: 'gold-sponsor',
  },
  {
    name: 'YBOX',
    logoUrl: '/assets/images/sponsors/YB.png',
    type: 'media-sponsor',
  },
  {
    name: 'Edu2Review',
    logoUrl: '/assets/images/sponsors/E2R.png',
    type: 'media-sponsor',
  },
  {
    name: 'I Can Connect',
    logoUrl: '/assets/images/sponsors/ICC.png',
    type: 'silver-sponsor',
  },
  {
    name: 'Eduwing Global',
    logoUrl: '/assets/images/sponsors/EWG.png',
    type: 'scholarship-sponsor',
  },
  {
    name: 'InterGreat',
    logoUrl: '/assets/images/sponsors/IG.png',
    type: 'scholarship-sponsor',
  },
  {
    name: 'JCI',
    logoUrl: '/assets/images/sponsors/JCI.png',
    type: 'media-sponsor',
  },
];

const Sponsors = () => {
  const t = useTranslations('Index');

  return (
    <section className="flex w-full flex-col items-center gap-12 overflow-hidden pt-3 text-slate-1000 md:py-[5.625rem]">
      <h1 className="text-center text-[1.75rem] font-semibold uppercase text-[#002254] md:text-5xl">
        {t('sponsors_title')}
      </h1>
      <div className="flex flex-col gap-6 px-4 sm:w-3/4 lg:px-10 2xl:px-[5.625rem]">
        <div className="inline-flex flex-wrap items-center justify-center gap-6">
          {SponsorList.map((sponsor, index) => (
            <SponsorItemCard key={index} {...sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
