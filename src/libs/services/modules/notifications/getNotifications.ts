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

    // 👇 Merge new results into the cache. Actions like marking a notification as seen
    // invalidate the list tag, which refetches whichever page is currently subscribed
    // to (not necessarily page 1, e.g. after "load more"). If that page's slice was
    // already in the cache, replace it in place instead of appending, otherwise those
    // items would be duplicated. Only a genuinely new page gets appended.
    merge: (currentCache, newItems, { arg }) => {
      const page = arg?.page ?? 1;
      const limit = arg?.limit ?? newItems.data.length;
      const startIndex = (page - 1) * limit;

      if (startIndex < currentCache.data.length) {
        currentCache.data.splice(startIndex, currentCache.data.length - startIndex, ...newItems.data);
      } else {
        currentCache.data.push(...newItems.data);
      }
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
