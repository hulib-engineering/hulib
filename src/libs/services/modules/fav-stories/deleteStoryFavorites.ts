import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';

const deleteFavoriteStory = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, { storyId: number; userId: number }>(
    {
      query: ({ storyId, userId }) => ({
        url: `fav-stories/${storyId}?userId=${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'FavoritesStory', id: 'LIST' }],
    },
  );

export default deleteFavoriteStory;
