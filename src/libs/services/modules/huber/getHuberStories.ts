import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

export interface GetHuberStoriesParams {
  page?: number;
  limit?: number;
}

export interface Story {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  // Add other story fields as needed
}

export interface GetHuberStoriesResponse {
  data: Story[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const getHuberStories = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) => {
  return build.query<
    GetHuberStoriesResponse,
    { huberId: number } & GetHuberStoriesParams
  >({
    query: ({ huberId, page = 1, limit = 100 }) => ({
      url: `hubers/${huberId}/stories`,
      method: 'GET',
      params: {
        page,
        limit,
      },
    }),
  });
};

export default getHuberStories;
