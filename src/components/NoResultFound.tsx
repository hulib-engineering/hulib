import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { mergeClassnames } from '@/components/core/private/utils';

export default function NoResultFound({ className = '' }: { className?: string }) {
  const t = useTranslations('Research');

  return (
    <div
      className={mergeClassnames(
        'flex flex-col items-center gap-6 justify-center px-8 py-16 text-center',
        className,
      )}
    >
      <Image
        src="/assets/images/no-results-found.png"
        alt="No results found illustration"
        width={482}
        height={378}
        className="h-auto w-full max-w-xs"
        priority
      />
      <div className="flex flex-col gap-2 text-primary-10">
        <h5 className="text-2xl font-bold leading-tight">
          {t('no_result.title')}
        </h5>
        <p>{t('no_result.description')}</p>
      </div>

    </div>
  );
}
