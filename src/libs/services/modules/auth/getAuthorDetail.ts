import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { Author } from './index';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Author, void>({
    query: (id) => `users/author/${id}`,
    providesTags: [{ type: 'Author', id: 'AUTHOR' }],
  });
