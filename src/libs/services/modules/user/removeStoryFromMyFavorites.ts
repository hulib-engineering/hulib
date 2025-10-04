import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const removeStoryFromMyFavorites = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<void, number>({
    query: storyId => ({
      url: `auth/me/favorites/${storyId}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: 'FavoriteStory', id },
      { type: 'FavoriteStory', id: 'LIST' },
    ],
  });

export default removeStoryFromMyFavorites;
