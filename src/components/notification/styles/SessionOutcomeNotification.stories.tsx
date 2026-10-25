import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';

import { NotificationType } from '../private/types';
import SessionOutcomeNotificationCard from './SessionOutcomeNotification';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import enMessages from '@/locales/en.json';
import viMessages from '@/locales/vi.json';

// The backend sends a pre-rendered English message in `extraNote`; the card must ignore it, so
// the fixtures below deliberately carry one to prove the locale copy wins.
const baseSession = {
  id: 385,
  startedAt: '2025-02-05T00:00:00.000Z',
  startTime: '11:00',
  endTime: '11:30',
  sessionStatus: 'canceled',
  humanBook: { id: 7, fullName: 'Tran Thanh Thao' },
};

const baseNotification: Notification = {
  id: 1,
  seen: false,
  relatedEntityId: 385,
  createdAt: '2025-02-05T04:12:00.000Z',
  updatedAt: '2025-02-05T04:12:00.000Z',
  deletedAt: null,
  type: { id: 1, name: NotificationType.SESSION_AUTO_CANCELLATION },
  recipient: { id: 9, fullName: 'Minh Anh', photo: null },
  sender: { id: 1, fullName: 'Hulib System', photo: null },
  relatedEntity: baseSession,
  extraNote: 'Sorry! Your meeting request has been auto cancelled because Tran Thanh Thao has not responded yet.',
};

const withLocale = (locale: 'en' | 'vi', messages: typeof enMessages) => (
  Story: React.ComponentType,
) => (
  <NextIntlClientProvider locale={locale} messages={messages}>
    <div className="w-[480px] bg-white p-2">
      <Story />
    </div>
  </NextIntlClientProvider>
);

const meta = {
  title: 'Notifications/SessionOutcomeNotification',
  component: SessionOutcomeNotificationCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    showExtras: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    notification: baseNotification,
    onClick: () => {},
  },
  decorators: [withLocale('en', enMessages)],
} satisfies Meta<typeof SessionOutcomeNotificationCard>;

export default meta;
type Story = StoryObj<typeof SessionOutcomeNotificationCard>;

export const AutoCancelledEn: Story = {};

export const AutoCancelledVi: Story = {
  decorators: [withLocale('vi', viMessages)],
};

export const HuberNoShowEn: Story = {
  args: {
    notification: {
      ...baseNotification,
      type: { id: 2, name: NotificationType.HUBER_NO_SHOW },
      relatedEntity: { ...baseSession, sessionStatus: 'missed' },
    },
  },
};

export const HuberNoShowVi: Story = {
  ...HuberNoShowEn,
  decorators: [withLocale('vi', viMessages)],
};

/** The notification page renders at 72px avatars; the popover stays at 56px. */
export const SeenAtFullWidth: Story = {
  args: {
    notification: { ...baseNotification, seen: true },
    showExtras: true,
  },
};
