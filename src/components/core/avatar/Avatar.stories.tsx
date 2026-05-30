import type { Meta, StoryObj } from '@storybook/react';

import Avatar from './Avatar';
import type { SizeProps } from './private/types';

const sizes: SizeProps[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const statusPositions = [
  { vertical: 'bottom' as const, horizontal: 'right' as const, label: 'Bottom right' },
  { vertical: 'bottom' as const, horizontal: 'left' as const, label: 'Bottom left' },
  { vertical: 'top' as const, horizontal: 'right' as const, label: 'Top right' },
  { vertical: 'top' as const, horizontal: 'left' as const, label: 'Top left' },
];

const meta = {
  title: 'Core/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
      description: 'Preset size (maps to Tailwind `size-*` in Wrapper).',
    },
    imageUrl: {
      control: 'text',
      description: 'Background image URL; falls back to generated avatar when empty.',
    },
    className: { control: 'text' },
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

/** Default status badge position (bottom + right). The inner node must use the `status` class for size scaling. */
export const WithStatusOnline: Story = {
  name: 'With status (online & offline)',
  render: () => (
    <div className="grid grid-cols-2 gap-10">
      <Avatar size="lg">
        <Avatar.Status>
          <span
            className="status block rounded-full bg-green-60 shadow-[0_0_0_2px_white]"
            aria-hidden
          />
        </Avatar.Status>
      </Avatar>
      <Avatar size="lg">
        <Avatar.Status>
          <span
            className="status block rounded-full bg-neutral-60 shadow-[0_0_0_2px_white]"
            aria-hidden
          />
        </Avatar.Status>
      </Avatar>
    </div>
  ),
};

/** All four `Avatar.Status` `position` combinations. */
export const StatusPositions: Story = {
  name: 'Status — all positions',
  render: () => (
    <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
      {statusPositions.map(({ vertical, horizontal, label }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <Avatar size="xl">
            <Avatar.Status position={{ vertical, horizontal }}>
              <span
                className="status block rounded-full bg-green-60 shadow-[0_0_0_2px_white]"
                aria-hidden
              />
            </Avatar.Status>
          </Avatar>
          <span className="max-w-32 text-center text-xs text-neutral-50">{label}</span>
        </div>
      ))}
    </div>
  ),
};

/** Status indicator at each size (spacing scales via `[&_.status]:…` on the root). */
export const StatusAllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Avatar size={s}>
            <Avatar.Status>
              <span
                className="status block rounded-full bg-green-60 shadow-[0_0_0_2px_white]"
                aria-hidden
              />
            </Avatar.Status>
          </Avatar>
          <span className="text-xs font-medium capitalize text-neutral-50">{s}</span>
        </div>
      ))}
    </div>
  ),
};
