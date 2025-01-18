import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const checkRegisterHumanBook = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation({
    query: () => ({
      url: 'auth/upgrade/me',
      method: 'PATCH',
    }),
    transformResponse: (response?: { message?: string }) => {
      return response?.message?.includes('registered');
    },
  });

export default checkRegisterHumanBook;
