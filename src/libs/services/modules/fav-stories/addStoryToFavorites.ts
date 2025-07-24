import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';

const addStoryToFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, { storyId: number; userId: number }>({
    query: ({ storyId, userId }) => ({
      url: 'fav-stories',
      method: 'POST',
      body: JSON.stringify({
        storyId,
        userId,
      }),
    }),
    invalidatesTags: (_result, _error, { userId }) => [
      { type: 'FavoritesStory', id: 'LIST' },
      { type: 'FavoritesStory', id: userId },
      { type: 'Stories', id: 'LIST' },
    ],
  });

export default addStoryToFavorites;
