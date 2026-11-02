'use client';

import { useMeetingAlert } from '../hooks/useMeetingAlert';
import MeetingAlertFull from './MeetingAlertFull';
import MeetingAlertMini from './MeetingAlertMini';
import { useAppSelector } from '@/libs/hooks';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';

export default function MeetingAlertWidget() {
  const storedUserId = useAppSelector(state => state.auth.userInfo?.id);
  const isSessionHydrated = useAppSelector(state => state.auth.isSessionHydrated);
  const accessToken = useAppSelector(state => state.auth.accessToken);

  // Mounted in the root layout, so on public pages (home, story detail) nothing has
  // populated `userInfo` yet. Skip the request until the session is hydrated and an
  // authenticated token exists, otherwise anonymous pages would fire a 401.
  const { data: personalInfo } = useGetPersonalInfoQuery(undefined, {
    skip: !isSessionHydrated || !accessToken || Boolean(storedUserId),
  });

  const userId = storedUserId ?? personalInfo?.id;
  const {
    items,
    isCollapsed,
    isLoading,
    collapse,
    expand,
  } = useMeetingAlert(userId);

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
