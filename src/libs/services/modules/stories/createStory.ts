import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { Story } from './storiesType';

export interface CreateStoryRequest {
  title: string;
  abstract: string;
  topics: number[];
  cover: {
    id: string;
  };
}

const createStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<Story, CreateStoryRequest>({
    query: (body) => ({
      url: 'stories',
      method: 'POST',
      body: JSON.stringify(body),
    }),
    invalidatesTags: [{ type: 'Stories', id: 'LIST' }],
  });

export default createStory;
