import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import MeetingAlertMini from './MeetingAlertMini';
import enMessages from '@/locales/en.json';

const withIntl = (Story: React.ComponentType) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
  return <Wrapper><Story /></Wrapper>;
};

const meta = {
  title: 'Meeting/MeetingAlertMini',
  component: MeetingAlertMini,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
  decorators: [withIntl],
  args: {
    count: 2,
    isLive: false,
    minutesUntilNext: 10,
    onExpand: () => {},
  },
} satisfies Meta<typeof MeetingAlertMini>;

export default meta;
type Story = StoryObj<typeof MeetingAlertMini>;

export const Countdown: Story = {};

export const Live: Story = {
  args: { isLive: true, minutesUntilNext: null },
};

export const LargeCountdown: Story = {
  args: { minutesUntilNext: 240 },
};
