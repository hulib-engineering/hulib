'use client';

import { useMeetingAlert } from '../hooks/useMeetingAlert';
import MeetingAlertFull from './MeetingAlertFull';
import MeetingAlertMini from './MeetingAlertMini';
import { useAppSelector } from '@/libs/hooks';

export default function MeetingAlertWidget() {
  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const {
    items,
    count,
    isCollapsed,
    isLoading,
    collapse,
    expand,
    dismissAll,
  } = useMeetingAlert();

  if (!userId || isLoading || items.length === 0) {
    return null;
  }

  const href = `/users/${userId}?tab=schedule&section=meeting`;
  const nearest = items[0];
  const isLive = nearest.countdown.state === 'now';

  if (isCollapsed) {
    return (
      <MeetingAlertMini
        count={count}
        isLive={isLive}
        minutesUntilNext={isLive ? null : nearest.countdown.totalMinutes}
        onExpand={expand}
      />
    );
  }

  return (
    <MeetingAlertFull
      items={items}
      count={count}
      href={href}
      onCollapse={collapse}
      onDismissAll={dismissAll}
    />
  );
}
