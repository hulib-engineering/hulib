import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const deleteStoryReview = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<void, number>({
    query: id => ({
      url: `story-reviews/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: 'StoryReview' as const, id },
      { type: 'StoryReview' as const, id: 'LIST' },
    ],
  });

export default deleteStoryReview;
