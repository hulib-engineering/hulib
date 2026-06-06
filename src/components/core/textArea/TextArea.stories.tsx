import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import TextArea from './TextArea';

const meta = {
  title: 'Core/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Enter text...',
    rows: 3,
    size: 'md',
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Sm</span>
        <TextArea size="sm" placeholder="Small textarea" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Md</span>
        <TextArea size="md" placeholder="Medium textarea" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Lg</span>
        <TextArea size="lg" placeholder="Large textarea" />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Default</span>
        <TextArea placeholder="Default textarea" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Error</span>
        <TextArea placeholder="Error state" error />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Disabled</span>
        <TextArea placeholder="Disabled textarea" disabled />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-neutral-60">Read only</span>
        <TextArea placeholder="Read only" defaultValue="This text cannot be edited." readOnly />
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div className="flex w-80 flex-col gap-3">
        <TextArea
          placeholder="Type something..."
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <span className="text-sm text-neutral-30">
          {value.length > 0 ? `${value.length} characters` : 'Empty'}
        </span>
      </div>
    );
  },
};
