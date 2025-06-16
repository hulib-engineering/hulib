import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';

const addStoryToFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, { storyId: number; userId: number }>(
    {
      query: ({ storyId, userId }) => ({
        url: 'fav-stories',
        method: 'POST',
        body: JSON.stringify({
          storyId,
          userId,
        }),
      }),
      // Invalidates the cache of the 'stories' endpoint (or any other relevant query)
      invalidatesTags: [{ type: 'FavoritesStory', id: 'LIST' }],
    },
  );

export default addStoryToFavorites;
