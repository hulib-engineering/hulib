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
  publishStatus: string; // NOTE: This is something BE was supposed to create for the story rather than FE providing - once BE resolved the issue, this one should be removed
};

type CreateStoryResponse = {} & Story;

const createStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<CreateStoryResponse, CreateStoryRequest>({
    query: body => ({
      url: 'stories',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Story', id: 'LIST' }, { type: 'Huber' as const, id: 'MY-STORIES' },
    ],
  });

export default createStory;
