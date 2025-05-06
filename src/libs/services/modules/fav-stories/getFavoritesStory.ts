import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getFavoritesStory = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, { id: number }>({
    query: (id) => `fav-stories?userId=${id}`,
    providesTags: [{ type: 'FavoritesStory' }],
  });

export default getFavoritesStory;
