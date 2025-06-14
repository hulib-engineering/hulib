import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { Notification } from './notificationType';

const getNotifications = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<
    PaginatedResponse<Notification>,
    { page?: number; limit?: number }
  >({
    query: (params) => ({
      url: 'notifications',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    }),
    providesTags: [{ type: 'Notification' }],
  });

export default getNotifications;
