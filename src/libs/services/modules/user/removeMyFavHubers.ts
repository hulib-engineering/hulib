import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';

const removeMyFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, void>({
    query: () => ({
      url: 'auth/me/fav-hubers',
      method: 'DELETE',
    }),
    invalidatesTags: [
      { type: 'FavoriteHuber', id: 'LIST' },
      { type: 'Huber' as const, id: 'LIST' },
    ],
  });

export default removeMyFavorites;
