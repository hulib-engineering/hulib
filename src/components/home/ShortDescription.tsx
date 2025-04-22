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
    <div className="relative mt-8 h-full w-full">
      <Image
        src="/assets/images/short-description.png"
        alt="Short Description Banner"
        width={0}
        height={0}
        sizes="100vw"
        className="h-[12rem] w-full md:h-full"
      />
      <div className="absolute bottom-8 left-8">
        <div className="flex flex-col items-start justify-center gap-2">
          <p className="text-xs font-medium leading-[1.125rem] text-primary-10 md:text-xl md:leading-7">
            {t('short_descriptions.description')}
          </p>
          <h3 className="text-base font-medium leading-[2.9375rem] text-primary-10 md:text-[2.25rem] md:leading-[2.75rem]">
            {t('short_descriptions.title')}
          </h3>
          <Button
            className="h-11 w-[20.4375rem] text-base font-medium"
            iconLeft={<Book />}
            onClick={() => router.push('huber-registration')}
          >
            {t('short_descriptions.btn')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShortDescription;
