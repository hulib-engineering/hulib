import { api } from '../../api';
import getStories from './getStories';
import getStoryDetail from './getStoryDetail';

export interface StoriesParams {
  id: number;
}

export interface FileType {
  id: string;
  path: string;
}

interface User {
  id: string;
}

export interface Story {
  id: number;
  abstract: string;
  title: string;
  cover: FileType;
  humanBook: User;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
}

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Story'],
});

const storiesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryDetail: getStoryDetail(build),
    getStories: getStories(build),
  }),
  overrideExisting: false,
});

export const { useGetStoryDetailQuery, useGetStoriesQuery }: any = storiesApi;
