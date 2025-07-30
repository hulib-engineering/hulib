'use client';

import { Book } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Button from '../button/Button';

const ShortDescription = () => {
  const t = useTranslations('Home');
  const router = useRouter();
  return (
    <>
      <div className="relative mt-8 size-full">
        <Image
          src="/assets/images/short-description.png"
          alt="Short Description Banner"
          width={0}
          height={0}
          sizes="100vw"
          className="hidden h-48 w-full md:block md:h-full"
        />

        <Image
          src="/assets/images/bottom-banner.svg"
          alt="Short Description Banner"
          width={0}
          height={0}
          sizes="100vw"
          className="h-[320px] w-full object-cover md:hidden"
        />

        <div className="absolute bottom-4 z-20 w-full px-[16px] md:bottom-12 md:pl-[32px]">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-[28px] font-medium leading-[1.6rem] text-primary-10 md:text-4xl md:leading-[2.75rem]">
              {t('short_descriptions.title')}
            </h3>
            <Button
              className="flex h-11 w-full text-base font-medium md:w-[20.4375rem]"
              iconLeft={<Book />}
              onClick={() => router.push('/huber-registration')}
            >
              {t('short_descriptions.btn')}
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[24px] bg-[#F3F4F6]"> </div>
    </>
  );
};

export default ShortDescription;
