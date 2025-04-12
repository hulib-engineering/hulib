'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/button/Button';
import HeadSlots from '@/components/common/HeadSlots';
import { useCreateTimeSlotsMutation } from '@/libs/services/modules/time-slots';

import { pushError, pushSuccess } from '../CustomToastifyContainer';

const timeSlots = {
  morning: [
    { time: '06:00', day: 0 },
    { time: '06:30', day: 0 },
    { time: '07:00', day: 0 },
    { time: '07:30', day: 0 },
    { time: '08:00', day: 0 },
    { time: '08:30', day: 0 },
    { time: '09:00', day: 0 },
    { time: '09:30', day: 0 },
    { time: '10:00', day: 0 },
    { time: '10:30', day: 0 },
    { time: '11:00', day: 0 },
    { time: '11:30', day: 0 },
  ],
  afternoon: [
    { time: '12:00', day: 0 },
    { time: '12:30', day: 0 },
    { time: '13:00', day: 0 },
    { time: '13:30', day: 0 },
    { time: '14:00', day: 0 },
    { time: '14:30', day: 0 },
    { time: '15:00', day: 0 },
    { time: '15:30', day: 0 },
    { time: '16:00', day: 0 },
    { time: '16:30', day: 0 },
    { time: '17:00', day: 0 },
    { time: '17:30', day: 0 },
  ],
  evening: [
    { time: '18:00', day: 0 },
    { time: '18:30', day: 0 },
    { time: '19:00', day: 0 },
    { time: '19:30', day: 0 },
    { time: '20:00', day: 0 },
    { time: '20:30', day: 0 },
    { time: '21:00', day: 0 },
    { time: '21:30', day: 0 },
    { time: '22:00', day: 0 },
    { time: '22:30', day: 0 },
    { time: '23:00', day: 0 },
    { time: '23:30', day: 0 },
  ],
};

// Helper function to generate time slots for all 7 days
const generateTimeSlotsForWeek = () => {
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const result: typeof timeSlots = { morning: [], afternoon: [], evening: [] };

  daysOfWeek.forEach((day) => {
    Object.entries(timeSlots).forEach(([period, slots]) => {
      slots.forEach((slot) => {
        result[period as keyof typeof timeSlots].push({
          ...slot,
          day,
        });
      });
    });
  });

  return result;
};

const timeSlotsForWeek = generateTimeSlotsForWeek();

const Step2 = ({ next }: { next: () => void }) => {
  const t = useTranslations('HumanBookRegister.Step2');

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
      const res = await createTimeSlots({
        timeSlots: data.timeSlots,
      });
      if (res?.error?.status === 422) {
        pushError(t('error_contact_admin'));
      } else {
        localStorage.setItem('huber_registration_step', '3');
        pushSuccess(t('success_time_slots_description'));
        next();
      }
    } catch (error: any) {
      pushError(error?.message || t('error_contact_admin'));
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
                  <HeadSlots dayOfWeek={currentDay} />

                  {Object.entries(timeSlotsForWeek).map(([period, slots]) => {
                    const filteredSlots = slots.filter(
                      (slot) => slot.day === currentDay,
                    );
                    return (
                      <div
                        key={period}
                        className="flex flex-col gap-2 rounded-lg bg-neutral-98 p-2"
                      >
                        <div className="flex flex-wrap justify-between gap-1">
                          {filteredSlots.map((slot) => (
                            <Box
                              key={`${slot.day}-${slot.time}`}
                              onClick={() =>
                                handleTimeSelect(slot.time, slot.day)
                              }
                              className={clsx(
                                'w-[70px] cursor-pointer rounded-full py-1 text-center text-sm',
                                field.value.some(
                                  (s) =>
                                    s.startTime === slot.time &&
                                    s.dayOfWeek === slot.day,
                                )
                                  ? 'bg-green-90 text-green-30'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 ',
                              )}
                            >
                              {slot.time}
                            </Box>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
          className="w-1/2 rounded-full border-neutral-80 px-12 py-2 text-primary-50"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-1/2 rounded-full bg-primary-50 px-12 py-2 text-white"
          disabled={currentDay !== 6}
          animation={isLoading ? 'progress' : undefined}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default Step2;
