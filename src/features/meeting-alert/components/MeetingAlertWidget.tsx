'use client';

import { useMeetingAlert } from '../hooks/useMeetingAlert';
import MeetingAlertFull from './MeetingAlertFull';
import MeetingAlertMini from './MeetingAlertMini';
import { useAppSelector } from '@/libs/hooks';

export default function MeetingAlertWidget() {
  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const {
    items,
    isCollapsed,
    isLoading,
    collapse,
    expand,
  } = useMeetingAlert();

  if (!userId || isLoading || items.length === 0) {
    return null;
  }

  const href = `/users/${userId}?tab=schedule&section=meeting`;
  const nearest = items[0];
  if (!nearest) {
    return null;
  }
  const isLive = nearest.countdown.state === 'now';

  if (isCollapsed) {
    return (
      <MeetingAlertMini
        isLive={isLive}
        minutesUntilNext={isLive ? null : nearest.countdown.totalMinutes}
        onExpand={expand}
      />
    );
  }

  return (
    <MeetingAlertFull
      items={items}
      href={href}
      onCollapse={collapse}
    />
  );
}
