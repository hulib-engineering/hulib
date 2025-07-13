import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type GetHuberStoriesParams = {
  page?: number;
  limit?: number;
};

type Story = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  // Add other story fields as needed
};

type GetHuberStoriesResponse = {
  data: Story[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};

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
