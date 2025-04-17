import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { Story } from './storiesType';

export interface CreateStoryRequest {
  title: string;
  abstract: string;
  topicIds: number[];
  cover: {
    id: string;
  };
  humanBook: {
    id: number;
  };
}

export interface CreateStoryResponse extends Story {}

const createStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<CreateStoryResponse, CreateStoryRequest>({
    query: (body) => ({
      url: 'stories',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Stories', id: 'LIST' }],
  });

export default createStory;
