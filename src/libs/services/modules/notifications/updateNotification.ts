import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type UpdateNotificationRequest = {
  id: string;
};

const updateNotification = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<any, UpdateNotificationRequest>({
    query: ({ id }) => ({
      url: `notifications/${id}`,
      method: 'PATCH',
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Notification', id },
      { type: 'Notification', id: 'LIST' },
    ],
  });

export default updateNotification;
