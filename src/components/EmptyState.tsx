import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { mergeClassnames } from '@/components/core/private/utils';

type EmptyStateProps = {
  title?: string;
  className?: string;
};

export default function EmptyState({ title, className }: EmptyStateProps) {
  const t = useTranslations('Common');

  return (
    <div
      className={mergeClassnames(
        'flex min-h-[calc(100vh-410px)] flex-col items-center justify-center gap-y-3 px-4 md:gap-y-6 md:py-12',
        className,
      )}
    >
      <Image
        src="/assets/images/empty.png"
        width={400}
        height={400}
        alt=""
        className="h-[200px] w-[200px] md:h-[400px] md:w-[400px]"
      />
      <h1 className="text-center text-xl font-bold md:text-2xl">
        {title ?? t('no_results_found')}
      </h1>
    </div>
  );
}
