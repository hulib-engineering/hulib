import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { Story } from '../stories/storiesType';

const getMyFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<Story>, void>({
    query: () => ({
      url: 'auth/me/favorites',
    }),
    providesTags: [{ type: 'FavoriteStory', id: 'LIST' }],
  });

export default getMyFavorites;
