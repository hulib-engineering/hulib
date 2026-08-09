import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { Notification } from './notificationType';

const getNotifications = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<
    PaginatedResponse<Notification> & { unseenCount: number },
    { page?: number; limit?: number }
  >({
    query: params => ({
      url: 'notifications',
      params: {
        page: params?.page,
        limit: params?.limit,
      },
    }),

    // 👇 Group pages sharing the same limit into one cache key, so callers using
    // different limits (e.g. the popup vs. the notifications page) don't share
    // or clobber each other's cached results.
    serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs?.limit ?? 'default'}`,

    // 👇 Merge new results into the cache
    merge: (currentCache, newItems) => {
      currentCache.data.push(...newItems.data);
      currentCache.hasNextPage = newItems.hasNextPage;
      currentCache.unseenCount = newItems.unseenCount; // keep the latest unseen count
    },

    // 👇 Prevent duplicate fetches
    forceRefetch({ currentArg, previousArg }) {
      return currentArg?.page !== previousArg?.page;
    },

    providesTags: [{ type: 'Notification', id: 'LIST' }],
  });

export default getNotifications;
