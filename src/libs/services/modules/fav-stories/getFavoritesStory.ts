import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const getFavoritesStory = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, number>({
    query: userId => `fav-stories?userId=${userId}`,
    providesTags: (_result, _error, userId) => [
      { type: 'FavoritesStory', id: 'LIST' },
      { type: 'FavoritesStory', id: userId },
    ],
  });

export default getFavoritesStory;
