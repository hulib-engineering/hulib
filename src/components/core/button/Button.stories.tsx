import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from '@phosphor-icons/react';

import Button from './Button';
import type { ButtonAnimations, ButtonSizes, ButtonVariants } from './private/types';

const variants: ButtonVariants[] = ['fill', 'soft', 'outline', 'ghost'];

const sizes: ButtonSizes[] = ['sm', 'lg'];

const animations: ButtonAnimations[] = ['progress', 'success', 'error', 'pulse'];

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: variants,
    },
    size: {
      control: 'select',
      options: sizes,
    },
    animation: {
      control: 'select',
      options: [undefined, ...animations],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    className: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'fill',
    size: 'lg',
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map(variant => (
        <Button key={variant} variant={variant} iconLeft={<Plus />} iconRight={<Plus />}>
          Button
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Button size={size}>{`Size ${size}`}</Button>
          <span className="text-xs font-medium capitalize text-neutral-50">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const AllDisabled: Story = {
  name: 'All variants disabled',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map(variant => (
        <Button key={variant} variant={variant} disabled iconLeft={<Plus />} iconRight={<Plus />}>
          Button
        </Button>
      ))}
    </div>
  ),
};

export const Animations: Story = {
  name: 'Loading & feedback',
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {animations.map(animation => (
        <Button key={String(animation)} variant="fill" animation={animation}>
          {String(animation)}
        </Button>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  name: 'Full width',
  decorators: [
    Story => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    fullWidth: true,
  },
};
