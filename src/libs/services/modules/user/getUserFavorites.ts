import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Story } from '../stories/storiesType';

export type GetUserFavoritesParams = {
  userId: number;
};

const getUserFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<Story[], GetUserFavoritesParams>({
    query: ({ userId }) => ({
      url: 'fav-stories',
      params: { userId },
    }),
    providesTags: (_result, _error, { userId }) => [{ type: 'FavoriteStory', id: `USER-${userId}` }],
  });

export default getUserFavorites;
