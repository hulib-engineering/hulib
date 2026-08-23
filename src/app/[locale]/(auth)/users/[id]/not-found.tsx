import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('Common');
  return (
    <div className="flex min-h-[calc(100vh-410px)] flex-col items-center justify-center gap-y-3 px-4 md:gap-y-6 md:py-12">
      <Image
        src="/assets/images/empty.png"
        width={400}
        height={400}
        alt=""
        className="h-[200px] w-[200px] md:h-[400px] md:w-[400px]"
      />
      <h1 className="text-center text-xl font-bold md:text-2xl">
        {t('no_results_found')}
      </h1>
    </div>
  );
}
