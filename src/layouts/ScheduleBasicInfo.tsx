import { ArrowLeft, Heart, Info, Timer } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type z from 'zod';

import { ScheduleInfoItemLayout } from './scheduling/ScheduleInfoItemLayout';
import { SessionAttendees } from './scheduling/SessionAttendees';

import Button from '@/components/core/button/Button';
import { useAppSelector } from '@/libs/hooks';
import type { HuberStep1Validation } from '@/validations/HuberValidation';
import type { ProfileValidation } from '@/validations/ProfileValidation';

const ScheduleBasicInfo = ({ huber, onOpenHuberConv }: { huber: z.infer<typeof ProfileValidation> & Pick<z.infer<ReturnType<typeof HuberStep1Validation>>, 'topics'> & { rating: number; photo: { id: string; path: string } }; onOpenHuberConv: () => void }) => {
  const router = useRouter();

  const t = useTranslations('ScheduleBasicInfo');

  const userInfo = useAppSelector(state => state.auth.userInfo);

  return (
    <div className="hidden w-full flex-col gap-4 rounded-3xl bg-white p-4 xl:flex xl:w-1/3 xl:p-8">
      <Button
        variant="ghost"
        iconLeft={<ArrowLeft />}
        className="w-fit text-black"
        onClick={() => router.back()}
      >
        {t('back')}
      </Button>
      <div className="flex items-center gap-x-2 rounded-3xl bg-neutral-98 p-4">
        <Image
          src={huber.photo?.path ?? '/assets/images/ava-placeholder.png'}
          alt="avatar author"
          width={76}
          height={76}
          className="size-[76px] rounded-xl object-contain"
        />
        <div className="flex flex-col gap-1">
          <h4 className="text-[28px] font-medium leading-9 text-primary-10">
            {huber?.fullName || ''}
          </h4>
          <p className="text-sm font-normal leading-4 text-neutral-30">
            Huber
          </p>
          <div className="flex items-center gap-x-2">
            <span className="text-xs font-medium text-neutral-20">
              {huber?.topics?.length ?? 0}
            </span>
            <span className="text-[10px] font-medium text-neutral-40">
              {t('topics')}
            </span>
            {huber?.rating > 0 && (
              <>
                <Heart size={16} color="#F3C00C" weight="fill" />
                <span className="text-xs font-medium text-neutral-20">
                  {huber?.rating}
                </span>
                <span className="text-[10px] font-medium text-neutral-40">
                  {t('rating')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <SessionAttendees
        huber={huber}
        liber={userInfo}
        isVibing
      />
      <ScheduleInfoItemLayout icon={<Timer size={16} />} title={t('duration')}>
        <p className="text-sm font-medium text-neutral-40">
          {t('duration_time')}
        </p>
      </ScheduleInfoItemLayout>
      <ScheduleInfoItemLayout icon={<Info size={16} />} title={t('notice')}>
        <p className="text-sm font-normal text-neutral-40">
          {t('notice_text')}
        </p>
        <p className="text-sm font-normal text-neutral-40">
          {t('support_text')}
            &nbsp;
          <Link className="text-primary-60 underline" onClick={onOpenHuberConv} href="">
            {t('click_here')}
          </Link>
        </p>
      </ScheduleInfoItemLayout>
    </div>
  );
};

export default ScheduleBasicInfo;
