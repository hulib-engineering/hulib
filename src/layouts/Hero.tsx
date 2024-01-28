'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { type ReactNode } from 'react';

import { mergeClassnames } from '@/components/private/utils';

const StarIcons = [
  { size: 16, yPosition: 'top-[6.1875rem]', xPosition: 'left-[17.6875rem]' },
  { size: 60, yPosition: 'bottom-[222px]', xPosition: 'right-[171px]' },
  { size: 30, yPosition: 'bottom-[115px]', xPosition: 'right-[123px]' },
];
const VectorIcons = [
  {
    width: 57,
    height: 75,
    yPosition: 'bottom-[141px]',
    xPosition: 'left-[13px]',
  },
  { width: 49, height: 65, yPosition: 'top-[67px]', xPosition: 'right-0' },
  {
    width: 36,
    height: 53,
    yPosition: 'top-[136px]',
    xPosition: 'left-[177px]',
  },
];

const customMessage = (font: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return <span className={font}>{chunks}</span>;
  };
};

const Hero = () => {
  const t = useTranslations('Index');

  return (
    <section className="flex flex-col items-center justify-center gap-32 self-stretch px-[20.625rem] pb-[5.625rem] pt-8">
      <div className="flex w-[48rem] flex-col items-center gap-6 pb-3">
        <div className="flex flex-col items-center gap-4 self-stretch">
          <p className="self-stretch text-center text-lg font-medium uppercase leading-[1.6875rem] text-primary">
            {t('hero_title')}
          </p>
          <h1 className="text-center text-[5rem] font-semibold capitalize leading-normal text-slate-1000">
            {t('hero_motto')}
          </h1>
          <p className="self-stretch text-center text-2xl font-light leading-9 text-slate-1000 opacity-50">
            {t('hero_description')}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <Link
            download
            href="/assets/docs/project-proposal.pdf"
            className="flex h-12 items-center justify-center gap-1 rounded-[2rem] bg-primary px-8 py-3"
          >
            <p className="text-base font-medium uppercase leading-6 text-white">
              {t('hero_call_to_action')}
            </p>
            <Image
              width={24}
              height={24}
              src="/assets/images/icons/download-icon.svg"
              alt="Download icon"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
      <div className="relative w-full">
        <div className="relative flex justify-center">
          <Image
            alt="Hero artwork"
            src="/assets/images/hero-artwork.png"
            // className="pr-5"
            priority
            width={748}
            height={511}
          />
        </div>
        {StarIcons.map((each, index) => (
          <Image
            key={index}
            width={each.size}
            height={each.size}
            alt={`Hero star ${index}`}
            src={`/assets/images/icons/stars/star-${index}.svg`}
            className={mergeClassnames(
              'absolute shrink-0',
              each.xPosition && each.xPosition,
              each.yPosition && each.yPosition,
            )}
          />
        ))}
        {VectorIcons.map((each, index) => (
          <Image
            key={index}
            width={each.width}
            height={each.height}
            alt={`Hero vector ${index}`}
            src={`/assets/images/icons/vectors/vector-${index}.svg`}
            className={mergeClassnames(
              'absolute shrink-0',
              each.xPosition && each.xPosition,
              each.yPosition && each.yPosition,
            )}
          />
        ))}
        <p className="absolute right-0 w-[13.5rem] text-right text-base font-normal leading-normal text-slate-1000">
          {t.rich('hero_message_2', {
            important: customMessage('font-bold'),
          })}
        </p>
        <p className="w-[17rem] text-base font-normal leading-normal text-slate-1000">
          {t.rich('hero_message_1', {
            important: customMessage('font-bold'),
          })}
        </p>
        <div
          className={mergeClassnames(
            'absolute right-[97px] top-[159px] rounded-2xl px-5 py-3',
            'bg-[#eaeaea4d] shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] backdrop-blur-[25px]',
          )}
        >
          <div className="flex items-center gap-2">
            <Image
              // onClick={() => console.log('clicked')}
              width={56}
              height={56}
              alt="Play icon"
              src="/assets/images/icons/play-circle.svg"
              className="cursor-pointer"
            />
            <Image
              width={164}
              height={46}
              src="/assets/images/soundwave.svg"
              alt="Soundwave"
            />
          </div>
        </div>
        <div className="absolute left-6 top-24 rounded-lg bg-[#ffffff4d] p-4 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] backdrop-blur-[20px]">
          <div className="relative flex flex-col items-start gap-1">
            <Image
              width={72}
              height={24}
              src="/assets/images/mentors.svg"
              alt="Mentor avatars"
            />
            <p className="text-base font-black leading-normal text-slate-1000">
              {t.rich('hero_mentor_quantity', {
                normal: customMessage('font-normal'),
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
