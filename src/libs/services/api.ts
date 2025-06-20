import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { getSession } from 'next-auth/react';

import { AppConfig } from '@/utils/AppConfig';

import { logout, refreshAccessToken } from '../store/authentication';

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
  extraOptions: {},
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

  const result = await baseQuery(args, api, extraOptions);
  if (
    api.endpoint !== 'loginAsAdmin' &&
    api.endpoint !== 'loginAsUser' &&
    result.error &&
    result.error.status === 401
  ) {
    // here we can deal with 401 error
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const hasLoggedIn = localStorage.getItem('hasLoggedIn');
      if (hasLoggedIn) {
        const refreshRoute =
          localStorage.getItem('role') === 'admin'
            ? 'admin/profile/refresh'
            : 'profile/refresh';
        try {
          const refreshResult = await baseQuery(
            refreshRoute,
            api,
            extraOptions,
          );
          if (refreshResult.data) {
            // resto the new token
            api.dispatch(refreshAccessToken(refreshResult.data));
            // retry the initial query
            await baseQuery(args, api, extraOptions);
          } else {
            // retry the initial query
            api.dispatch(logout());
          }
        } catch (err) {
          // console.log(err);
          api.dispatch(logout());
        } finally {
          // release must be called once the mutex should be released again.
          release();
        }
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      baseQuery(args, api, extraOptions);
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
  tagTypes: ['User', 'OTP'],
  endpoints: () => ({}),
});
