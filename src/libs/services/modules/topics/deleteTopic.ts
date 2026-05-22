import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const deleteTopic = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<void, number>({
    query: id => ({
      url: `topics/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: 'Topics' as const, id },
      { type: 'Topics' as const, id: 'LIST' },
    ],
  });

export default deleteTopic;
