import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export type UpdateMyLanguagePayload = {
  language: 'en' | 'vi';
};

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: UpdateMyLanguagePayload) => ({
      url: 'users/me/language',
      method: 'PATCH',
      body,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }],
  });
