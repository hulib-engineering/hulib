import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Story, StoryPublishStatus } from './storiesType';

type ReviewStoryRequest = {
  id: number;
  publishStatus: StoryPublishStatus.PUBLISHED | StoryPublishStatus.REJECTED;
  rejectionReason?: string;
};

type ReviewStoryResponse = {} & Story;

const reviewStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<ReviewStoryResponse, ReviewStoryRequest>({
    query: ({ id, ...body }) => ({
      url: `admin/stories/${id}/review`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Story' as const, id: 'LIST' },
      { type: 'Story' as const, id },
    ],
  });

export default reviewStory;
