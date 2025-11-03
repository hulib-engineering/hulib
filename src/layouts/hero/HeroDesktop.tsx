'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Image from 'next/image';
import WavesurferPlayer from '@wavesurfer/react';
import { useLocale, useTranslations } from 'next-intl';

import React from 'react';
import type { HeroProps } from '.';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { HighlightContentBox } from '@/components/HighlightContentBox';
import { customMessage } from '@/utils/i18NRichTextUtils';

const HeroDesktop = (props: HeroProps) => {
  const {
    StarIcons,
    VectorIcons,
    onReady,
    isPlaying,
    onPlayPause,
    setIsPlaying,
  } = props;
  const t = useTranslations('Index');
  const locale = useLocale();
  return (
    <section
      className="relative mx-auto w-full max-w-screen-xl pb-[5.625rem] pt-20"
      data-testid="hero-section"
    >
      <div className="flex w-full flex-col gap-10 pb-3">
        <div className="flex flex-col gap-4">
          <p className="w-5/12 text-xs font-medium uppercase text-lp-primary-blue lg:text-lg">
            {t('hero_title')}
          </p>
          <div className="relative w-full">
            <div className="flex w-5/12 flex-col gap-4">
              <h1 className="text-[1.75rem] font-bold leading-[98px] text-[#002254] sm:text-[5rem]">
                {t('hero_motto')}
              </h1>
              <p className="text-sm font-light text-slate-1000 opacity-50 sm:text-2xl">
                {t('hero_description')}
              </p>
            </div>
            <div className="absolute right-0 top-1/2 w-7/12 -translate-y-1/2">
              <div className="relative">
                <p className="absolute left-2 top-20 h-12 max-w-64 px-2 text-center text-sm font-normal text-slate-1000 lg:px-0 lg:text-left xl:-top-8 xl:left-[72px]">
                  {t.rich('hero_message_1', {
                    important: customMessage('font-bold'),
                  })}
                </p>
                <p className="absolute right-12 top-8 h-12 max-w-64 text-center text-sm font-normal text-slate-1000 lg:text-right xl:-top-8 xl:right-20">
                  {t.rich('hero_message_2', {
                    important: customMessage('font-bold'),
                  })}
                </p>
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
                {StarIcons.map((each, index) => (
                  <Image
                    key={index}
                    width={each.size}
                    height={each.size}
                    alt={`Hero star ${index}`}
                    src={`/assets/images/icons/stars/star-${index}.svg`}
                    className={mergeClassnames(
                      'absolute shrink-0 -translate-y-1/2',
                      each.xPosition && each.xPosition,
                      each.yPosition && each.yPosition,
                    )}
                  />
                ))}
                <HighlightContentBox className="absolute bottom-14 xl:left-[73px]">
                  <div className="relative flex flex-col items-start gap-1">
                    <div className="hidden lg:block">
                      <Image
                        width={72}
                        height={24}
                        src="/assets/images/mentors.svg"
                        alt="Mentor avatars"
                        className="h-6 w-[4.5rem] object-fill object-center"
                      />
                    </div>
                    <div className="block lg:hidden">
                      <Image
                        width={64}
                        height={16}
                        src="/assets/images/mentors.svg"
                        alt="Mentor avatars"
                        className="h-4 w-16 object-fill object-center"
                      />
                    </div>
                    <p className="text-xs font-black text-slate-1000 lg:text-base">
                      {t.rich('hero_mentor_quantity', {
                        normal: customMessage('font-normal'),
                      })}
                    </p>
                  </div>
                </HighlightContentBox>
                <div
                  className={mergeClassnames(
                    'flex flex-col justify-center absolute xl:left-[428px] bottom-1.5 rounded-lg px-2 py-3',
                    'bg-white/30 lg:bg-gray-150 lg:bg-opacity-50 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] backdrop-blur-[35.63px] lg:backdrop-blur-[5px]',
                  )}
                >
                  <div className="hidden items-center gap-2 overflow-x-hidden sm:flex">
                    <Image
                      onClick={onPlayPause}
                      width={56}
                      height={56}
                      alt="Play icon"
                      src={`/assets/images/icons/${
                        isPlaying ? 'pause' : 'play'
                      }-circle.svg`}
                      className="cursor-pointer"
                    />
                    <WavesurferPlayer
                      height={40}
                      width={240}
                      progressColor="#002254"
                      waveColor="#8E98A8"
                      url="/assets/media/hero-song.mp3"
                      onReady={onReady}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-hidden sm:hidden">
                    <Image
                      onClick={onPlayPause}
                      width={32}
                      height={32}
                      alt="Play icon"
                      src={`/assets/images/icons/${
                        isPlaying ? 'pause' : 'play'
                      }-circle.png`}
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
                <Image
                  alt="Hero artwork"
                  src="/assets/images/hero-artwork.png"
                  priority
                  width={748}
                  height={511}
                  className="h-[32rem] w-[46.75rem] object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
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
          className="!size-fit rounded-full bg-lp-primary-blue px-6 py-4 text-xl uppercase leading-7 hover:bg-primary-hover"
          iconRight={<ArrowRight weight="bold" className="text-2xl" />}
        >
          {t('hero_call_to_action')}
        </Button>
      </div>
    </section>
  );
};

export default HeroDesktop;
