import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { getSession } from 'next-auth/react';

import { logout, refreshAccessToken } from '../store/authentication';
import { AppConfig } from '@/utils/AppConfig';

const baseQuery = fetchBaseQuery({
  baseUrl: `${AppConfig.api.endpoint}/${AppConfig.api.version}/`,
  prepareHeaders: async (headers) => {
    // By default, if we have a token in the resto, let's use that for authenticated requests
    headers.set('hulib-service-key', 'hlb-93td6qrktpz6xrm4jj6dejgmffm4ya_pk');

    const session: any = await getSession();

    if (session) {
      headers.set('Authorization', `Bearer ${session.accessToken}`);
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
      } catch (err) {
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

  if (result.error && result.error.status === 422) {
    return result;
  }

  if (result.error) {
    throw new Error('error_contact_admin');
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ['User', 'OTP', 'AgoraChat', 'Chat', 'Messages', 'Notification', 'Timeslot', 'Story', 'FavoriteStory', 'StoryTopic'],
  endpoints: () => ({}),
});
