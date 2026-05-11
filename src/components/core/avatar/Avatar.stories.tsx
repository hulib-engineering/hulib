import type { Meta, StoryObj } from '@storybook/react';

import Avatar from './Avatar';
import type { SizeProps } from './private/types';

const SAMPLE_IMAGE = '/assets/images/news/news_0.jpg';

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
      description: 'Background image URL; falls back to placeholder when empty.',
    },
    className: { control: 'text' },
  },
  args: {
    size: 'md',
    imageUrl: SAMPLE_IMAGE,
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

export const Placeholder: Story = {
  args: {
    imageUrl: undefined,
    size: 'md',
  },
};

export const WithImage: Story = {
  args: {
    imageUrl: SAMPLE_IMAGE,
    size: 'lg',
  },
};

/** Every `size` token: xs → 2xl. */
export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Avatar size={s} imageUrl={SAMPLE_IMAGE} />
          <span className="text-xs font-medium capitalize text-neutral-50">{s}</span>
        </div>
      ))}
    </div>
  ),
};

/** Default status badge position (bottom + right). The inner node must use the `status` class for size scaling. */
export const WithStatusOnline: Story = {
  name: 'With status (online)',
  render: () => (
    <Avatar size="lg" imageUrl={SAMPLE_IMAGE}>
      <Avatar.Status>
        <span
          className="status block rounded-full bg-green-60 shadow-[0_0_0_2px_white]"
          aria-hidden
        />
      </Avatar.Status>
    </Avatar>
  ),
};

export const WithStatusOffline: Story = {
  name: 'With status (offline)',
  render: () => (
    <Avatar size="lg" imageUrl={SAMPLE_IMAGE}>
      <Avatar.Status>
        <span
          className="status block rounded-full bg-neutral-60 shadow-[0_0_0_2px_white]"
          aria-hidden
        />
      </Avatar.Status>
    </Avatar>
  ),
};

/** All four `Avatar.Status` `position` combinations. */
export const StatusPositions: Story = {
  name: 'Status — all positions',
  render: () => (
    <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
      {statusPositions.map(({ vertical, horizontal, label }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <Avatar size="xl" imageUrl={SAMPLE_IMAGE}>
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
  name: 'Status — all sizes',
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Avatar size={s} imageUrl={SAMPLE_IMAGE}>
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
