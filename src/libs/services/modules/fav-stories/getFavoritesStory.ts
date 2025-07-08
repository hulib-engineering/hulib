import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const getFavoritesStory = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, { id: number }>({
    query: (id) => `fav-stories?userId=${id}`,
    providesTags: [{ type: 'FavoritesStory' }],
  });

export default getFavoritesStory;
