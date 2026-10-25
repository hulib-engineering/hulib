'use client';

import { CaretDown } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import type { ScheduleCounts, ScheduleFilter, ScheduleFilterOption } from '../types';
import { FILTER_LABEL_KEY, SCHEDULE_FILTERS } from '../types';
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

  // The combobox stores whole option objects and matches them by reference, so `options`
  // must be memoised and `selected` must be drawn from it rather than rebuilt — otherwise a
  // selected chip is a different object from its row in the list and toggling misbehaves.
  const options: ScheduleFilterOption[] = useMemo(
    () => SCHEDULE_FILTERS.map(value => ({
      id: value,
      value,
      label: t(`filter.${FILTER_LABEL_KEY[value]}`),
      count: counts[value] ?? 0,
    })),
    [counts, t],
  );

  const selected = useMemo(
    () => options.filter(option => filters.includes(option.value)),
    [options, filters],
  );

  const visibleOptions = useMemo(() => {
    if (query.trim() === '') {
      return options;
    }
    const needle = query.toLowerCase();
    return options.filter(option => option.label.toLowerCase().includes(needle));
  }, [options, query]);

  // `Combobox.VisualMultiSelect` passes the removed chip's `id`, not its index or value.
  const onRemove = (id?: number | string) => {
    onFiltersChange(filters.filter(value => value !== id));
  };

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
            value={selected}
            onChange={(value) => {
              const next = value as ScheduleFilterOption[];
              onFiltersChange(next.length ? next.map(option => option.value) : []);
            }}
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
                    selected.length > 0 ? 'p-1' : 'py-1 pl-4 pr-2',
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
