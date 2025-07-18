import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type DeleteStoryRequest = {
  id: number;
};

const deleteStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<object, DeleteStoryRequest>({
    query: params => ({
      url: `stories/${params.id}`,
      method: 'DELETE',
    }),
  });

export default deleteStory;
