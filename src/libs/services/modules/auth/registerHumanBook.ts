import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

const registerHumanBook = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<any, any>({
    query: (form) => ({
      url: 'auth/register/human-books',
      method: 'POST',
      body: form,
    }),
    invalidatesTags: [{ type: 'Admin' }],
  });

export default registerHumanBook;
