'use client';

/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/button/Button';
import HeadSlots from '@/components/common/HeadSlots';
import { useAppSelector } from '@/libs/hooks';
import { useCreateTimeSlotsMutation } from '@/libs/services/modules/time-slots';

import AvailableSchedule from '../common/AvailableSchedule';
import { pushError, pushSuccess } from '../CustomToastifyContainer';

const Step2 = ({ next }: { next: () => void }) => {
  const t = useTranslations('HumanBookRegister.Step2');
  const tCommon = useTranslations('Common');

  const formSchema = z.object({
    timeSlots: z
      .array(
        z.object({
          dayOfWeek: z.number(),
          startTime: z.string(),
        }),
      )
      .min(1, t('validation.error_select_at_least_one_time_slot')),
  });

  type FormData = z.infer<typeof formSchema>;
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeSlots: [],
    },
  });
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [currentDay, setCurrentDay] = useState(0);
  const [createTimeSlots, { isLoading }] = useCreateTimeSlotsMutation();

  const handleTimeSelect = (time: string, selectedDay: number) => {
    const currentTimeSlots = watch('timeSlots');
    const existingSlot = currentTimeSlots.find(
      (slot) => slot.dayOfWeek === selectedDay && slot.startTime === time,
    );

    if (existingSlot) {
      setValue(
        'timeSlots',
        currentTimeSlots.filter(
          (slot) =>
            !(slot.dayOfWeek === selectedDay && slot.startTime === time),
        ),
      );
    } else {
      setValue('timeSlots', [
        ...currentTimeSlots,
        { dayOfWeek: selectedDay, startTime: time },
      ]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createTimeSlots({
        timeSlots: data.timeSlots,
      }).unwrap();
      const userKey = `${userInfo.id}_huber_registration_step`;
      localStorage.setItem(userKey, '3');
      pushSuccess(t('success_time_slots_description'));
      next();
    } catch (error: any) {
      pushError(tCommon(error?.message || 'error_contact_admin'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl rounded-lg bg-white p-5"
    >
      <h1 className="mb-6 text-4xl font-bold">{t('title')}</h1>
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-2">
          <h2 className="text-xl">{t('available_slots')}</h2>
          <p className="text-gray-700">{t('available_slots_description')}</p>
        </div>

        <div className="flex flex-col gap-[10px]">
          <Controller
            name="timeSlots"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <HeadSlots
                    dayOfWeek={currentDay}
                    onChangeDayOfWeek={setCurrentDay}
                    selectedTimes={field.value}
                  />

                  <AvailableSchedule
                    onSelectTime={handleTimeSelect}
                    selectedTimes={field.value}
                    currentDay={currentDay}
                  />
                </>
              );
            }}
          />

          {errors.timeSlots && (
            <p className="mt-2 text-sm text-red-500">
              {errors.timeSlots.message}
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="w-[180px] rounded-full border-neutral-80 px-12 py-2 text-primary-50"
              disabled={currentDay > 5}
              onClick={() => setCurrentDay((prev) => prev + 1)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentDay((prev) => prev - 1)}
          disabled={currentDay === 0}
          className={`w-1/2 rounded-full px-12 py-2 text-primary-50 ${currentDay===0 && 'border bg-[#E3E4E5] text-neutral-70'}`}
        >
          Back
        </Button>
        <Button
          type="submit"
          className={`w-1/2 rounded-full bg-primary-50 px-12 py-2 text-white ${currentDay!== 6 && 'border bg-[#E3E4E5] text-neutral-70'}`}
          disabled={currentDay !== 6 || isLoading}
          animation={isLoading ? 'progress' : undefined}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default Step2;
