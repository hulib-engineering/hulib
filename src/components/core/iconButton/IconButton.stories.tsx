import type { Meta, StoryObj } from '@storybook/react';
import {
  Plus,
} from '@phosphor-icons/react';

import IconButton from './IconButton';
import type { IconButtonSizes } from './private/types';

import type { ButtonAnimations, ButtonVariants } from '@/components/core/button/private/types';

const variants: ButtonVariants[] = [
  'ghost',
  'outline',
  'fill',
  'soft',
];

const sizes: IconButtonSizes[] = ['sm', 'md', 'lg'];

const animations: ButtonAnimations[] = ['progress', 'success', 'error', 'pulse'];

const meta = {
  title: 'Core/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    'variant': {
      control: 'select',
      options: variants,
    },
    'size': {
      control: 'select',
      options: sizes,
    },
    'animation': {
      control: 'select',
      options: [undefined, ...animations],
    },
    'disabled': { control: 'boolean' },
    'className': { control: 'text' },
    'aria-label': { control: 'text' },
    'onClick': { action: 'clicked' },
  },
  args: {
    'icon': <Plus weight="bold" />,
    'variant': 'fill',
    'size': 'md',
    'disabled': false,
    'aria-label': 'Add item',
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every `variant` with the same icon and size. */
export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map(variant => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <IconButton
            icon={<Plus weight="bold" />}
            variant={variant}
            aria-label={`${variant} icon button`}
          />
          <span className="text-xs font-medium capitalize text-neutral-50">
            {variant}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Preset sizes: `sm` → `lg`. */
export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton
            icon={<Plus weight="bold" />}
            variant="fill"
            size={size}
            aria-label={`Size ${size}`}
          />
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
        <IconButton
          key={variant}
          icon={<Plus weight="bold" />}
          variant={variant}
          disabled
          aria-label={`${variant} disabled`}
        />
      ))}
    </div>
  ),
};

/** Loading and feedback states (`progress`, `success`, `error`, `pulse`). */
export const Animations: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {animations.map(animation => (
        <div key={String(animation)} className="flex flex-col items-center gap-2">
          <IconButton
            icon={<Plus weight="bold" />}
            variant="fill"
            animation={animation}
            aria-label={String(animation)}
          />
          <span className="text-xs font-medium capitalize text-neutral-50">
            {String(animation)}
          </span>
        </div>
      ))}
    </div>
  ),
};
