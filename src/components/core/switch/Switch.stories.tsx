import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Switch from './Switch';

const meta = {
  title: 'Core/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    'checked': { control: 'boolean' },
    'disabled': { control: 'boolean' },
    'className': { control: 'text' },
    'thumbClassName': { control: 'text' },
    'aria-label': { control: 'text' },
    'onChange': { action: 'changed' },
  },
  args: {
    'checked': false,
    'disabled': false,
    'aria-label': 'Toggle setting',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Switch checked={false} onChange={() => {}} aria-label="Off" />
      <Switch checked onChange={() => {}} aria-label="On" />
      <Switch checked={false} onChange={() => {}} disabled aria-label="Off disabled" />
      <Switch checked onChange={() => {}} disabled aria-label="On disabled" />
    </div>
  ),
};

/** Interactive controlled story to confirm parent state stays in sync. */
export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(args.checked);
    return (
      <div className="flex items-center gap-3">
        <Switch {...args} checked={on} onChange={setOn} />
        <span className="text-sm text-neutral-30">
          {on ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  },
};
