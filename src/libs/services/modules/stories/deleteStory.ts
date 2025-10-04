import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const deleteStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<void, number>({
    query: id => ({
      url: `stories/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: 'Story' as const, id: 'LIST' }, // ensures the list refetches
      { type: 'Huber' as const, id: 'MY-STORIES' },
      { type: 'Story' as const, id }, // ensures individual cache is cleared
    ],
  });

export default deleteStory;
