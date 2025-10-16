import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const removeHuberFromMyFavorites = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<void, number>({
    query: huberId => ({
      url: `auth/me/fav-hubers/${huberId}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: 'FavoriteHuber', id },
      { type: 'FavoriteHuber', id: 'LIST' },
    ],
  });

export default removeHuberFromMyFavorites;
