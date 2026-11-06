import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import type { SessionSummaryCardProps } from './SessionSummaryCard';
import { SessionSummaryCard } from './SessionSummaryCard';
import enMessages from '@/locales/en.json';

const withIntl = (Story: React.ComponentType) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
  return <Wrapper><Story /></Wrapper>;
};

const reader = {
  id: 2,
  fullName: 'Thanh Thao',
  photo: { path: '' },
  role: { id: 3, name: 'Liber' },
} as unknown as SessionSummaryCardProps['me'];

const huber = {
  id: 1,
  fullName: 'Dinh Cao Nguyen Quynh',
  photo: { path: '' },
  role: { id: 2, name: 'Huber' },
} as unknown as SessionSummaryCardProps['bookedHuber'];

const meta = {
  title: 'Meeting/SessionSummaryCard',
  component: SessionSummaryCard,
  tags: ['autodocs'],
  decorators: [withIntl],
  args: {
    startedAt: '2026-02-18T02:00:00.000Z',
    startTime: '09:00',
    endTime: '09:30',
    me: reader,
    bookedHuber: huber,
    isVibing: true,
  },
} satisfies Meta<typeof SessionSummaryCard>;

export default meta;
type Story = StoryObj<typeof SessionSummaryCard>;

export const Default: Story = {};
