import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Topic, UpdateTopicParams } from './topicType';

const updateTopic = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<Topic, UpdateTopicParams>({
    query: ({ id, ...body }) => ({
      url: `topics/${id}`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Topics' as const, id },
      { type: 'Topics' as const, id: 'LIST' },
    ],
  });

export default updateTopic;
