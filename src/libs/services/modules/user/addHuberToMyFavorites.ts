import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { Story } from '../stories/storiesType';

const addHuberToMyFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, number>({
    query: huberId => ({
      url: 'auth/me/fav-hubers',
      method: 'POST',
      body: JSON.stringify({ huberId }),
    }),
    invalidatesTags: [
      { type: 'FavoriteHuber', id: 'LIST' },
    ],
  });

export default addHuberToMyFavorites;
