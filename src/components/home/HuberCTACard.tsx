'use client';

import Image from 'next/image';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { useMobile } from '@/libs/hooks';

type HuberCTACardProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  onClick?: () => void;
};

export default function HuberCTACard({
  title,
  subtitle,
  buttonLabel,
  onClick,
}: HuberCTACardProps) {
  const isMobile = useMobile();

  const textBaseClass = 'text-center text-primary-10';

  const titleClassName = mergeClassnames(
    textBaseClass,
    'font-medium',
    isMobile ? 'text-2xl leading-8' : 'text-[36px] leading-[44px]',
  );

  const subtitleClassName = mergeClassnames(
    textBaseClass,
    isMobile ? 'text-sm' : 'text-left text-xl font-medium leading-7',
  );

  return (
    <div className="flex w-[366px] flex-col gap-5 rounded-[32px] bg-white p-5 ring-8 ring-white/60 backdrop-blur-[50px] md:p-8 xxl:w-[536px]">
      {isMobile ? (
        <h5 className={titleClassName}>{title}</h5>
      ) : (
        <h2 className={titleClassName}>{title}</h2>
      )}

      {isMobile ? (
        <p className={subtitleClassName}>{subtitle}</p>
      ) : (
        <h6 className={subtitleClassName}>{subtitle}</h6>
      )}

      <Button
        iconLeft={(
          <Image
            src="/assets/icons/huber-icon.svg"
            width={20}
            height={20}
            alt="Meeting system ava"
            className="rounded-lg object-cover object-center"
          />
        )}
        className="w-full rounded-full"
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
