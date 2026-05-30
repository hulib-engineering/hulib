import type { Meta, StoryObj } from '@storybook/react';
import { CaretDown } from '@phosphor-icons/react';
import { useState } from 'react';
import { Provider } from 'react-redux';

import Dropdown from './Dropdown';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { makeStore } from '@/libs/store';

const store = makeStore();

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
] as const;

type OptionValue = (typeof OPTIONS)[number]['value'];

const findLabel = (value: OptionValue) =>
  OPTIONS.find(option => option.value === value)?.label ?? '';

const meta = {
  title: 'Core/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    onChange: () => {},
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div className="w-72">
        <Provider store={store}>
          <Story />
        </Provider>
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default form-style select using `Dropdown.Select` + `MenuItem` options. */
export const Select: Story = {
  args: { value: 'apple' },
  render: function SelectStory() {
    const [value, setValue] = useState<OptionValue>('apple');

    return (
      <Dropdown value={value} onChange={v => setValue(v as OptionValue)}>
        {({ open }) => (
          <>
            <Dropdown.Select open={open} label="Fruit" placeholder="Choose a fruit">
              {findLabel(value)}
            </Dropdown.Select>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                    </MenuItem>
                  )}
                </Dropdown.Option>
              ))}
            </Dropdown.Options>
          </>
        )}
      </Dropdown>
    );
  },
};

/** Custom trigger (e.g. cover font picker, locale switcher). */
export const CustomTrigger: Story = {
  name: 'Custom trigger',
  args: { value: 'banana' },
  render: function CustomTriggerStory() {
    const [value, setValue] = useState<OptionValue>('banana');
    const selectedLabel = findLabel(value);

    return (
      <Dropdown value={value} onChange={v => setValue(v as OptionValue)}>
        {({ open }) => (
          <>
            <Dropdown.Trigger
              aria-label="Choose fruit"
              className="flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-3 text-left shadow-sm"
            >
              <span className="truncate text-base font-medium text-neutral-10">
                {selectedLabel}
              </span>
              <CaretDown
                size={20}
                className={mergeClassnames(
                  'shrink-0 text-neutral-10 transition-transform',
                  open && 'rotate-180',
                )}
                aria-hidden
              />
            </Dropdown.Trigger>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title
                        className={mergeClassnames(
                          selected && 'text-primary-50',
                        )}
                      >
                        {option.label}
                      </MenuItem.Title>
                    </MenuItem>
                  )}
                </Dropdown.Option>
              ))}
            </Dropdown.Options>
          </>
        )}
      </Dropdown>
    );
  },
};

export const Disabled: Story = {
  args: { value: 'apple' },
  render: function DisabledStory() {
    const [value, setValue] = useState<OptionValue>('apple');

    return (
      <Dropdown
        value={value}
        onChange={v => setValue(v as OptionValue)}
        disabled
      >
        {({ open }) => (
          <>
            <Dropdown.Select open={open} label="Fruit" placeholder="Choose a fruit">
              {findLabel(value)}
            </Dropdown.Select>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                    </MenuItem>
                  )}
                </Dropdown.Option>
              ))}
            </Dropdown.Options>
          </>
        )}
      </Dropdown>
    );
  },
};

export const Error: Story = {
  args: { value: 'apple' },
  render: function ErrorStory() {
    const [value, setValue] = useState<OptionValue>('apple');

    return (
      <Dropdown
        value={value}
        onChange={v => setValue(v as OptionValue)}
        isError
      >
        {({ open }) => (
          <>
            <Dropdown.Select open={open} label="Fruit" placeholder="Choose a fruit">
              {findLabel(value)}
            </Dropdown.Select>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                    </MenuItem>
                  )}
                </Dropdown.Option>
              ))}
            </Dropdown.Options>
            <Dropdown.Hint>Please select a valid option.</Dropdown.Hint>
          </>
        )}
      </Dropdown>
    );
  },
};
