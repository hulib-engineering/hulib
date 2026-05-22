'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import Button from '@/components/core/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useAccountUpgradeStep } from '@/features/users/hooks/useAccountUpgradeStep';
import TimeslotRegistrationSection from '@/layouts/timeslots/TimeslotRegistrationSection';
import { useCreateTimeslotsMutation } from '@/libs/services/modules/time-slots';
import type { Timeslot } from '@/utils/convertTimeSlotToUtc';
import { convertTimeSlotToUtc } from '@/utils/convertTimeSlotToUtc';
import type { AccountUpgradeValidationType } from '@/validations/AccountUpgradeValidation';

const Step2 = () => {
  const t = useTranslations('HumanBookRegister.Step2');
  const tHr = useTranslations('HumanBookRegister');
  const tTimeSlots = useTranslations('Time_slots');

  const { goToPreviousStep, goToNextStep } = useAccountUpgradeStep();

  const {
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<AccountUpgradeValidationType>();
  const timeSlots = watch('timeSlots') || [];

  const [registerTimeSlots, { isLoading: isRegisteringTimeslots }] = useCreateTimeslotsMutation();

  const handleSlotToggle = (slot: Timeslot) => {
    const currentSlots = watch('timeSlots') || [];
    const exists = currentSlots.some(
      s => s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime,
    );
    const next = exists
      ? currentSlots.filter(
          s => !(s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime),
        )
      : [...currentSlots, slot];
    setValue('timeSlots', next, { shouldValidate: true });
  };
  const handleNext = async () => {
    if (timeSlots.length === 0) {
      setError('timeSlots', {
        type: 'manual',
        message: tHr('validation.time_slots_required'),
      });
      return;
    }
    clearErrors('timeSlots');

    try {
      const result = await registerTimeSlots({
        timeSlots: timeSlots.map(slot => convertTimeSlotToUtc(slot)),
      }).unwrap();
      if (result !== null) {
        pushSuccess(tTimeSlots('success_time_slots_description'));
      }
      goToNextStep();
    } catch (error: any) {
      pushError(tTimeSlots(error?.message || 'error_contact_admin'));
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-[20px] bg-white p-5">
      <h2 className="text-2xl font-medium text-black xl:text-4xl">{t('title')}</h2>
      <TimeslotRegistrationSection
        selectedSlots={timeSlots}
        onSlotToggle={handleSlotToggle}
      />
      <div className="flex w-full items-center justify-center gap-3">
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={goToPreviousStep}
        >
          {tHr('back')}
        </Button>
        <Button
          size="md"
          fullWidth
          animation={isRegisteringTimeslots && 'progress'}
          disabled={timeSlots.length === 0 || !!errors.timeSlots || isRegisteringTimeslots}
          onClick={handleNext}
        >
          {tHr('next')}
        </Button>
      </div>
    </div>
  );
};

export default Step2;
