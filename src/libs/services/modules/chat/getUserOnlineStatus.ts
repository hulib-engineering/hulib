import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<boolean, number>({
    query: (id: number) => `chat/user/${id}/status`,
    transformResponse: ({ isOnline }: { isOnline: boolean }) => {
      return isOnline;
    },
  });
