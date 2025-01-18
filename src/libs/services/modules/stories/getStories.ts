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
  id: string;
}

interface Story {
  id: number;
  abstract: string;
  title: string;
  cover: FileType;
  humanBook: User;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
}

const getStories = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Story>, StoriesParams>({
    query: () => `stories`,
    providesTags: [{ type: 'Story', id: 'ME' }],
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${queryArgs?.page}, ${queryArgs?.limit})`;
    },
  });

export default getStories;
