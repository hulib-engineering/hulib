import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { Story } from '../stories/storiesType';

export type GetMyFavoritesParams = {
  page?: number;
  limit?: number;
};

const getMyFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<Story>, GetMyFavoritesParams | void>({
    query: params => ({
      url: 'auth/me/favorites',
      params: params
        ? { page: params.page ?? 1, limit: params.limit ?? 8 }
        : undefined,
    }),
    providesTags: [{ type: 'FavoriteStory', id: 'LIST' }],
  });

export default getMyFavorites;
