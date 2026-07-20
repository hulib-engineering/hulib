import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type Response = {
  id: string;
  shareCount: string | number;
  sharedUserIds: string[];
};
const shareStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<Response, { storyId: number; userId: string }>({
    query: ({ storyId, userId }) => ({
      url: `stories/${storyId}/share`,
      method: 'POST',
      body: {
        userId,
      },
    }),
  });

export default shareStory;
