import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { FeedbackSuccessStep } from './FeedbackSuccessStep';
import { HuberFeedbackStep } from './HuberFeedbackStep';
import { SessionFeedbackStep } from './SessionFeedbackStep';
import type { SessionSummaryCardProps } from './SessionSummaryCard';
import enMessages from '@/locales/en.json';

const withIntl = (Story: React.ComponentType) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
  return <Wrapper><Story /></Wrapper>;
};

const summary = {
  startedAt: '2026-02-18T02:00:00.000Z',
  startTime: '09:00',
  endTime: '09:30',
  isVibing: true,
  me: {
    id: 2,
    fullName: 'Thanh Thao',
    photo: { path: '' },
    role: { id: 3, name: 'Liber' },
  },
  bookedHuber: {
    id: 1,
    fullName: 'Dinh Cao Nguyen Quynh',
    photo: { path: '' },
    role: { id: 2, name: 'Huber' },
  },
} as unknown as Omit<SessionSummaryCardProps, 'className'>;

const meta = {
  title: 'Meeting/FeedbackSteps',
  tags: ['autodocs'],
  decorators: [withIntl],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SessionStep: Story = {
  render: () => (
    <div className="w-[36rem] max-w-full bg-white p-5">
      <SessionFeedbackStep
        summary={summary}
        value={{ feelingRating: 2, satisfactionRating: 2, content: '' }}
        onChange={() => {}}
        onCancel={() => {}}
        onNext={() => {}}
      />
    </div>
  ),
};

export const HuberStep: Story = {
  render: () => (
    <div className="w-[36rem] max-w-full bg-white p-5">
      <HuberFeedbackStep
        huber={summary.bookedHuber}
        value={{ rating: 4, content: '' }}
        onChange={() => {}}
        onSkip={() => {}}
        onConfirm={() => {}}
      />
    </div>
  ),
};

export const SuccessStep: Story = {
  render: () => (
    <div className="w-[36rem] max-w-full bg-white p-5">
      <FeedbackSuccessStep onHome={() => {}} />
    </div>
  ),
};
