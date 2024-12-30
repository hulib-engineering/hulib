'use client';

import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import { publicRoutes } from '@/libs/constants';

const HeroV1 = () => {
  const router = useRouter();
  const t = useTranslations('Hero');

  return (
    <div
      className={mergeClassnames(
        'w-full px-2 py-0.5',
        'sm:px-[1.875rem] sm:py-6 lg:px-12 2xl:px-28',
      )}
    >
      <div className="mx-auto flex w-4/5  flex-row items-start gap-5">
        <div
          className="flex min-w-[600px] flex-col gap-4
        "
        >
          <p className="text-lg font-medium text-primary-10">{t('heading')}</p>
          <p
            className={mergeClassnames(
              'text-[80px] font-semibold leading-[98px] text-slate-1000',
            )}
          >
            {t('sub_heading')}
          </p>
          <p className="text-2xl font-light leading-9 text-slate-1000">
            {t('description')}
          </p>
          <Button
            size="lg"
            variant="fill"
            iconRight={<ArrowRight />}
            className="w-fit capitalize"
            onClick={() => router.push(publicRoutes.REGISTER)}
          >
            {t('register_now')}
          </Button>
        </div>
        <div className="relative w-1/2 self-end">
          <Image
            src="/assets/images/hero.svg"
            alt="hero-img"
            width={0}
            height={0}
            className="min-w-[600px] max-w-[600px]"
          />
          <div className="absolute bottom-[-26px] left-[-8px] flex flex-col gap-3 rounded-md bg-[rgba(255,255,255,0.3)] p-4 shadow-sm shadow-black/20 backdrop-blur-lg">
            <div className="flex flex-row items-center">
              {[0, 1, 2, 3, 4].map((item) => (
                <Image
                  src="/assets/images/avatar.svg"
                  width={24}
                  height={24}
                  className={`${item !== 0 && 'ml-[-10px]'}`}
                  alt="avatar"
                  key={item}
                />
              ))}
            </div>
            <p className="text-sm font-normal text-[#24272C]">
              <span className="font-medium">200+</span> Experienced Mentors
            </p>
          </div>
          <div className="absolute bottom-[50px] right-[-102px] flex flex-row items-center gap-2 rounded-md bg-[rgba(255,255,255,0.3)] px-6 py-4 shadow-sm shadow-black/20 backdrop-blur-lg">
            <div className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-white hover:opacity-70">
              <Image
                src="/assets/images/play-circle.svg"
                width={12.6}
                height={17.64}
                alt="play-circle"
              />
            </div>
            <Image
              src="/assets/images/waveform.svg"
              width={216.9}
              height={40.5}
              alt="waveform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroV1;
