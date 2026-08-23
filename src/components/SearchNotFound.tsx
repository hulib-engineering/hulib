import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { mergeClassnames } from '@/components/core/private/utils';

export default function SearchNotFound({
  className = '',
}: {
  className?: string;
}) {
  const t = useTranslations('Research');

  return (
    <div
      className={mergeClassnames(
        'flex flex-col gap-8 items-center justify-center text-center',
        className,
      )}
    >
      <Image
        src="/assets/images/landing/search-no-found.svg"
        alt="Search not found illustration"
        width={400}
        height={400}
        className="size-80 lg:size-[400px]"
      />
      <p className="text-2xl font-bold leading-8 text-neutral-10">
        {t('search_not_found')}
      </p>
    </div>
  );
}
