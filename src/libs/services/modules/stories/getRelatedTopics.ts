import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Topic } from '@/libs/services/modules/topics/topicType';

const getRelatedTopics = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Topic[], number>({
    query: id => ({
      url: `stories/${id}/topics`,
    }),
    providesTags: (_result, _error, id) => [
      { type: 'StoryTopic' as const, id: `LIST-${id}` },
    ],
  });

export default getRelatedTopics;
