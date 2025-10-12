import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { Story } from '../stories/storiesType';

const getMyFavoriteHubers = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<Story>, void>({
    query: () => ({
      url: 'auth/me/fav-hubers',
    }),
    providesTags: [{ type: 'FavoriteHuber', id: 'LIST' }],
  });

export default getMyFavoriteHubers;
