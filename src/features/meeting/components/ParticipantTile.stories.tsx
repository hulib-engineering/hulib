import type { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';

import { ParticipantTile } from './ParticipantTile';

const meta = {
  title: 'Meeting/ParticipantTile',
  component: ParticipantTile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  decorators: [
    Story => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ParticipantTile>;

export default meta;
type Story = StoryObj<typeof meta>;

const local = {
  id: '1',
  name: 'You',
  avatarUrl: undefined,
  role: 'liber' as const,
  isLocal: true,
  isMicOn: true,
  isCameraOn: false,
};

const remote = {
  id: '2',
  name: 'Nguyen Van A',
  avatarUrl: undefined,
  role: 'huber' as const,
  isLocal: false,
  isMicOn: false,
  isCameraOn: false,
};

export const LocalCameraOff: Story = {
  args: { participant: local },
};

export const RemoteCameraOff: Story = {
  args: { participant: remote },
};

export const WaitingForPartner: Story = {
  args: { participant: remote, isWaiting: true },
};

export const RemoteMutedWithCameraOn: Story = {
  args: { participant: { ...remote, isMicOn: false, isCameraOn: true } },
};

export const CompactRailTile: Story = {
  args: { participant: remote, isCompact: true },
};

export const ReactionPlaying: Story = {
  render: function Render(args) {
    const ref = useRef<HTMLDivElement>(null);
    return <ParticipantTile {...args} videoRef={ref} isReactionShown />;
  },
};