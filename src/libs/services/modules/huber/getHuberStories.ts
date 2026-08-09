import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { GetHuberStoriesResponse } from '@/libs/services/modules/stories/storiesType';

type GetHuberStoriesParams = {
  page?: number;
  limit?: number;
  publishedOnly?: boolean;
};

const getHuberStories = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) => {
  return build.query<
    GetHuberStoriesResponse,
    { huberId: number } & GetHuberStoriesParams
  >({
    query: ({ huberId, page = 1, limit = 100, publishedOnly }) => ({
      url: `hubers/${huberId}/stories`,
      method: 'GET',
      params: {
        page,
        limit,
        publishedOnly,
      },
    }),
    providesTags: [
      { type: 'Huber' as const, id: 'MY-STORIES' },
    ],
  });
};

export default getHuberStories;
