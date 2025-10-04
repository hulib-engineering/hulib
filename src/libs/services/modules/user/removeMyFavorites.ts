import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';

const removeMyFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, void>({
    query: () => ({
      url: 'auth/me/favorites',
      method: 'DELETE',
    }),
    invalidatesTags: [
      { type: 'FavoriteStory', id: 'LIST' },
      { type: 'Stories', id: 'LIST' },
    ],
  });

export default removeMyFavorites;
