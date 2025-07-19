import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Story } from './storiesType';

type CreateStoryRequest = {
  title: string;
  abstract: string;
  topicIds: number[];
  cover: {
    id: string;
  };
  humanBook: {
    id: number;
  };
};

type CreateStoryResponse = {} & Story;

const createStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<CreateStoryResponse, CreateStoryRequest>({
    query: body => ({
      url: 'stories',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Stories', id: 'LIST' }],
  });

export default createStory;
