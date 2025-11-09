'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startOfMonth } from 'date-fns';
import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Dropdown from '@/components/core/dropdown/Dropdown';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import Label from '@/components/Label';
import { DateOfBirthFieldsetValidation } from '@/validations/ProfileValidation';

type ICustomDatePickerProps = {
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  excludeDay?: boolean;
};

const CustomDatePicker = ({
  label,
  value = new Date().toLocaleDateString(),
  onChange,
  className,
  excludeDay = false,
}: ICustomDatePickerProps) => {
  const currentDate = new Date(new Date(value).getFullYear(), new Date(value).getMonth());

  // Get the first day of that month using startOfMonth
  const firstDayOfCurrentMonth = startOfMonth(currentDate);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm <z.infer<typeof DateOfBirthFieldsetValidation>>({
    resolver: zodResolver(DateOfBirthFieldsetValidation),
    defaultValues: {
      day: firstDayOfCurrentMonth.getDate(),
      month: firstDayOfCurrentMonth.getMonth() + 1,
      year: firstDayOfCurrentMonth.getFullYear(),
    },
    mode: 'onChange',
  });
  const { day, month, year } = watch();
  console.log(day, month, year);

  useEffect(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (onChange) {
      onChange(`${year}-${pad(month)}-${pad(day)}`);
    }
  }, [onChange, day, month, year]);

  return (
    <div className={mergeClassnames('flex flex-col gap-2', className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        {/* Day */}
        {!excludeDay && (
          <fieldset className="flex-1">
            <Dropdown
              value={watch('day')}
              onChange={value => setValue('day', value as unknown as number)}
              isError={!!errors.day}
            >
              {({ open }) => (
                <>
                  <Dropdown.Select open={open} label="">
                    {watch('day')}
                  </Dropdown.Select>
                  <Dropdown.Options>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day, index) => (
                      <Dropdown.Option value={day} key={index}>
                        {({ selected, active }) => (
                          <MenuItem
                            isActive={active}
                            isSelected={selected}
                            data-testid={`test-${index}`}
                          >
                            {day}
                          </MenuItem>
                        )}
                      </Dropdown.Option>
                    ))}
                  </Dropdown.Options>
                  <Dropdown.Hint>
                    {errors.month?.message && errors.month.message}
                  </Dropdown.Hint>
                </>
              )}
            </Dropdown>
          </fieldset>
        )}
        {/* Month */}
        <fieldset className="flex-1">
          <Dropdown
            value={watch('month')}
            onChange={value => setValue('month', value as unknown as number)}
            isError={!!errors.month}
          >
            {({ open }) => (
              <>
                <Dropdown.Select open={open} label="">
                  {watch('month')}
                </Dropdown.Select>
                <Dropdown.Options>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month, index) => (
                    <Dropdown.Option value={month} key={index}>
                      {({ selected, active }) => (
                        <MenuItem
                          isActive={active}
                          isSelected={selected}
                          data-testid={`test-${index}`}
                        >
                          {month}
                        </MenuItem>
                      )}
                    </Dropdown.Option>
                  ))}
                </Dropdown.Options>
                <Dropdown.Hint>
                  {errors.month?.message && errors.month.message}
                </Dropdown.Hint>
              </>
            )}
          </Dropdown>
        </fieldset>
        {/* Year */}
        <fieldset className="flex-1">
          <Dropdown
            value={watch('year')}
            onChange={value => setValue('year', value as unknown as number)}
            isError={!!errors.month}
          >
            {({ open }) => (
              <>
                <Dropdown.Select open={open} label="">
                  {watch('year')}
                </Dropdown.Select>
                <Dropdown.Options>
                  {Array.from({ length: 100 }, (_, index) => {
                    const year = new Date().getFullYear() - index;
                    return (
                      <Dropdown.Option value={year} key={index}>
                        {({ selected, active }) => (
                          <MenuItem
                            isActive={active}
                            isSelected={selected}
                            data-testid={`test-${index}`}
                          >
                            {year}
                          </MenuItem>
                        )}
                      </Dropdown.Option>
                    );
                  })}
                </Dropdown.Options>
                <Dropdown.Hint>
                  {errors.month?.message && errors.month.message}
                </Dropdown.Hint>
              </>
            )}
          </Dropdown>
        </fieldset>
      </div>
    </div>
  );
};

export { CustomDatePicker };
