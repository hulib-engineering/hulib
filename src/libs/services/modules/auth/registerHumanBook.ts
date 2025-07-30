import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const registerHuber = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<any, any>({
    query: form => ({
      url: 'auth/register/human-books',
      method: 'POST',
      body: form,
    }),
    invalidatesTags: [{ type: 'Me' }],
  });

export default registerHuber;
