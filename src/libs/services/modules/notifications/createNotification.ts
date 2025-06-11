import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type {
  CreateNotificationRequest,
  Notification,
} from './notificationType';

const createNotification = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Notification>, CreateNotificationRequest>({
    query: ({ recipientId, senderId, type, relatedEntityId }) => ({
      url: 'notifications',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientId,
        senderId,
        type,
        relatedEntityId,
      }),
    }),
    invalidatesTags: [{ type: 'Notification' }],
  });

export default createNotification;
