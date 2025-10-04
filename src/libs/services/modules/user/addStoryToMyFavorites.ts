import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { Story } from '../stories/storiesType';

const addStoryToMyFavorites = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<Story>, number>({
    query: storyId => ({
      url: 'auth/me/favorites',
      method: 'POST',
      body: JSON.stringify({ storyId }),
    }),
    invalidatesTags: [
      { type: 'FavoriteStory', id: 'LIST' },
    ],
  });

export default addStoryToMyFavorites;
