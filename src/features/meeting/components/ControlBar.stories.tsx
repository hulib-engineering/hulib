import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ControlBar } from './ControlBar';

const meta = {
  title: 'Meeting/ControlBar',
  component: ControlBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  decorators: [
    Story => (
      <div className="w-[720px]">
        <Story />
      </div>
    ),
  ],
  args: {
    isMicOn: true,
    isCameraOn: true,
    isSharingScreen: false,
    isReady: true,
    onToggleMic: fn(),
    onToggleCamera: fn(),
    onEndCall: fn(),
    onShareScreen: fn(),
    onReact: fn(),
  },
} satisfies Meta<typeof ControlBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MicMuted: Story = {
  args: { isMicOn: false },
};

export const CameraOff: Story = {
  args: { isCameraOn: false },
};

export const BothOff: Story = {
  args: { isMicOn: false, isCameraOn: false },
};

export const SharingScreen: Story = {
  args: { isSharingScreen: true },
};

export const TracksNotReady: Story = {
  args: { isReady: false },
};

export const ReactionPlaying: Story = {
  args: { isReactionPlaying: true },
};
