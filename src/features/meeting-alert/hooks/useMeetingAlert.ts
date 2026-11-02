'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { MeetingAlertItem, UseMeetingAlertResult } from '../types';
import { getCountdown } from '../utils/countdown';
import { toUpcomingSessions } from '../utils/upcoming';
import { usePathname } from '@/libs/i18nNavigation';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';
import {
  USE_UPCOMING_ENDPOINT,
  useGetReadingSessionsQuery,
  useGetUpcomingReadingSessionsQuery,
} from '@/libs/services/modules/reading-session';
import type { UpcomingReadingSessionsResponse } from '@/libs/services/modules/reading-session/getUpcomingReadingSessions';

const WITHIN_HOURS = 24;
const CLOCK_TICK_MS = 30_000;
const FALLBACK_LOOKBACK_MS = 2 * 60 * 60 * 1000;
const STORAGE_PREFIX = 'hulib.meeting-alert';

function readStorage<T>(key: string | null, fallback: T): T {
  if (!key || typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string | null, value: unknown) {
  if (!key || typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode / quota); the widget still works for this visit.
  }
}

export function useMeetingAlert(userId?: number | string): UseMeetingAlertResult {
  const pathname = usePathname();
  const isEnabled = Boolean(userId);

  // Local clock used for countdowns. 30s is frequent enough for minute-level copy
  // without re-rendering every second.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), CLOCK_TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  // Frozen at mount and moved only on navigation. The fallback endpoint takes a time
  // window, so deriving it from the ticking clock would create a new cache key and
  // refetch every minute.
  const [fetchAnchor, setFetchAnchor] = useState(() => Date.now());

  const upcomingQuery = useGetUpcomingReadingSessionsQuery(
    { withinHours: WITHIN_HOURS, limit: 20 },
    { skip: !isEnabled || !USE_UPCOMING_ENDPOINT },
  );

  const fallbackParams = useMemo(() => {
    return {
      sessionStatuses: ['approved'] as StatusType[],
      startedAt: new Date(fetchAnchor - FALLBACK_LOOKBACK_MS).toISOString(),
      endedAt: new Date(fetchAnchor + (WITHIN_HOURS + 1) * 60 * 60 * 1000).toISOString(),
      limit: 100,
    };
  }, [fetchAnchor]);

  const fallbackQuery = useGetReadingSessionsQuery(fallbackParams, {
    skip: !isEnabled || USE_UPCOMING_ENDPOINT,
  });

  const refetchUpcoming = USE_UPCOMING_ENDPOINT ? upcomingQuery.refetch : fallbackQuery.refetch;
  const lastPathnameRef = useRef(pathname);
  useEffect(() => {
    if (lastPathnameRef.current === pathname) {
      return;
    }
    lastPathnameRef.current = pathname;

    if (!isEnabled) {
      return;
    }

    if (USE_UPCOMING_ENDPOINT) {
      refetchUpcoming();
    } else {
      setFetchAnchor(Date.now());
    }
  }, [isEnabled, pathname, refetchUpcoming]);

  const response = useMemo<UpcomingReadingSessionsResponse | undefined>(() => {
    if (USE_UPCOMING_ENDPOINT) {
      return upcomingQuery.data;
    }
    return toUpcomingSessions(
      fallbackQuery.data?.data,
      userId,
      new Date(fetchAnchor),
      WITHIN_HOURS,
    );
  }, [fallbackQuery.data, fetchAnchor, upcomingQuery.data, userId]);

  // The API's `serverTime` is captured on arrival and turned into a stable skew;
  // recomputing it on every render would silently freeze the countdown. The
  // fallback adapter has no server clock, so it uses the browser's.
  const serverTime = USE_UPCOMING_ENDPOINT ? response?.meta.serverTime : undefined;
  const [skewMs, setSkewMs] = useState(0);
  const lastServerTimeRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!serverTime || serverTime === lastServerTimeRef.current) {
      return;
    }
    lastServerTimeRef.current = serverTime;
    const serverMs = new Date(serverTime).getTime();
    if (!Number.isNaN(serverMs)) {
      setSkewMs(serverMs - Date.now());
    }
  }, [serverTime]);

  const effectiveNow = useMemo(() => new Date(now.getTime() + skewMs), [now, skewMs]);

  const collapsedKey = userId ? `${STORAGE_PREFIX}.collapsed.v1.${userId}` : null;

  // Defaults on the first render keep SSR and hydration identical; the effect
  // below loads the persisted value once auth has hydrated.
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(readStorage<boolean>(collapsedKey, false));
  }, [collapsedKey]);

  const items = useMemo<MeetingAlertItem[]>(() => {
    if (!response) {
      return [];
    }

    return response.data
      .map(session => ({
        id: session.id,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        counterpart: session.counterpart,
        countdown: getCountdown(session.startedAt, session.endedAt, effectiveNow),
      }))
      .filter((item): item is MeetingAlertItem =>
        item.countdown !== null && item.countdown.state !== 'ended')
      .sort((a, b) => {
        const aIsNow = a.countdown.state === 'now' ? 0 : 1;
        const bIsNow = b.countdown.state === 'now' ? 0 : 1;
        if (aIsNow !== bIsNow) {
          return aIsNow - bIsNow;
        }
        return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
      });
  }, [response, effectiveNow]);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    writeStorage(collapsedKey, true);
  }, [collapsedKey]);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    writeStorage(collapsedKey, false);
  }, [collapsedKey]);

  const isLoading = isEnabled
    && (USE_UPCOMING_ENDPOINT ? upcomingQuery.isLoading : fallbackQuery.isLoading);

  return {
    items,
    isCollapsed,
    isLoading,
    collapse,
    expand,
  };
}
