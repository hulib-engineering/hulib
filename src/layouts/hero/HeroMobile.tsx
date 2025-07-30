'use client';

import { ArrowRight } from '@phosphor-icons/react';
import WavesurferPlayer from '@wavesurfer/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import type { HeroProps } from '.';
import Button from '@/components/button/Button';
import { HighlightContentBox } from '@/components/HighlightContentBox';
import { mergeClassnames } from '@/components/private/utils';
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
  const t = useTranslations('Index');
  const locale = useLocale();
  return (
    <section
      className={mergeClassnames(
        'max-w-xs p-4 gap-4 mx-auto flex w-full flex-col items-center justify-center py-8',
      )}
      data-testid="hero-section"
    >
      <div className="pb-3 lg:w-2/3 lg:max-w-screen-md">
        <div className="mb-6 flex w-full flex-col items-center justify-start gap-3 px-4 text-center sm:gap-4 sm:px-0">
          <p className="text-xs font-medium uppercase text-lp-primary-blue lg:text-lg">
            {t('hero_title')}
          </p>
          <h1 className="px-4 text-[1.75rem] font-semibold capitalize text-slate-1000 sm:text-[5rem]">
            {t('hero_motto')}
          </h1>
          <p className="text-sm font-light text-slate-1000 opacity-50 sm:text-2xl">
            {t('hero_description')}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <Button
            as="a"
            rel="noopener noreferrer"
            target="_blank"
            href={
              locale === 'en'
                ? '/assets/docs/project-proposal-eng.pdf'
                : '/assets/docs/project-proposal-vi.pdf'
            }
            className="rounded-full uppercase"
            iconRight={<ArrowRight color="#fff" />}
          >
            {t('hero_call_to_action')}
          </Button>
        </div>
      </div>
      <div className="relative mt-8 w-full">
        <p className="relative h-12 px-2 text-center text-base font-normal text-slate-1000 lg:absolute lg:-top-10 lg:left-0 lg:max-w-64 lg:px-0 lg:text-left 2xl:top-0">
          {t.rich('hero_message_1', {
            important: customMessage('font-bold'),
          })}
        </p>
        <p className="relative h-12 text-center text-base font-normal text-slate-1000 lg:absolute lg:-top-12 lg:right-0 lg:max-w-64 lg:text-right 2xl:top-0">
          {t.rich('hero_message_2', {
            important: customMessage('font-bold'),
          })}
        </p>
        <div className="hidden items-center justify-center lg:flex lg:flex-col">
          <Image
            alt="Hero artwork"
            src="/assets/images/fs-hero-artwork.png"
            priority
            width={748}
            height={511}
            className="h-[32rem] w-[46.75rem] object-contain"
          />
        </div>
        <div className="mb-3 flex w-full flex-col items-center justify-center lg:hidden">
          <Image
            alt="Hero artwork"
            src="/assets/images/fs-hero-artwork.png"
            priority
            width={276}
            height={188}
            className="h-[11.75rem] w-[17.25rem] object-contain"
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
        <div className="grid grid-cols-2 gap-x-2 px-4 sm:px-0 lg:block">
          <HighlightContentBox className="relative lg:absolute lg:bottom-[4.1875rem] lg:left-0 2xl:left-[10%]">
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
              'flex flex-col justify-center relative lg:absolute lg:right-0 2xl:right-[10%] lg:bottom-2 rounded-lg lg:rounded-2xl px-2 lg:px-5 py-3',
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
                }-circle.png`}
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
        </div>
      </div>
    </section>
  );
};

export default HeroMobile;
