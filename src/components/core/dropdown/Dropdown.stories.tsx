import type { Meta, StoryObj } from '@storybook/react';
import {
  Bookmarks,
  CaretDown,
  Lock,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Provider } from 'react-redux';

import Dropdown from './Dropdown';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { makeStore } from '@/libs/store';

const store = makeStore();

const OPTIONS = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
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
    const [value, setValue] = useState<OptionValue>('1');

    return (
      <Dropdown value={value} onChange={v => setValue(v as OptionValue)}>
        {({ open }) => (
          <>
            <Dropdown.Select open={open} label="Dropdown" placeholder="Input">
              {findLabel(value)}
            </Dropdown.Select>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                      {selected && <MenuItem.Check />}
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
    const [value, setValue] = useState<OptionValue>('2');
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
                      <MenuItem.Title>
                        {option.label}
                      </MenuItem.Title>
                      {selected && <MenuItem.Check />}
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
    const [value, setValue] = useState<OptionValue>('1');

    return (
      <Dropdown
        value={value}
        onChange={v => setValue(v as OptionValue)}
        disabled
      >
        {({ open }) => (
          <>
            <Dropdown.Select open={open} label="Dropdown" placeholder="Input">
              {findLabel(value)}
            </Dropdown.Select>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                      {selected && <MenuItem.Check />}
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
    const [value, setValue] = useState<OptionValue>('1');

    return (
      <Dropdown
        value={value}
        onChange={v => setValue(v as OptionValue)}
        isError
      >
        {({ open }) => (
          <>
            <Dropdown.Select open={open} label="Dropdown" placeholder="Input">
              {findLabel(value)}
            </Dropdown.Select>
            <Dropdown.Options>
              {OPTIONS.map(option => (
                <Dropdown.Option key={option.value} value={option.value}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                      {selected && <MenuItem.Check />}
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

type UserMenuItem = {
  label: string;
  icon: Icon;
  value: string;
  isDanger?: boolean;
};

const USER_MENU_ITEMS: UserMenuItem[] = [
  { label: 'My Profile', icon: UserCircle, value: 'profile' },
  { label: 'Change Password', icon: Lock, value: 'change-password' },
  { label: 'My Favorite', icon: Bookmarks, value: 'favorite' },
  { label: 'Signout', icon: SignOut, value: 'signout', isDanger: true },
];

/** Action menu triggered by an avatar button (e.g. user dropdown). */
export const UserMenu: Story = {
  name: 'User menu',
  args: { value: null },
  render: function UserMenuStory() {
    const [value, setValue] = useState<string | null>(null);

    return (
      <Dropdown value={value} onChange={v => setValue(v as string)}>
        {({ open }) => (
          <>
            <Dropdown.Trigger>
              <button
                type="button"
                className={mergeClassnames(
                  'flex size-10 items-center justify-center rounded-full transition-colors',
                  open ? 'bg-primary-90' : 'bg-neutral-90',
                )}
              >
                <UserCircle size={24} className="text-neutral-10" />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Options menuWidth="w-[236px]">
              {USER_MENU_ITEMS.map(item => (
                <Dropdown.Option key={item.value} value={item.value}>
                  {({ active }) => (
                    <MenuItem isActive={active}>
                      <item.icon
                        className={mergeClassnames(
                          'size-5 shrink-0',
                          item.isDanger ? 'text-red-60' : 'text-neutral-10',
                        )}
                      />
                      {item.isDanger ? (
                        <span className="block grow overflow-hidden text-left text-sm leading-4 text-red-60">
                          {item.label}
                        </span>
                      ) : (
                        <MenuItem.Title>{item.label}</MenuItem.Title>
                      )}
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
