import type { Countdown } from './utils/countdown';
import type { UpcomingReadingSessionCounterpart } from '@/libs/services/modules/reading-session/getUpcomingReadingSessions';

export type MeetingAlertItem = {
  id: number;
  startedAt: string;
  endedAt: string;
  counterpart: UpcomingReadingSessionCounterpart;
  countdown: Countdown;
};

export type UseMeetingAlertResult = {
  items: MeetingAlertItem[];
  isCollapsed: boolean;
  isLoading: boolean;
  collapse: () => void;
  expand: () => void;
};
