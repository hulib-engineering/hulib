import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const getSessions = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<any, string>({
    query: () => ({
      url: `reading/sessions`,
    }),
  });

export default getSessions;
