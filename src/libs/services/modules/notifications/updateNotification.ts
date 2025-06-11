import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type UpdateNotificationRequest = {
  id: string;
};

const updateNotification = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<void, UpdateNotificationRequest>({
    query: ({ id }) => ({
      url: `/api/v1/notifications/${id}/Update Seen Notification`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: undefined,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'Notification', id }],
  });

export default updateNotification;
