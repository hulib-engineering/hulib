import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { CreateTopicParams, Topic } from './topicType';

const postTopics = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<Topic, CreateTopicParams>({
    query: (body) => ({
      url: 'topics',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Topics' as const, id: 'LIST' }],
  });

export default postTopics;
