import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import type { MeetingAlertItem } from '../types';
import MeetingAlertFull from './MeetingAlertFull';
import enMessages from '@/locales/en.json';

const withIntl = (Story: React.ComponentType) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
  return <Wrapper><Story /></Wrapper>;
};

const nowItem: MeetingAlertItem = {
  id: 385,
  startedAt: '2026-11-02T11:55:00.000Z',
  endedAt: '2026-11-02T12:25:00.000Z',
  counterpart: {
    id: 12,
    fullName: 'Tran Thanh Thao',
    photo: { path: '' },
    role: { id: 3, name: 'Liber' },
  },
  countdown: { state: 'now', totalMinutes: 0, hours: 0, minutes: 0 },
};

const laterItem: MeetingAlertItem = {
  id: 386,
  startedAt: '2026-11-02T16:05:00.000Z',
  endedAt: '2026-11-02T16:35:00.000Z',
  counterpart: {
    id: 18,
    fullName: 'Minh Anh',
    photo: { path: '' },
    role: { id: 3, name: 'Liber' },
  },
  countdown: { state: 'upcoming', totalMinutes: 245, hours: 4, minutes: 5 },
};

const meta = {
  title: 'Meeting/MeetingAlert',
  component: MeetingAlertFull,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
  decorators: [withIntl],
  args: {
    href: '/users/9?tab=schedule&section=meeting',
    onCollapse: () => {},
  },
} satisfies Meta<typeof MeetingAlertFull>;

export default meta;
type Story = StoryObj<typeof MeetingAlertFull>;

export const Now: Story = {
  args: { items: [nowItem, laterItem] },
};

export const UpcomingOnly: Story = {
  args: { items: [laterItem] },
};

/** More than two sessions adds the expand/collapse control on the last visible card. */
export const ManyMeetings: Story = {
  args: {
    items: [
      nowItem,
      laterItem,
      { ...laterItem, id: 387, counterpart: { ...laterItem.counterpart, fullName: 'Persephone' } },
      { ...laterItem, id: 388, counterpart: { ...laterItem.counterpart, fullName: 'Minh Anh' } },
    ],
  },
};
