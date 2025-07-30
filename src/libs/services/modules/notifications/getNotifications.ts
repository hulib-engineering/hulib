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
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    }),
    providesTags: [{ type: 'Notification', id: 'LIST' }],
  });

export default getNotifications;
