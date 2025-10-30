import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { ModerationHistory } from '@/libs/services/modules/moderation/type';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<ModerationHistory, { userId: number }>({
    query: payload => ({
      url: '/moderation/ban',
      method: 'POST',
      body: payload,
    }),
  });
