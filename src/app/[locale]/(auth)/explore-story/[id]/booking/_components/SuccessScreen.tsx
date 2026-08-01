import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from '@/libs/i18nNavigation';
import Button from '@/components/core/button/Button';

export default function Success() {
  const router = useRouter();
  const t = useTranslations('Schedule.MainScreen');

  return (
    <>
      <Image
        src="/assets/images/misc/schedule-success.svg"
        alt="Successful illustration"
        width={480}
        height={420}
        className="w-[398px] object-cover xl:w-[480px]"
      />
      <h4 className="text-[28px] font-medium">{t('success_title')}</h4>
      <p className="text-center text-sm text-neutral-30">{t('success_detail')}</p>
      <div className="grid grid-cols-2 items-center justify-center gap-x-2 md:gap-x-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/my-schedule')}
        >
          {t('back_to_schedule')}
        </Button>
        <Button
          className="w-full"
          onClick={() => router.push('/')}
        >
          {t('back_to_home')}
        </Button>
      </div>
    </>
  );
}
