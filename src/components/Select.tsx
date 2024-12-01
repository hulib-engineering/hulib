import React from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';

import Dropdown from '@/components/dropdown/Dropdown';
import MenuItem from '@/components/menuItem/MenuItem';

type IControlledSelectProps = {
  label: string;
  className?: string;
};

function ControlledSelect<T extends FieldValues>({
  label,
  options,
  ...controllerProps
}: UseControllerProps<T> &
  IControlledSelectProps & {
    options: { label: string; value: string | number }[];
  }) {
  const {
    field: { name, value, onChange },
    fieldState: { error },
  } = useController(controllerProps);
  console.log(value);

  return (
    <Dropdown id={name} value={value} onChange={onChange} isError={!!error}>
      {({ open }) => (
        <>
          <Dropdown.Select open={open} label={label}>
            {options.find((option) => option.value === value)?.label}
          </Dropdown.Select>
          <Dropdown.Options>
            {options.map((option, index) => (
              <Dropdown.Option key={index} value={option.value}>
                {({ selected, active }) => (
                  <MenuItem isActive={active} isSelected={selected}>
                    <MenuItem.Title>{option.label}</MenuItem.Title>
                  </MenuItem>
                )}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
          {!!error && <Dropdown.Hint>{error.message}</Dropdown.Hint>}
        </>
      )}
    </Dropdown>
  );
}

export { ControlledSelect };
