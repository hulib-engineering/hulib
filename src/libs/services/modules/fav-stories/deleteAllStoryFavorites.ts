import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';

const deleteAllFavoriteStory = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, { userId: number }>({
    query: ({ userId }) => ({
      url: `fav-stories?userId=${userId}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'FavoritesStory', id: 'LIST' }],
  });

export default deleteAllFavoriteStory;
