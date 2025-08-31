// deprecated, need to refactor using reusable components
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import AvailableSchedule from '../../components/common/AvailableSchedule';
import { pushError, pushSuccess } from '../../components/CustomToastifyContainer';
import Button from '@/components/button/Button';
import HeadSlots from '@/components/common/HeadSlots';
import { useAppSelector } from '@/libs/hooks';
import { useCreateTimeSlotsMutation } from '@/libs/services/modules/time-slots';

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

  const [createTimeSlots, { isLoading }] = useCreateTimeSlotsMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

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

  const [currentDay, setCurrentDay] = useState(0);

  const handleTimeSelect = (time: string, selectedDay: number) => {
    const currentTimeSlots = watch('timeSlots');
    const existingSlot = currentTimeSlots.find(
      slot => slot.dayOfWeek === selectedDay && slot.startTime === time,
    );

    if (existingSlot) {
      setValue(
        'timeSlots',
        currentTimeSlots.filter(
          slot =>
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
      className="mx-auto flex max-w-2xl flex-col gap-6 rounded-[20px] bg-white p-5"
    >
      <h2 className="text-2xl font-medium text-black xl:text-4xl">{t('title')}</h2>
      <div className="rounded-xl px-2 pb-0 pt-5 shadow-sm xl:px-5 xl:pb-5">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <div className="font-medium text-[#03191C]">
            <p className="text-lg">{t('available_slots')}</p>
            <p className="text-sm">{t('available_slots_description')}</p>
          </div>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Controller
                name="timeSlots"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="flex flex-col gap-2.5">
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
                    </div>
                  );
                }}
              />
              {errors.timeSlots && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.timeSlots.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="w-[180px] rounded-full border-neutral-80 px-12 py-2 text-primary-50"
                disabled={currentDay > 5}
                onClick={() => setCurrentDay(prev => prev + 1)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentDay(prev => prev - 1)}
          disabled={currentDay === 0}
          className={`w-1/2 rounded-full px-12 py-2 text-primary-50 ${currentDay === 0 && 'border bg-[#E3E4E5] text-neutral-70'}`}
        >
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          className={`w-1/2 rounded-full bg-primary-50 px-12 py-2 text-white ${currentDay !== 6 && 'border bg-[#E3E4E5] text-neutral-70'}`}
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
