'use client';

import { ArrowRight } from '@phosphor-icons/react';
import WavesurferPlayer from '@wavesurfer/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import Button from '@/components/button/Button';
import { HighlightContentBox } from '@/components/HighlightContentBox';
import { mergeClassnames } from '@/components/private/utils';
import { customMessage } from '@/utils/i18NRichTextUtils';

import type { HeroProps } from '.';

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
      className={mergeClassnames(
        'mx-auto flex w-full flex-col items-start justify-center px-2 py-0.5 gap-4 relative',
        'sm:px-[1.875rem] sm:py-6 lg:px-12 2xl:px-28 w-5/6',
      )}
      data-testid="hero-section"
    >
      <div className="flex w-[575px]">
        <h1 className="text-start text-[1.75rem] font-semibold capitalize text-slate-1000 sm:text-[5rem]">
          <p className="text-xs font-medium uppercase text-primary-10 lg:text-lg">
            {t('hero_title')}
          </p>
          {t('hero_motto')}
        </h1>
      </div>
      <div className="flex flex-row">
        <div className="pb-3">
          <div className="mb-6 flex w-full flex-col items-start justify-start gap-3 sm:gap-4 sm:px-0">
            <p className="w-1/2 text-start text-sm font-light text-slate-1000 opacity-50 sm:text-2xl">
              {t('hero_description')}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2.5">
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
        <div className="absolute right-28 top-48 mt-8 w-[40%]">
          <div className=" flex flex-col items-center justify-center">
            <p className="absolute left-2 top-20 h-12 max-w-64 px-2 text-center text-sm font-normal text-slate-1000 lg:px-0 lg:text-left xl:top-12">
              {t.rich('hero_message_1', {
                important: customMessage('font-bold'),
              })}
            </p>
            <p className="absolute right-12 top-8 h-12 max-w-64 text-center text-sm font-normal text-slate-1000 lg:text-right xl:top-12">
              {t.rich('hero_message_2', {
                important: customMessage('font-bold'),
              })}
            </p>
            <Image
              alt="Hero artwork"
              src="/assets/images/fs-hero-artwork.png"
              priority
              width={748}
              height={511}
              className="h-[32rem] w-[46.75rem] object-contain"
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
            <HighlightContentBox className="absolute bottom-[5.1875rem] lg:left-0 2xl:left-[10%]">
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
                'flex flex-col justify-center absolute right-0 2xl:right-[10%] bottom-2 rounded-lg px-2 px-5 py-3',
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
                  className="h-8 w-8 cursor-pointer object-cover object-center"
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
      </div>
    </section>
  );
};

export default HeroDesktop;
