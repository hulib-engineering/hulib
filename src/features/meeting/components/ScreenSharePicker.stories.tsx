import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';

import { ScreenSharePicker } from './ScreenSharePicker';

const meta = {
  title: 'Meeting/ScreenSharePicker',
  component: ScreenSharePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  decorators: [
    Story => (
      <div className="relative h-40 w-[420px]">
        <Story />
      </div>
    ),
  ],
  args: {
    sources: [
      { deviceId: 'screen:0:0', kind: 'screen', label: 'Screen 1' },
      { deviceId: 'screen:0:1', kind: 'screen', label: 'Screen 2' },
      { deviceId: 'window:1:0', kind: 'window', label: 'Browser window' },
    ],
    includeAudio: false,
    onIncludeAudioChange: fn(),
    onSelect: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ScreenSharePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAudioEnabled: Story = {
  args: { includeAudio: true },
};

/**
 * Firefox and Safari frequently expose no display sources until a capture
 * permission prompt has been answered — this is the degrade path.
 */
export const NoSourcesAvailable: Story = {
  args: { sources: [] },
};

export const ControlledAudioToggle: Story = {
  render: function Render(args) {
    const [withAudio, setWithAudio] = useState(false);
    return (
      <ScreenSharePicker
        {...args}
        includeAudio={withAudio}
        onIncludeAudioChange={setWithAudio}
      />
    );
  },
};
