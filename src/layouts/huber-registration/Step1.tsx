'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import TermAndCondition from '@/layouts/huber-registration/TermAndCondition';

interface Props {
  register: any;
  getValues: any;
  next: any;
}

const Step1 = (props: Props) => {
  const { getValues, register, next } = props;
  const t = useTranslations('HumanBookRegister');
  const router = useRouter();

  const onNextStep = () => {
    const data = getValues();
    console.log(data);

    if (!data?.isConfirmed) {
      pushError('Please accept our terms and conditions before continuing.');
      return;
    }

    if (data?.bio?.length === 0) {
      pushError('Please input bio');
    }

    next();
  };

  return (
    <form
      id="step-1"
      className="flex flex-col items-center justify-center rounded-3xl bg-white p-5"
    >
      <p className="self-start text-xl font-medium leading-[2.75rem] text-neutral-10 md:text-[2.25rem]">
        {t('step_1_title')}
      </p>
      <label className="mt-6 flex w-full flex-col gap-2" htmlFor="bio">
        <span className="text-sm leading-4 text-neutral-10">
          {t('bio.text')} <span className="text-red-50">*</span>
        </span>
        <textarea
          id="bio"
          placeholder={t('bio.placeholder')}
          className="h-[8.5rem] resize-none rounded-lg border border-solid border-neutral-90 p-3 text-sm leading-4 text-[#5C6063] outline-none"
          required
          {...register('bio')}
        />
      </label>

      <label className="mt-6 flex w-full flex-col gap-2" htmlFor="bio">
        <span className="text-sm leading-4 text-neutral-10">
          {t('intro_video.text')}
        </span>
        <input
          id="introVideo"
          placeholder={t('intro_video.placeholder')}
          className="h-10 rounded-lg border border-solid border-neutral-90 p-3 text-sm leading-4 text-[#5C6063] outline-none"
          {...register('video')}
        />
      </label>

      <div className="mt-6 flex w-full flex-col gap-2 p-5">
        <span className="text-sm leading-4 text-neutral-10">
          {`${t('read_community')} `}
          <span className="text-red-50">*</span>
        </span>
        <div className="rounded-xl bg-neutral-90 p-4">
          <span className="text-sm uppercase leading-5 text-primary-40">
            {t('general')}
          </span>
          <TermAndCondition />
        </div>
        <div className="mt-3 flex flex-row items-start gap-2">
          <input
            type="checkbox"
            className="w-4 border border-solid border-neutral-40"
            {...register('isConfirmed')}
          />
          <span className="text-xs leading-5 text-neutral-10">
            {t('confirm')}
          </span>
        </div>
      </div>
      <div className="flex w-full items-center gap-3">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push('/')}
        >
          {t('cancel')}
        </Button>
        <Button className="w-full" form="step-1" onClick={onNextStep}>
          {t('next')}
        </Button>
      </div>
    </form>
  );
};

export default Step1;
