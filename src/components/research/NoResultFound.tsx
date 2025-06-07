import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface NoResultFoundProps {
  className?: string;
}

export default function NoResultFound({ className = '' }: NoResultFoundProps) {
  const t = useTranslations('Research');
  return (
    <div
      className={`flex flex-col items-center justify-center px-8 py-16 text-center ${className}`}
    >
      <div className="relative mb-8">
        <Image
          src="/assets/images/no-results-found.png"
          alt="No results found illustration"
          width={300}
          height={200}
          className="h-auto w-full max-w-xs"
          priority
        />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-primary-10">
        {t('no_result.title')}
      </h3>
      <p className="text-primaty-10 max-w-md"> {t('no_result.description')}</p>
    </div>
  );
}
