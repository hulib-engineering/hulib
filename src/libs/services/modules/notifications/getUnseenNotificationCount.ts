import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const getUnseenNotificationCount = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<{ unseenCount: number }, void>({
    query: () => 'notifications/unseen-count',
    providesTags: [{ type: 'Notification', id: 'UNSEEN_COUNT' }],
  });

export default getUnseenNotificationCount;
