import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

interface StoriesParams {
  page: number;
  limit: number;
}

interface FileType {
  id: string;
  path: string;
}

interface User {
  id: number;
  fullName: string;
}

export interface Story {
  id: number;
  abstract: string;
  title: string;
  cover: FileType;
  humanBook: User;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  rating: number | null;
}

interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
}

const getStories = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Story>, StoriesParams>({
    query: (params) => ({
      url: 'stories',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    }),
    serializeQueryArgs: ({ endpointName }) => {
      return `${endpointName}`;
    },
    merge: (currentCache, newItems, { arg }) => {
      if (arg?.page === 1) {
        return newItems;
      }
      return {
        ...newItems,
        data: [...currentCache.data, ...newItems.data],
      };
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      return currentArg?.page !== previousArg?.page;
    },
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Stories' as const, id })),
            { type: 'Stories' as const, id: 'LIST' },
          ]
        : [{ type: 'Stories' as const, id: 'LIST' }],
  });

export default getStories;
