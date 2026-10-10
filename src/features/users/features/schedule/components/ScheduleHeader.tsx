'use client';

import { CaretDown } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import type { ScheduleCounts, ScheduleFilter } from '../types';
import { SCHEDULE_FILTERS } from '../types';
import Combobox from '@/components/core/combobox/Combobox';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';

type ScheduleHeaderProps = {
  counts: ScheduleCounts;
  filters: ScheduleFilter[];
  onFiltersChange: (filters: ScheduleFilter[]) => void;
};

export default function ScheduleHeader({ counts, filters, onFiltersChange }: ScheduleHeaderProps) {
  const t = useTranslations('Schedule.meeting_list');
  const tSchedule = useTranslations('Schedule');

  const [query, setQuery] = useState('');

  const options = useMemo(
    () => SCHEDULE_FILTERS.map(value => ({
      value,
      label: t(`filter.${value}`),
      count: counts[value] ?? 0,
    })),
    [counts, t],
  );

  const visibleOptions = useMemo(() => {
    if (query.trim() === '') {
      return options;
    }
    const needle = query.toLowerCase();
    return options.filter(option => option.label.toLowerCase().includes(needle));
  }, [options, query]);

  const onRemove = (id: unknown) => onFiltersChange(filters.filter(value => value !== id));

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="hidden sm:block" />

        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <span className="text-sm font-medium text-neutral-20">
            {tSchedule('view')}
            :
          </span>
          <Combobox
            value={filters}
            onChange={value => onFiltersChange(value as ScheduleFilter[])}
            onQueryChange={setQuery}
            onClear={onRemove}
            className="w-full max-w-[220px]"
            multiple
            size="sm"
          >
            {({ open }) => (
              <>
                <Combobox.VisualMultiSelect
                  open={open}
                  label=""
                  placeholder={tSchedule('type_of_meeting')}
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
                    {visibleOptions.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none text-neutral-40">
                        {t('empty.title')}
                      </div>
                    ) : (
                      visibleOptions.map(option => (
                        <Combobox.Option value={option} key={option.value}>
                          {({ selected: isSelected, active }) => (
                            <MenuItem isActive={active} isSelected={isSelected} className="gap-0.5">
                              <MenuItem.Checkbox isSelected={isSelected} />
                              <MenuItem.Title>{option.label}</MenuItem.Title>
                              <span className="text-xs text-neutral-40">
                                {option.count}
                              </span>
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
    </div>
  );
}
