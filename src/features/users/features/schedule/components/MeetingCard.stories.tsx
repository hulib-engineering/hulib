import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import type { MeetingCardModel } from '../types';
import MeetingCard from './MeetingCard';
import type { CardVariant } from '@/features/users/types/profile';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { makeStore } from '@/libs/store';
import enMessages from '@/locales/en.json';
import viMessages from '@/locales/vi.json';

/**
 * The grid spans three columns at `xl`, so a single card is wrapped at roughly one third of
 * a 1216px content column rather than rendered edge to edge.
 */
const withProviders = (locale: 'en' | 'vi', messages: typeof enMessages) => (
  Story: React.ComponentType,
) => {
  const store = makeStore();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="w-[304px] bg-neutral-98 p-2">
          {children}
        </div>
      </NextIntlClientProvider>
    </Provider>
  );
  return <Wrapper><Story /></Wrapper>;
};

const counterpart = {
  id: 7,
  fullName: 'Tran Thanh Thao',
  photo: { path: '' },
  role: { id: 3, name: 'Liber' },
};

const session: ReadingSession = {
  id: '385',
  humanBookId: '7',
  readerId: '9',
  storyId: '12',
  sessionUrl: 'https://hulib.com/reading?channel=session-385',
  note: '',
  review: '',
  recordingUrl: '',
  sessionStatus: 'approved',
  rejectReason: '',
  startedAt: '2026-02-18T02:00:00.000Z',
  endedAt: '2026-02-18T02:30:00.000Z',
  startTime: '09:00',
  endTime: '09:30',
  feedbacks: [],
  humanBook: { id: '7', fullName: 'Tran Thanh Thao' } as any,
  reader: { id: '9', fullName: 'Minh Anh' } as any,
  story: { id: '12', title: 'A story worth reading' } as any,
};

const makeCard = (variant: CardVariant, overrides: Partial<MeetingCardModel> = {}): MeetingCardModel => ({
  session,
  variant,
  counterpart: counterpart as any,
  isViewerLiber: variant === 'my_request',
  ...overrides,
});

const meta = {
  title: 'Users/Schedule/MeetingCard',
  component: MeetingCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    now: { control: 'date' },
  },
  decorators: [withProviders('en', enMessages)],
} satisfies Meta<typeof MeetingCard>;

export default meta;
type Story = StoryObj<typeof MeetingCard>;

/** 18 Feb 2026, 08:50 UTC — one session is live, one is four days out. */
const NOW = new Date('2026-02-18T01:50:00.000Z');

export const RightNow: Story = {
  args: { card: makeCard('right_now'), now: NOW },
};

export const Upcoming: Story = {
  args: {
    card: makeCard('upcoming', {
      session: {
        ...session,
        startedAt: '2026-02-22T02:00:00.000Z',
        endedAt: '2026-02-22T02:30:00.000Z',
      },
    }),
    now: NOW,
  },
};

/** The backend leaves `sessionUrl` empty until the pre-meeting cron mints the Agora link. */
export const UpcomingWithoutJoinLink: Story = {
  args: {
    card: makeCard('upcoming', {
      session: { ...session, sessionUrl: '', startedAt: '2026-02-22T02:00:00.000Z' },
    }),
    now: NOW,
  },
};

export const Invitation: Story = {
  args: { card: makeCard('invitation', { session: { ...session, sessionStatus: 'pending' } }), now: NOW },
};

export const MyRequest: Story = {
  args: { card: makeCard('my_request', { session: { ...session, sessionStatus: 'pending' } }), now: NOW },
};

export const Done: Story = {
  args: { card: makeCard('done', { session: { ...session, sessionStatus: 'finished' } }), now: NOW },
};

/**
 * A Liber counterpart renders the orange "Liber" chip instead of the blue verified tick —
 * the design's done card shows exactly that pairing.
 */
export const DoneWithLiberCounterpart: Story = {
  args: {
    card: makeCard('done', {
      session: { ...session, sessionStatus: 'finished' },
      counterpart: { id: 9, fullName: 'Persephone', photo: { path: '' }, role: { id: 3, name: 'Liber' } } as any,
    }),
    now: NOW,
  },
};

export const Missed: Story = {
  args: { card: makeCard('missed', { session: { ...session, sessionStatus: 'missed' } }), now: NOW },
};

export const MyRequestVi: Story = {
  ...MyRequest,
  decorators: [withProviders('vi', viMessages)],
};
