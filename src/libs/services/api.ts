import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { getSession } from 'next-auth/react';

import type { RootState } from '../store';
import { logout, refreshAccessToken } from '../store/authentication';
import { AppConfig } from '@/utils/AppConfig';

// Dedupe concurrent getSession() calls: a page can fire many RTK Query
// requests in the same tick before AuthSessionSync has hydrated the store,
// and each one hitting prepareHeaders would otherwise trigger its own
// /api/auth/session fetch. They share this single in-flight promise instead.
let inflightSessionPromise: ReturnType<typeof getSession> | null = null;
function getSessionDeduped() {
  if (!inflightSessionPromise) {
    inflightSessionPromise = getSession().finally(() => {
      inflightSessionPromise = null;
    });
  }
  return inflightSessionPromise;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${AppConfig.api.endpoint}/${AppConfig.api.version}/`,
  prepareHeaders: async (headers, { getState }) => {
    // By default, if we have a token in the resto, let's use that for authenticated requests
    headers.set('hulib-service-key', 'hlb-93td6qrktpz6xrm4jj6dejgmffm4ya_pk');

    // AuthSessionSync keeps this in Redux, so the common case is a synchronous
    // read with no network call at all. isSessionHydrated (not accessToken
    // presence) gates the fallback below, since an anonymous/public page has
    // a real, permanently empty accessToken — checking truthiness alone would
    // hit getSession() on every single request on those pages forever.
    const { accessToken: cachedAccessToken, isSessionHydrated } = (getState() as RootState).auth;
    let accessToken = cachedAccessToken;

    // Fallback for the brief window before AuthSessionSync's first effect has
    // run (e.g. the very first request(s) right after page load) — only hits
    // next-auth's getSession() (a real network call) until the store is hydrated.
    if (!isSessionHydrated) {
      const session: any = await getSessionDeduped();
      accessToken = session?.accessToken;
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
  credentials: 'include',
});

const mutex = new Mutex(); // create a new mutex

// Using async-mutex to prevent multiple calls to '/refresh' when multiple calls fail with 401 Unauthorized errors
const baseQueryWithInterceptor = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  // Check if args is an object (FetchArgs) and not a string
  if (typeof args !== 'string') {
    if (!args.headers) {
      args.headers = new Headers();
    }

    // For regular POST requests, set application/json
    if (args.method === 'POST' && !(args.body instanceof FormData)) {
      (args.headers as Headers).set('Content-Type', 'application/json');
    }

    // For FormData, we don't set Content-Type - browser will handle it
    if (args.method === 'POST' && args.body instanceof FormData) {
      // Remove Content-Type header if it exists
      (args.headers as Headers).delete('Content-Type');
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (
    api.endpoint !== 'loginAsAdmin'
    && api.endpoint !== 'loginAsUser'
    && result.error
    && result.error.status === 401
  ) {
    // here we can deal with 401 error
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const hasLoggedIn = localStorage.getItem('hasLoggedIn');

      try {
        if (hasLoggedIn) {
          const refreshRoute
            = localStorage.getItem('role') === 'admin'
              ? 'admin/profile/refresh'
              : 'profile/refresh';

          const refreshResult = await baseQuery(
            refreshRoute,
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            // Store the new token
            api.dispatch(refreshAccessToken(refreshResult.data));
            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // If refresh token fails, logout
            api.dispatch(logout());
            return result;
          }
        }
      } catch {
        // If any error occurs during refresh, logout
        api.dispatch(logout());
        return result;
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  if (result.error) {
    // 304 Not Modified = treat is treated as error by the server, so we need to return null
    const rawError = result.error as any;
    const isNotModifiedStatus = rawError.originalStatus === 304
      || rawError.status === 304
      || (typeof rawError.status === 'string' && rawError.status.includes('304'));

    if (isNotModifiedStatus) {
      return { data: null };
    }
  }

  // Return errors instead of throwing: throwing from a baseQuery escapes RTK
  // Query's error channel, so a failed query surfaces as an uncaught rejection
  // rather than `isError` on the hook. Returning keeps `.unwrap()` rejecting
  // for mutations while letting queries handle errors normally.
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    'User',
    'OTP',
    'AgoraChat',
    'Chat',
    'Messages',
    'Notification',
    'Timeslot',
    'Story',
    'FavoriteStory',
    'FavoriteHuber',
    'StoryTopic',
    'StoryReview',
    'StoryReviewOverview',
    'Report',
  ],
  endpoints: () => ({}),
});
