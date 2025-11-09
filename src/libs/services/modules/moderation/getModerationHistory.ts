import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { User } from '@/features/users/types';
import type { ModerationHistoryParams } from '@/libs/services/modules/moderation/type';

const getModerationHistory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<User>, ModerationHistoryParams>({
    query: params => ({
      url: 'moderations',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 12,
        userId: params?.userId,
      },
    }),
  });

export default getModerationHistory;
