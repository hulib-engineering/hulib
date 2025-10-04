import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Story } from './storiesType';

type UpdateStoryRequest = {
  id: number;
  title: string;
  abstract: string;
  topics: number[];
  cover: {
    id: string;
  };
  humanBook: {
    id: number;
  };
  publishStatus: string;
};

type UpdateStoryResponse = {} & Story;

const updateStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<UpdateStoryResponse, UpdateStoryRequest>({
    query: ({ id, ...body }) => ({
      url: `stories/${id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }),
    invalidatesTags: (_result, _error, { id, topics }) => [
      { type: 'Stories', id: 'LIST' },
      { type: 'Stories', id },
      topics ? { type: 'StoryTopic' as const, id: `LIST-${id}` } : 'Stories',
    ],
  });

export default updateStory;
