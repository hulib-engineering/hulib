import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { Story } from './storiesType';

export interface UpdateStoryRequest {
  id: number;
  title: string;
  abstract: string;
  topicIds: number[];
  cover: {
    id: string;
  };
  humanBook: {
    id: number;
  };
  publishStatus: string;
}

export interface UpdateStoryResponse extends Story {}

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
    invalidatesTags: [{ type: 'Stories', id: 'LIST' }],
  });

export default updateStory;
