'use client';

import { ArrowRight } from '@phosphor-icons/react';
import WavesurferPlayer from '@wavesurfer/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import type { HeroProps } from '.';
import Button from '@/components/core/button/Button';
import { HighlightContentBox } from '@/components/HighlightContentBox';
import { mergeClassnames } from '@/components/core/private/utils';
import { customMessage } from '@/utils/i18NRichTextUtils';

const HeroMobile = (props: HeroProps) => {
  const {
    StarIcons,
    VectorIcons,
    onReady,
    isPlaying,
    onPlayPause,
    setIsPlaying,
  } = props;
  const locale = useLocale();
  const t = useTranslations('Index');

  return (
    <section
      className="flex w-full flex-col items-center justify-center"
      data-testid="hero-section"
    >
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-3 text-center">
        <p className="text-xs font-medium uppercase text-lp-primary-blue">
          {t('hero_title')}
        </p>
        <h1 className="px-4 text-[1.75rem] font-semibold capitalize text-[#002254]">
          {t('hero_motto')}
        </h1>
        <p className="text-sm font-light text-[#002254] opacity-50">
          {t('hero_description')}
        </p>
        <div className="flex items-center justify-center">
          <Button
            as="a"
            rel="noopener noreferrer"
            target="_blank"
            href={
              locale === 'en'
                ? '/assets/docs/project-proposal-eng.pdf'
                : '/assets/docs/project-proposal-vi.pdf'
            }
            size="lg"
            iconRight={<ArrowRight />}
          >
            {t('hero_call_to_action')}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2 text-center text-xs leading-none text-[#002254]">
            <p>
              {t.rich('hero_message_1', {
                important: customMessage('font-bold'),
              })}
            </p>
            <p>
              {t.rich('hero_message_2', {
                important: customMessage('font-bold'),
              })}
            </p>
          </div>
          <div className="relative flex w-full flex-col items-center justify-center">
            <Image
              alt="Hero artwork"
              src="/assets/images/fs-hero-artwork.png"
              priority
              width={276}
              height={188}
              className="aspect-[5/4] h-auto w-3/4 object-cover object-center"
            />
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
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 px-4">
          <HighlightContentBox className="px-2 py-3">
            <div className="flex flex-col gap-3">
              <Image
                width={64}
                height={16}
                src="/assets/images/mentors.svg"
                alt="Mentor avatars"
                className="h-4 w-16 object-fill object-center"
              />
              <p className="text-xs font-black text-[#24272C]">
                {t.rich('hero_mentor_quantity', {
                  normal: customMessage('font-normal'),
                })}
              </p>
            </div>
          </HighlightContentBox>
          <div className="relative flex flex-col justify-center rounded-lg bg-white/30 px-2 py-3 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] backdrop-blur-[35.63px]">
            <div className="flex items-center gap-2 overflow-hidden">
              <Image
                onClick={onPlayPause}
                width={32}
                height={32}
                alt="Play icon"
                src={`/assets/images/icons/${
                  isPlaying ? 'pause' : 'play'
                }-circle.svg`}
                className="size-8 cursor-pointer object-cover object-center"
              />
              <WavesurferPlayer
                height={32}
                width={171}
                progressColor="#002254"
                waveColor="#8E98A8"
                url="/assets/media/hero-song.mp3"
                onReady={onReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMobile;
