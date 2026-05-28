import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Checkbox from './Checkbox';

const meta = {
  title: 'Core/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    'checked': { control: 'boolean' },
    'disabled': { control: 'boolean' },
    'shape': { control: 'select', options: ['square', 'round'] },
    'aria-label': { control: 'text' },
    'onChange': { action: 'changed' },
  },
  args: {
    checked: false,
    disabled: false,
    shape: 'square',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-neutral-60">Square</span>
        <div className="flex items-center gap-6">
          <Checkbox shape="square" />
          <Checkbox shape="square" checked />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-neutral-60">Round</span>
        <div className="flex items-center gap-6">
          <Checkbox shape="round" />
          <Checkbox shape="round" checked />
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Checkbox />
      <Checkbox checked />
      <Checkbox disabled />
      <Checkbox checked disabled />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(args.checked);
    return (
      <div className="flex items-center gap-3">
        <Checkbox {...args} checked={on} onChange={e => setOn(e.target.checked)} />
        <span className="text-sm text-neutral-30">
          {on ? 'Checked' : 'Unchecked'}
        </span>
      </div>
    );
  },
};
