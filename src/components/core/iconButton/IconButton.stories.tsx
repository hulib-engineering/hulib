import type { Meta, StoryObj } from '@storybook/react';
import {
  ArrowLeft,
  ArrowRight,
  PencilSimple,
  Plus,
  Trash,
} from '@phosphor-icons/react';

import IconButton from './IconButton';
import type { ButtonAnimations, ButtonSizes, ButtonVariants } from '@/components/core/button/private/types';

const variants: ButtonVariants[] = [
  'fill',
  'outline',
  'ghost',
  'primary',
  'secondary',
  'tertiary',
];

const sizes: ButtonSizes[] = ['sm', 'md', 'lg'];

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
            size="md"
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

export const Disabled: Story = {
  args: {
    'disabled': true,
    'aria-label': 'Disabled icon button',
  },
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
            size="md"
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

/** Circular table actions (admin tags). */
export const TableActions: Story = {
  name: 'Table actions',
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton
        type="button"
        icon={<PencilSimple className="text-neutral-10" />}
        variant="outline"
        size="lg"
        aria-label="Edit topic"
        className="size-11 shrink-0 rounded-full border-neutral-variant-80 bg-white hover:bg-neutral-98"
      />
      <IconButton
        type="button"
        icon={<Trash className="text-white" weight="fill" />}
        variant="fill"
        size="lg"
        aria-label="Delete topic"
        className="size-11 shrink-0 rounded-full border-red-60 bg-red-50 hover:bg-red-60"
      />
    </div>
  ),
};

/** Pagination prev/next (ghost, compact). */
export const PaginationControls: Story = {
  name: 'Pagination controls',
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton
        icon={<ArrowLeft className="text-neutral-40" />}
        variant="ghost"
        size="md"
        className="size-8 rounded-2xl"
        aria-label="Previous page"
      />
      <IconButton
        icon={<ArrowRight className="text-neutral-40" />}
        variant="ghost"
        size="md"
        className="size-8 rounded-2xl"
        aria-label="Next page"
      />
    </div>
  ),
};
