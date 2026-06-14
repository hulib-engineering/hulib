import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Huber } from '../huber/huberType';

type FavoriteHuber = {
  huberId: number;
  huber: Huber;
};

const getMyFavoriteHubers = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<FavoriteHuber[], void>({
    query: () => ({
      url: 'auth/me/fav-hubers',
    }),
    providesTags: [{ type: 'FavoriteHuber', id: 'LIST' }],
  });

export default getMyFavoriteHubers;
