'use client';

import { ArrowLeft, CalendarDot, CaretDown, MapPinArea } from '@phosphor-icons/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import * as React from 'react';
import { useCallback, useState } from 'react';

import Button from '@/components/button/Button';
import Combobox from '@/components/combobox/Combobox';
import MenuItem from '@/components/menuItem/MenuItem';
import { mergeClassnames } from '@/components/private/utils';
import BigCalendar from '@/layouts/scheduling/BigCalendar';
import MiniCalendar from '@/layouts/scheduling/MiniCalendar';
import MobileSessionList from '@/layouts/scheduling/MobileSessionList';
import TimeSlotList from '@/layouts/timeslots/TimeSlotList';
import TimeslotRegistrationSection from '@/layouts/timeslots/TimeslotRegistrationSection';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import { ROLE_NAME, Role, StatusEnum } from '@/types/common';
import { toLocaleDateString, toLocaleTimeString } from '@/utils/dateUtils';

const filters: TFilter[] = [
  { id: 1, label: 'Done', value: StatusEnum.Finished },
  { id: 2, label: 'Waiting', value: StatusEnum.Pending },
  { id: 3, label: 'Huber', value: 'isHuber' },
  { id: 4, label: 'Liber', value: 'isLiber' },
];

type TFilter = {
  id: number;
  label: string;
  value: string;
};

const filter = (
  query: string,
  filters: { label: string; value: string }[],
) => {
  return query === ''
    ? filters
    : filters.filter(({ value }) =>
        value
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, '')),
      );
};

export default function Index() {
  const t = useTranslations('Schedule');
  const locale = useLocale();

  const { data: upcomingEvents, isLoading }
    = useGetReadingSessionsQuery({ upcoming: true });
  const hasUpcomingEvent = upcomingEvents?.length > 0;

  const user = useAppSelector(state => state.auth.userInfo);
  const isHuber = user?.role?.name === 'Huber';

  const [showMobileTimeslotRegistration, setShowMobileTimeslotRegistration] = useState(false);
  const [dateInWeekView, setDateInWeekView] = useState<Date>(new Date());
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [statusFilters, setStatusFilters] = useState<TFilter[]>([]);
  const queriedFilters = filter(filterQuery, filters);

  const onRemoveFilter = useCallback(
    (index: unknown) => {
      setStatusFilters(statusFilters.filter(({ id }) => id !== index));
    },
    [statusFilters],
  );

  return (
    <div className="flex flex-col gap-6 px-0 py-8 xl:flex-row xl:p-8">
      {!showMobileTimeslotRegistration ? (
        <>
          <div className="flex w-full flex-col gap-4 xl:w-1/4 xl:max-w-[344px]">
            {/* Upcoming event */}
            {!isLoading
            && hasUpcomingEvent && (
              <div className="hidden flex-col gap-1 rounded-xl bg-white px-4 py-3 shadow-sm xl:flex">
                <p className="text-xl font-medium text-primary-10">
                  {t('upcoming.upcoming_event')}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-[6px] text-black">
                      <Image
                        alt="avatar"
                        src="/assets/icons/meeting-icon.svg"
                        width={24}
                        height={24}
                        loading="lazy"
                        className="rounded"
                      />
                      <span>Meeting with</span>
                    </div>
                    <div
                      className="flex items-center gap-[6px] text-yellow-40"
                    >
                      <span className={isHuber ? 'text-yellow-40' : 'text-primary-50'}>
                        {isHuber ? ROLE_NAME[Role.LIBER] : ROLE_NAME[Role.HUBER]}
                      </span>
                      <Image
                        alt="avatar"
                        src="/assets/images/ava-placeholder.png"
                        width={24}
                        height={24}
                        loading="lazy"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDot className="text-[#343330]" />
                    <span className="text-sm leading-4 text-neutral-variant-10">
                      {toLocaleDateString(upcomingEvents[0].startedAt, locale === 'en' ? 'en-US' : 'vi-VI')}
                      {' '}
                      ,
                      {' '}
                      {toLocaleTimeString(upcomingEvents[0].startedAt, locale)}
                      {' '}
                      {'->'}
                      {' '}
                      {toLocaleTimeString(upcomingEvents[0].endedAt, locale)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinArea className="text-neutral-20" weight="bold" />
                    {upcomingEvents[0].sessionUrl ? (
                      <Link
                        href={upcomingEvents[0].sessionUrl}
                        className="line-clamp-1 block truncate text-sm font-medium leading-4 text-primary-70 underline"
                        title={upcomingEvents[0].sessionUrl}
                      >
                        {upcomingEvents[0].sessionUrl || '-'}
                      </Link>
                    ) : <span className="text-sm leading-4 text-neutral-variant-10">TBU</span>}
                  </div>
                </div>
              </div>
            )}
            <div className="px-4 xl:px-0">
              <MiniCalendar onChange={setDateInWeekView} onUpdateTimeslots={() => setShowMobileTimeslotRegistration(true)} />
            </div>
            <div className="hidden xl:block">
              <TimeSlotList />
            </div>
          </div>
          <div className="flex flex-col gap-6 xl:hidden">
            <MobileSessionList />
          </div>
          <div className="hidden flex-1 flex-col gap-4 bg-white py-4 xl:flex">
            <div className="flex items-center justify-between px-4">
              <div className="flex-1">
                <h4 className="text-[28px] font-medium leading-9 text-primary-10">
                  Meeting schedule
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span>View:</span>
                <Combobox
                  value={statusFilters}
                  onChange={value => setStatusFilters(value as TFilter[])}
                  onQueryChange={setFilterQuery}
                  onClear={onRemoveFilter}
                  className="w-full max-w-[200px]"
                  multiple
                  size="sm"
                >
                  {({ open }) => (
                    <>
                      <Combobox.VisualMultiSelect
                        open={open}
                        label=""
                        placeholder="Type of meeting"
                        className={mergeClassnames(
                          'rounded-lg border-[0.5px] border-neutral-70',
                          filters.length > 0 ? 'p-1' : 'py-1 pl-4 pr-2',
                        )}
                        inputClassname="p-0 font-normal leading-5"
                        displayValue={({ label }) => label}
                      >
                        <CaretDown />
                      </Combobox.VisualMultiSelect>
                      <Combobox.Transition>
                        <Combobox.Options className="my-2 grid grid-cols-2 gap-y-4 rounded-lg bg-neutral-98 shadow-sm">
                          {queriedFilters.length === 0 && filterQuery !== '' ? (
                            <div className="relative cursor-default select-none text-neutral-40">
                              Nothing found.
                            </div>
                          ) : (
                            queriedFilters.map((filter, index) => (
                              <Combobox.Option value={filter} key={index}>
                                {({ selected, active }) => (
                                  <MenuItem isActive={active} isSelected={selected} className="gap-0.5">
                                    <MenuItem.Checkbox isSelected={selected} />
                                    <MenuItem.Title>{filter.label}</MenuItem.Title>
                                  </MenuItem>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Combobox.Transition>
                    </>
                  )}
                </Combobox>
              </div>
            </div>
            <div className="flex-1">
              <BigCalendar dateInWeekView={dateInWeekView} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            size="lg"
            iconLeft={<ArrowLeft weight="bold" className="text-xl" />}
            className="w-fit font-medium text-black"
            onClick={() => setShowMobileTimeslotRegistration(false)}
          >
            Back
          </Button>
          <TimeslotRegistrationSection
            onBack={() => setShowMobileTimeslotRegistration(false)}
            onSucceed={() => setShowMobileTimeslotRegistration(false)}
          />
        </div>
      )}
    </div>
  );
}
