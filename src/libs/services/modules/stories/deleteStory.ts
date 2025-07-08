import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export interface DeleteStoryRequest {
  id: number;
}

export interface DeleteStoryResponse {}

const deleteStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<DeleteStoryResponse, DeleteStoryRequest>({
    query: (params) => ({
      url: `stories/${params.id}`,
      method: 'DELETE',
    }),
  });

export default deleteStory;
