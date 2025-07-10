import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Topic } from './topicType';

const getTopicById = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Topic, string>({
    query: (topicId) => ({
      url: `topics/${topicId}`,
    }),
    providesTags: (result, error, topicId) =>
      result
        ? [{ type: 'Topics' as const, id: topicId }]
        : [{ type: 'Topics' as const, id: 'LIST' }],
  });

export default getTopicById;
