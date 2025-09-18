import { CaretDown, Globe } from '@phosphor-icons/react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Button from '@/components/button/Button';
import Dropdown from '@/components/dropdown/Dropdown';
import MenuItem from '@/components/menuItem/MenuItem';
import { POPULAR_TIMEZONES } from '@/libs/constants';
import { formatTimezone } from '@/utils/dateUtils';

type ITimezoneSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TimezoneSelect = ({ value, onChange }: ITimezoneSelectProps) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);

  return (
    <Dropdown value={selected} onChange={value => setSelected(value as string)}>
      <Dropdown.Trigger aria-label="Dropdown trigger">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Globe weight="bold" />}
          iconRight={<CaretDown weight="bold" />}
          className="gap-1.5 py-2 text-sm leading-4 text-blue-50"
        >
          {formatTimezone(selected)}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Options className="max-h-44 min-w-0 max-w-xs overflow-y-auto">
        {POPULAR_TIMEZONES.map((option, index) => (
          <Dropdown.Option key={index} value={option}>
            {({ selected, active }) => (
              <MenuItem isActive={active} isSelected={selected}>
                {formatTimezone(option)}
              </MenuItem>
            )}
          </Dropdown.Option>
        ))}
      </Dropdown.Options>
    </Dropdown>

  );
};
