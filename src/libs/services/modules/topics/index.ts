import { api } from '../../api';
import getTopics from './getTopics';

export interface Topic {
  id?: number | undefined;
  name?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
}

export interface GetTopicsParams {
  page?: number;
  limit?: number;
  name?: string;
}

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Topics'],
});

export const authApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTopics: getTopics(build),
  }),
  overrideExisting: false,
});

export const { useGetTopicsQuery }: any = authApi;
