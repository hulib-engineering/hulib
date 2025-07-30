import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { FileType } from '@/libs/services/modules/files/fileType';
import type { PaginatedResponse } from '@/libs/services/type';

export type Sticker = {
  id: number;
  name: string;
  image: FileType | null;
};

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<
    PaginatedResponse<Sticker>,
    { page?: number; limit?: number } | undefined
  >({
    query: paginatedParams => ({
      url: 'stickers',
      params: {
        page: (paginatedParams && paginatedParams?.page) ?? 1,
        limit: (paginatedParams && paginatedParams?.limit) ?? 10,
      },
    }),
    providesTags: [{ type: 'Stickers', id: 'LIST' }],
  });
